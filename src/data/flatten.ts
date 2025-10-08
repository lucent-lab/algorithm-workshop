export interface FlattenOptions {
  delimiter?: string;
}

export interface UnflattenOptions {
  delimiter?: string;
}

export function flatten(value: unknown, options: FlattenOptions = {}): Record<string, unknown> {
  const delimiter = options.delimiter ?? '.';
  const result: Record<string, unknown> = {};

  function walk(current: unknown, path: string[]): void {
    if (isPlainObject(current)) {
      for (const [key, nested] of Object.entries(current)) {
        walk(nested, path.concat(key));
      }
      return;
    }

    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        walk(item, path.concat(String(index)));
      });
      return;
    }

    const joined = path.join(delimiter);
    result[joined] = current;
  }

  walk(value, []);
  return result;
}

export function unflatten(entries: Record<string, unknown>, options: UnflattenOptions = {}): unknown {
  const delimiter = options.delimiter ?? '.';
  const root: Record<string, unknown> = {};

  for (const [compoundKey, value] of Object.entries(entries)) {
    const segments = compoundKey.split(delimiter);
    let current: Record<string, unknown> | unknown[] = root;
    for (let i = 0; i < segments.length; i += 1) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      if (isLast) {
        assign(current, segment, value);
        continue;
      }
      const nextSegment = segments[i + 1];
      const shouldBeArray = isNumeric(nextSegment);
      const nextTarget = ensureChild(current, segment, shouldBeArray);
      current = nextTarget;
    }
  }

  return convertArrays(root);
}

function assign(target: Record<string, unknown> | unknown[], key: string, value: unknown): void {
  if (Array.isArray(target)) {
    const index = Number(key);
    target[index] = value;
  } else {
    target[key] = value;
  }
}

function ensureChild(
  target: Record<string, unknown> | unknown[],
  key: string,
  shouldBeArray: boolean
): Record<string, unknown> | unknown[] {
  if (Array.isArray(target)) {
    const index = Number(key);
    if (target[index] === undefined) {
      target[index] = shouldBeArray ? [] : {};
    }
    const next = target[index];
    if (shouldBeArray && !Array.isArray(next)) {
      target[index] = [];
    } else if (!shouldBeArray && !isPlainObject(next)) {
      target[index] = {};
    }
    return target[index] as Record<string, unknown> | unknown[];
  }

  if (!(key in target)) {
    target[key] = shouldBeArray ? [] : {};
  }
  const next = target[key];
  if (shouldBeArray && !Array.isArray(next)) {
    target[key] = [];
  } else if (!shouldBeArray && !isPlainObject(next)) {
    target[key] = {};
  }
  return target[key] as Record<string, unknown> | unknown[];
}

function convertArrays(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => convertArrays(item));
  }
  if (!isPlainObject(value)) {
    return value;
  }

  const record: Record<string, unknown> = value;
  const keys = Object.keys(record);
  const numericKeys = keys.every((key) => isNumeric(key));
  if (numericKeys) {
    const array: unknown[] = [];
    for (const key of keys.sort((a, b) => Number(a) - Number(b))) {
      array[Number(key)] = convertArrays(record[key]);
    }
    return array;
  }
  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(record)) {
    result[key] = convertArrays(nested);
  }
  return result;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}
