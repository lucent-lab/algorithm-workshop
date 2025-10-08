import { describe, expect, it } from 'vitest';

import { createSaveManager, createMemorySaveStorage } from '../src/index.js';

interface State {
  level: number;
  coins: number;
}

function computeChecksum(raw: string): string {
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

describe('createSaveManager', () => {
  it('saves, loads, and overwrites slots with metadata updates', () => {
    let now = 0;
    const manager = createSaveManager<State>({
      prefix: 'test',
      version: 1,
      getTime: () => now,
    });

    const first = manager.save('slot-1', { level: 3, coins: 120 });
    expect(first.metadata.slotId).toBe('slot-1');
    expect(first.metadata.version).toBe(1);

    const loadResult = manager.load('slot-1');
    expect(loadResult.ok).toBe(true);
    expect(loadResult.data).toMatchObject({ level: 3, coins: 120 });

    now = 10;
    const overwrite = manager.save('slot-1', { level: 4, coins: 180 });
    expect(overwrite.overwritten?.updatedAt).toBe(first.metadata.updatedAt);
    expect(overwrite.metadata.updatedAt).toBe(now);

    expect(manager.list()).toHaveLength(1);
    expect(manager.get('slot-1')?.checksum).toBe(overwrite.metadata.checksum);

    const removed = manager.delete('slot-1');
    expect(removed?.slotId).toBe('slot-1');
    expect(manager.list()).toHaveLength(0);
  });

  it('evicts oldest slots when exceeding maxSlots', () => {
    let now = 0;
    const storage = createMemorySaveStorage();
    const manager = createSaveManager<State>({
      prefix: 'campaign',
      maxSlots: 2,
      storage,
      getTime: () => now,
    });

    manager.save('slot-a', { level: 1, coins: 10 });
    now = 1;
    manager.save('slot-b', { level: 2, coins: 20 });
    now = 2;
    const result = manager.save('slot-c', { level: 3, coins: 30 });

    expect(result.evicted).toBeDefined();
    expect(result.evicted?.[0].slotId).toBe('slot-a');
    expect(manager.get('slot-a')).toBeNull();
    expect(manager.list().map((slot) => slot.slotId)).toEqual(['slot-c', 'slot-b']);
  });

  it('detects corrupted payloads and parse errors', () => {
    const storage = createMemorySaveStorage();
    const manager = createSaveManager<State>({
      prefix: 'corrupt',
      storage,
    });

    manager.save('slot-1', { level: 2, coins: 50 });

    const key = 'corrupt::slot-1';
    const raw = storage.getItem(key);
    expect(raw).not.toBeNull();
    const payload = JSON.parse(raw as string) as { data: string; checksum: string };

    // Corrupt data without updating checksum – should fail integrity.
    payload.data = JSON.stringify({ level: 99, coins: 9999 });
    storage.setItem(key, JSON.stringify(payload));
    const corrupted = manager.load('slot-1');
    expect(corrupted.ok).toBe(false);
    expect(corrupted.error).toBe('corrupted');

    // Adjust checksum but provide invalid JSON for the deserializer – should fail parsing.
    payload.data = '{invalid json';
    payload.checksum = computeChecksum(payload.data);
    storage.setItem(key, JSON.stringify(payload));
    const parseFailure = manager.load('slot-1');
    expect(parseFailure.ok).toBe(false);
    expect(parseFailure.error).toBe('parse-error');

    expect(manager.clear()).toHaveLength(1);
    expect(manager.list()).toHaveLength(0);
  });
});
