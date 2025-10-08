const DEFAULT_PREFIX = 'slot';

interface StoredPayload {
  checksum: string;
  updatedAt: number;
  version?: number;
  size: number;
  data: string;
}

export interface SaveSlotMetadata {
  slotId: string;
  checksum: string;
  updatedAt: number;
  size: number;
  version?: number;
}

export interface SaveResult {
  metadata: SaveSlotMetadata;
  overwritten?: SaveSlotMetadata;
  evicted?: ReadonlyArray<SaveSlotMetadata>;
}

export type LoadError = 'not-found' | 'corrupted' | 'parse-error';

export interface LoadResult<T> {
  ok: boolean;
  slotId: string;
  data?: T;
  metadata?: SaveSlotMetadata;
  error?: LoadError;
}

export interface SaveStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  keys(): Iterable<string>;
}

export interface SaveManagerOptions<T> {
  prefix?: string;
  storage?: SaveStorageAdapter;
  serializer?: (data: T) => string;
  deserializer?: (raw: string) => T;
  checksum?: (raw: string) => string;
  getTime?: () => number;
  version?: number;
  maxSlots?: number;
}

export interface SaveManager<T> {
  save(slotId: string, data: T, time?: number): SaveResult;
  load(slotId: string): LoadResult<T>;
  delete(slotId: string): SaveSlotMetadata | null;
  list(): ReadonlyArray<SaveSlotMetadata>;
  get(slotId: string): SaveSlotMetadata | null;
  verify(slotId: string): boolean;
  clear(): ReadonlyArray<SaveSlotMetadata>;
  getStorage(): SaveStorageAdapter;
}

export function createMemorySaveStorage(): SaveStorageAdapter {
  const memory = new Map<string, string>();
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
    removeItem: (key) => {
      memory.delete(key);
    },
    keys: () => memory.keys(),
  };
}

export function createSaveManager<T>(options: SaveManagerOptions<T>): SaveManager<T> {
  const storage = options.storage ?? createMemorySaveStorage();
  const serializer = options.serializer ?? ((data: T) => JSON.stringify(data));
  const deserializer = options.deserializer ?? ((raw: string) => JSON.parse(raw) as T);
  const checksum = options.checksum ?? defaultChecksum;
  const prefix = options.prefix ?? DEFAULT_PREFIX;
  const version = options.version;
  const getTime = options.getTime;
  const maxSlots = options.maxSlots;

  if (maxSlots !== undefined) {
    assertPositiveInteger(maxSlots, 'maxSlots');
  }

  const prefixKey = `${prefix}::`;

  function resolveTime(explicit?: number): number {
    if (explicit !== undefined) {
      assertFiniteNumber(explicit, 'time');
      return explicit;
    }
    if (getTime) {
      const value = getTime();
      assertFiniteNumber(value, 'getTime()');
      return value;
    }
    return Date.now() / 1000;
  }

  function composeKey(slotId: string): string {
    return `${prefixKey}${slotId}`;
  }

  function save(slotId: string, data: T, time?: number): SaveResult {
    const normalizedSlotId = normalizeSlotId(slotId);
    const timestamp = resolveTime(time);
    const raw = serializer(data);
    if (typeof raw !== 'string') {
      throw new Error('serializer must return a string.');
    }
    const payload: StoredPayload = {
      checksum: checksum(raw),
      updatedAt: timestamp,
      version,
      size: raw.length,
      data: raw,
    };

    const key = composeKey(normalizedSlotId);
    const previous = readSlot(normalizedSlotId);
    storage.setItem(key, JSON.stringify(payload));

    const metadata = toMetadata(normalizedSlotId, payload);
    let evicted: SaveSlotMetadata[] | undefined;

    if (maxSlots !== undefined) {
      const all = getAllSlots();
      if (all.length > maxSlots) {
        const sorted = all
          .sort((a, b) => a.metadata.updatedAt - b.metadata.updatedAt)
          .filter((entry) => entry.metadata.slotId !== normalizedSlotId || entry.key !== key);
        while (sorted.length > 0 && all.length - (evicted?.length ?? 0) > maxSlots) {
          const oldest = sorted.shift();
          if (!oldest) {
            break;
          }
          storage.removeItem(oldest.key);
          if (!evicted) {
            evicted = [];
          }
          evicted.push(oldest.metadata);
        }
      }
    }

    return {
      metadata,
      overwritten: previous?.metadata,
      evicted,
    };
  }

  function load(slotId: string): LoadResult<T> {
    const normalizedSlotId = normalizeSlotId(slotId);
    const record = readSlot(normalizedSlotId);
    if (!record) {
      return { ok: false, slotId: normalizedSlotId, error: 'not-found' };
    }
    const { payload, metadata } = record;
    const expected = checksum(payload.data);
    if (payload.checksum !== expected) {
      return { ok: false, slotId: normalizedSlotId, error: 'corrupted', metadata };
    }
    try {
      return {
        ok: true,
        slotId: normalizedSlotId,
        data: deserializer(payload.data),
        metadata,
      };
    } catch (_error) {
      return { ok: false, slotId: normalizedSlotId, error: 'parse-error', metadata };
    }
  }

  function deleteSlot(slotId: string): SaveSlotMetadata | null {
    const normalizedSlotId = normalizeSlotId(slotId);
    const record = readSlot(normalizedSlotId);
    if (!record) {
      return null;
    }
    storage.removeItem(record.key);
    return record.metadata;
  }

  function list(): ReadonlyArray<SaveSlotMetadata> {
    return getAllSlots()
      .map((entry) => entry.metadata)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function get(slotId: string): SaveSlotMetadata | null {
    const normalizedSlotId = normalizeSlotId(slotId);
    const record = readSlot(normalizedSlotId);
    return record?.metadata ?? null;
  }

  function verify(slotId: string): boolean {
    const normalizedSlotId = normalizeSlotId(slotId);
    const record = readSlot(normalizedSlotId);
    if (!record) {
      return false;
    }
    const expected = checksum(record.payload.data);
    return expected === record.payload.checksum;
  }

  function clear(): ReadonlyArray<SaveSlotMetadata> {
    const removed: SaveSlotMetadata[] = [];
    for (const entry of getAllSlots()) {
      storage.removeItem(entry.key);
      removed.push(entry.metadata);
    }
    return removed;
  }

  function getAllSlots(): Array<{ key: string; payload: StoredPayload; metadata: SaveSlotMetadata }> {
    const entries: Array<{ key: string; payload: StoredPayload; metadata: SaveSlotMetadata }> = [];
    for (const key of storage.keys()) {
      if (!key.startsWith(prefixKey)) {
        continue;
      }
      const slotId = key.slice(prefixKey.length);
      const record = readKey(key, slotId);
      if (record) {
        entries.push(record);
      }
    }
    return entries;
  }

  function readKey(key: string, slotId: string): { key: string; payload: StoredPayload; metadata: SaveSlotMetadata } | null {
    const raw = storage.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      const payload = JSON.parse(raw) as StoredPayload;
      if (
        !payload ||
        typeof payload.data !== 'string' ||
        typeof payload.updatedAt !== 'number' ||
        typeof payload.checksum !== 'string' ||
        typeof payload.size !== 'number'
      ) {
        return null;
      }
      const metadata = toMetadata(slotId, payload);
      return { key, payload, metadata };
    } catch (_error) {
      return null;
    }
  }

  function readSlot(slotId: string): { key: string; payload: StoredPayload; metadata: SaveSlotMetadata } | null {
    return readKey(composeKey(slotId), slotId);
  }

  function getStorage(): SaveStorageAdapter {
    return storage;
  }

  return {
    save,
    load,
    delete: deleteSlot,
    list,
    get,
    verify,
    clear,
    getStorage,
  };
}

function toMetadata(slotId: string, payload: StoredPayload): SaveSlotMetadata {
  return {
    slotId,
    checksum: payload.checksum,
    updatedAt: payload.updatedAt,
    size: payload.size,
    version: payload.version,
  };
}

function normalizeSlotId(slotId: string): string {
  if (typeof slotId !== 'string') {
    throw new Error('slotId must be a string.');
  }
  const trimmed = slotId.trim();
  if (trimmed.length === 0) {
    throw new Error('slotId must not be empty.');
  }
  return trimmed;
}

function defaultChecksum(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function assertFiniteNumber(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}
