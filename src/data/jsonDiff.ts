import { deepClone } from './deepClone.js';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };
export type JsonPathSegment = string | number;

export type JsonDiffOperation =
  | { op: 'add'; path: JsonPathSegment[]; value: JsonValue }
  | { op: 'remove'; path: JsonPathSegment[] }
  | { op: 'replace'; path: JsonPathSegment[]; value: JsonValue };

/**
 * Computes a structural diff between two JSON-compatible values.
 * Useful for: syncing cached state, generating patches, change feeds.
 */
export interface DiffJsonAdvancedOptions {
  ignoreKeys?: ReadonlyArray<string>;
  pathFilter?: (path: JsonPathSegment[]) => boolean;
}

export function diffJson(previous: JsonValue, next: JsonValue): JsonDiffOperation[] {
  return diffJsonAdvanced(previous, next, {});
}

export function diffJsonAdvanced(
  previous: JsonValue,
  next: JsonValue,
  options: DiffJsonAdvancedOptions = {}
): JsonDiffOperation[] {
  const ignoreSet = new Set(options.ignoreKeys ?? []);
  const operations: JsonDiffOperation[] = [];
  walkDiff(previous, next, [], operations);
  return operations;

  function walkDiff(
    prev: JsonValue,
    nxt: JsonValue,
    path: JsonPathSegment[],
    ops: JsonDiffOperation[]
  ): void {
    if (options.pathFilter && !options.pathFilter(path)) {
      return;
    }

    if (Object.is(prev, nxt)) {
      return;
    }

    if (Array.isArray(prev) && Array.isArray(nxt)) {
      diffArray(prev, nxt, path, ops);
      return;
    }

    if (isPlainObject(prev) && isPlainObject(nxt)) {
      diffObject(prev, nxt, path, ops);
      return;
    }

    ops.push({ op: 'replace', path, value: deepClone(nxt) });
  }

  function diffArray(prev: JsonValue[], nxt: JsonValue[], path: JsonPathSegment[], ops: JsonDiffOperation[]): void {
    const minLength = Math.min(prev.length, nxt.length);

    for (let index = 0; index < minLength; index += 1) {
      const prevValue = prev[index];
      const nextValue = nxt[index];
      walkDiff(prevValue, nextValue, [...path, index], ops);
    }

    for (let index = prev.length - 1; index >= nxt.length; index -= 1) {
      ops.push({ op: 'remove', path: [...path, index] });
    }

    for (let index = minLength; index < nxt.length; index += 1) {
      ops.push({ op: 'add', path: [...path, index], value: deepClone(nxt[index]) });
    }
  }

  function diffObject(prev: JsonObject, nxt: JsonObject, path: JsonPathSegment[], ops: JsonDiffOperation[]): void {
    const prevKeys = new Set(Object.keys(prev).filter((key) => !ignoreSet.has(key)));
    const nextKeys = new Set(Object.keys(nxt).filter((key) => !ignoreSet.has(key)));

    for (const key of nextKeys) {
      if (prevKeys.has(key)) {
        walkDiff(prev[key], nxt[key], [...path, key], ops);
        prevKeys.delete(key);
      } else {
        ops.push({ op: 'add', path: [...path, key], value: deepClone(nxt[key]) });
      }
    }

    for (const key of prevKeys) {
      ops.push({ op: 'remove', path: [...path, key] });
    }
  }
}

/**
 * Applies a JSON diff to a value and returns a new structure.
 * Useful for: reconstructing snapshots, applying remote patches, optimistic updates.
 */
export interface ApplyJsonDiffOptions {
  shouldApply?: (operation: JsonDiffOperation) => boolean;
  pathFilter?: (path: JsonPathSegment[]) => boolean;
}

export function applyJsonDiff<T extends JsonValue>(value: T, diff: JsonDiffOperation[]): JsonValue {
  return applyJsonDiffSelective(value, diff);
}

export function applyJsonDiffSelective<T extends JsonValue>(
  value: T,
  diff: JsonDiffOperation[],
  options: ApplyJsonDiffOptions = {}
): JsonValue {
  const predicate = createDiffPredicate(options);
  let result: JsonValue = deepClone(value);
  for (const operation of diff) {
    if (!predicate(operation)) {
      continue;
    }
    result = applyOperation(result, operation);
  }
  return result;
}

function applyOperation(root: JsonValue, operation: JsonDiffOperation): JsonValue {
  if (operation.path.length === 0) {
    if (operation.op === 'remove') {
      return null;
    }
    return deepClone(operation.value);
  }

  const parentPath = operation.path.slice(0, -1);
  const key = operation.path[operation.path.length - 1];
  if (key === undefined) {
    throw new Error('Operation path is invalid.');
  }
  const parent = resolveParent(root, parentPath, operation.op === 'add');

  if (parent === null || typeof parent !== 'object') {
    throw new Error(`Cannot apply patch at path ${JSON.stringify(operation.path)}`);
  }

  if (Array.isArray(parent)) {
    return applyArrayOperation(root, parent, key, operation);
  }

  if (!isJsonObject(parent)) {
    throw new Error(`Cannot apply patch at path ${JSON.stringify(operation.path)}`);
  }

  return applyObjectOperation(root, parent, key, operation);
}

function applyArrayOperation(
  root: JsonValue,
  parent: JsonValue[],
  key: JsonPathSegment,
  operation: JsonDiffOperation
): JsonValue {
  if (typeof key !== 'number') {
    throw new Error(`Array path segment must be a number. Received ${String(key)}`);
  }

  switch (operation.op) {
    case 'add':
      parent.splice(Math.min(key, parent.length), 0, deepClone(operation.value));
      break;
    case 'replace':
      if (key < 0 || key >= parent.length) {
        throw new Error(`Cannot replace index ${key} on array of length ${parent.length}`);
      }
      parent[key] = deepClone(operation.value);
      break;
    case 'remove':
      if (key < 0 || key >= parent.length) {
        throw new Error(`Cannot remove index ${key} on array of length ${parent.length}`);
      }
      parent.splice(key, 1);
      break;
    default:
      throw new Error(`Unsupported operation ${(operation as JsonDiffOperation).op}`);
  }

  return root;
}

function applyObjectOperation(
  root: JsonValue,
  parent: JsonObject,
  key: JsonPathSegment,
  operation: JsonDiffOperation
): JsonValue {
  if (typeof key !== 'string') {
    throw new Error(`Object path segment must be a string. Received ${String(key)}`);
  }

  switch (operation.op) {
    case 'add':
    case 'replace':
      parent[key] = deepClone(operation.value);
      break;
    case 'remove':
      delete parent[key];
      break;
    default:
      throw new Error(`Unsupported operation ${(operation as JsonDiffOperation).op}`);
  }

  return root;
}

function createDiffPredicate(options: ApplyJsonDiffOptions): (operation: JsonDiffOperation) => boolean {
  if (!options.shouldApply && !options.pathFilter) {
    return () => true;
  }
  return (operation) => {
    if (options.pathFilter && !options.pathFilter(operation.path)) {
      return false;
    }
    if (options.shouldApply && !options.shouldApply(operation)) {
      return false;
    }
    return true;
  };
}

function resolveParent(value: JsonValue, path: JsonPathSegment[], allowCreate: boolean): JsonValue | null {
  if (path.length === 0) {
    return value;
  }

  let cursor: JsonValue = value;
  for (let i = 0; i < path.length; i += 1) {
    const segment = path[i];
    const isLast = i === path.length - 1;
    if (Array.isArray(cursor)) {
      if (typeof segment !== 'number' || segment < 0 || segment >= cursor.length) {
        throw new Error(`Invalid array path segment ${String(segment)}`);
      }
      cursor = cursor[segment];
      continue;
    }

    if (cursor === null || typeof cursor !== 'object') {
      throw new Error(`Cannot traverse into non-object segment ${JSON.stringify(segment)}`);
    }

    if (typeof segment !== 'string') {
      throw new Error(`Object path segment must be a string. Received ${String(segment)}`);
    }

    if (!isJsonObject(cursor)) {
      throw new Error(`Cannot traverse into non-object segment ${JSON.stringify(segment)}`);
    }
    const record = cursor;
    if (!(segment in record)) {
      if (!allowCreate) {
        throw new Error(`Missing path segment ${String(segment)}`);
      }
      const nextSegment = isLast ? undefined : path[i + 1];
      const newValue: JsonValue = typeof nextSegment === 'number' ? [] : {};
      record[segment] = newValue;
    }
    cursor = record[segment];
  }
  return cursor;
}

function isPlainObject(value: unknown): value is { [key: string]: JsonValue } {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Reflect.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
