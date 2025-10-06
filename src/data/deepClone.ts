/**
 * Creates a deep clone of plain objects, arrays, Maps, and Sets.
 * Useful for: immutability patterns, undo buffers, branching state.
 */
export function deepClone<T>(value: T, seen: WeakMap<object, unknown> = new WeakMap()): T {
  if (!(value instanceof Object)) {
    return value;
  }

  if (seen.has(value as object)) {
    return seen.get(value as object) as T;
  }

  if (Array.isArray(value)) {
    const result: unknown[] = [];
    seen.set(value, result);
    for (const item of value) {
      result.push(deepClone(item, seen));
    }
    return result as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof Map) {
    const result = new Map();
    seen.set(value, result);
    for (const [key, val] of value.entries()) {
      result.set(key, deepClone(val, seen));
    }
    return result as T;
  }

  if (value instanceof Set) {
    const result = new Set();
    seen.set(value, result);
    for (const item of value.values()) {
      result.add(deepClone(item, seen));
    }
    return result as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  const result: Record<PropertyKey, unknown> = {};
  seen.set(value as object, result);
  for (const [key, val] of Object.entries(value as Record<PropertyKey, unknown>)) {
    result[key] = deepClone(val, seen);
  }

  return result as T;
}
