import { deepClone } from './deepClone.js';

export interface TreeNode<TValue = unknown> {
  id: string;
  value?: TValue;
  children?: TreeNode<TValue>[];
}

export interface TreeInsertOperation<TValue = unknown> {
  type: 'insert';
  id: string;
  parentId: string | null;
  index: number;
  node: TreeNode<TValue>;
}

export interface TreeRemoveOperation {
  type: 'remove';
  id: string;
  parentId: string | null;
}

export interface TreeMoveOperation {
  type: 'move';
  id: string;
  parentId: string | null;
  index: number;
}

export interface TreeUpdateOperation<TValue = unknown> {
  type: 'update';
  id: string;
  value: TValue | undefined;
  hasValue: boolean;
}

export type TreeDiffOperation<TValue = unknown> =
  | TreeInsertOperation<TValue>
  | TreeRemoveOperation
  | TreeMoveOperation
  | TreeUpdateOperation<TValue>;

export interface TreeDiffOptions<TValue = unknown> {
  /**
   * Custom equality comparator for node values. Defaults to deep structural comparison.
   */
  isEqual?: (previous: TreeNode<TValue>, next: TreeNode<TValue>) => boolean;
}

interface IndexedNode<TValue> {
  node: TreeNode<TValue>;
  parentId: string | null;
  index: number;
  depth: number;
}

export function diffTree<TValue = unknown>(
  previous: ReadonlyArray<TreeNode<TValue>>,
  next: ReadonlyArray<TreeNode<TValue>>,
  options: TreeDiffOptions<TValue> = {}
): TreeDiffOperation<TValue>[] {
  const previousIndex = indexTree(previous);
  const nextIndex = indexTree(next);

  const previousIds = new Set(previousIndex.keys());
  const nextIds = new Set(nextIndex.keys());

  const removedIds = new Set<string>();
  for (const id of previousIds) {
    if (!nextIds.has(id)) {
      removedIds.add(id);
    }
  }

  const insertedIds = new Set<string>();
  for (const id of nextIds) {
    if (!previousIds.has(id)) {
      insertedIds.add(id);
    }
  }

  const operations: TreeDiffOperation<TValue>[] = [];

  const removeOps = buildRemovalOperations(previousIndex, removedIds);
  operations.push(...removeOps);

  const insertOps = buildInsertOperations(nextIndex, insertedIds);
  operations.push(...insertOps);

  const moveOps = buildMoveOperations(previousIndex, nextIndex, insertedIds, removedIds);
  operations.push(...moveOps);

  const updateOps = buildUpdateOperations(previousIndex, nextIndex, insertedIds, removedIds, options.isEqual);
  operations.push(...updateOps);

  return operations;
}

export function applyTreeDiff<TValue = unknown>(
  tree: ReadonlyArray<TreeNode<TValue>>,
  diff: ReadonlyArray<TreeDiffOperation<TValue>>
): TreeNode<TValue>[] {
  const result = cloneTree(tree);

  for (const operation of diff) {
    switch (operation.type) {
      case 'remove':
        removeNode(result, operation);
        break;
      case 'insert':
        insertNode(result, operation);
        break;
      case 'move':
        moveNode(result, operation);
        break;
      case 'update':
        updateNode(result, operation);
        break;
      default: {
        // Exhaustive check to satisfy TypeScript.
        const exhaustive: never = operation;
        throw new Error(`Unsupported tree diff operation: ${JSON.stringify(exhaustive)}`);
      }
    }
  }

  return result;
}

function indexTree<TValue>(nodes: ReadonlyArray<TreeNode<TValue>>): Map<string, IndexedNode<TValue>> {
  const index = new Map<string, IndexedNode<TValue>>();
  const stack: Array<{ nodes: ReadonlyArray<TreeNode<TValue>>; parentId: string | null; depth: number }> = [
    { nodes, parentId: null, depth: 0 },
  ];

  while (stack.length > 0) {
    const { nodes: currentNodes, parentId, depth } = stack.pop()!;
    currentNodes.forEach((node, nodeIndex) => {
      if (index.has(node.id)) {
        throw new Error(`Duplicate node id detected: ${node.id}`);
      }
      index.set(node.id, {
        node,
        parentId,
        index: nodeIndex,
        depth,
      });

      const children = node.children ?? [];
      if (children.length > 0) {
        stack.push({ nodes: children, parentId: node.id, depth: depth + 1 });
      }
    });
  }

  return index;
}

function buildRemovalOperations<TValue>(
  previousIndex: Map<string, IndexedNode<TValue>>,
  removedIds: Set<string>
): TreeRemoveOperation[] {
  const ids: string[] = [];
  for (const id of removedIds) {
    const meta = previousIndex.get(id);
    if (!meta) {
      continue;
    }
    if (meta.parentId !== null && removedIds.has(meta.parentId)) {
      continue;
    }
    ids.push(id);
  }

  ids.sort((a, b) => {
    const depthA = previousIndex.get(a)?.depth ?? 0;
    const depthB = previousIndex.get(b)?.depth ?? 0;
    if (depthA !== depthB) {
      return depthB - depthA;
    }
    const parentA = previousIndex.get(a)?.parentId ?? '';
    const parentB = previousIndex.get(b)?.parentId ?? '';
    if (parentA !== parentB) {
      return parentA.localeCompare(parentB);
    }
    const indexA = previousIndex.get(a)?.index ?? 0;
    const indexB = previousIndex.get(b)?.index ?? 0;
    return indexA - indexB;
  });

  return ids.map((id) => {
    const meta = previousIndex.get(id)!;
    return {
      type: 'remove' as const,
      id,
      parentId: meta.parentId,
    };
  });
}

function buildInsertOperations<TValue>(
  nextIndex: Map<string, IndexedNode<TValue>>,
  insertedIds: Set<string>
): TreeInsertOperation<TValue>[] {
  const ids: string[] = [];
  for (const id of insertedIds) {
    const meta = nextIndex.get(id);
    if (!meta) {
      continue;
    }
    if (meta.parentId !== null && insertedIds.has(meta.parentId)) {
      continue;
    }
    ids.push(id);
  }

  ids.sort((a, b) => {
    const depthA = nextIndex.get(a)?.depth ?? 0;
    const depthB = nextIndex.get(b)?.depth ?? 0;
    if (depthA !== depthB) {
      return depthA - depthB;
    }
    const parentA = nextIndex.get(a)?.parentId ?? '';
    const parentB = nextIndex.get(b)?.parentId ?? '';
    if (parentA !== parentB) {
      return parentA.localeCompare(parentB);
    }
    const indexA = nextIndex.get(a)?.index ?? 0;
    const indexB = nextIndex.get(b)?.index ?? 0;
    return indexA - indexB;
  });

  return ids.map((id) => {
    const meta = nextIndex.get(id)!;
    const prunedNode = pruneInsertedNode(meta.node, insertedIds);
    return {
      type: 'insert' as const,
      id,
      parentId: meta.parentId,
      index: meta.index,
      node: prunedNode,
    };
  });
}

function buildMoveOperations<TValue>(
  previousIndex: Map<string, IndexedNode<TValue>>,
  nextIndex: Map<string, IndexedNode<TValue>>,
  insertedIds: Set<string>,
  removedIds: Set<string>
): TreeMoveOperation[] {
  const moves: TreeMoveOperation[] = [];

  for (const [id, nextMeta] of nextIndex.entries()) {
    if (!previousIndex.has(id)) {
      continue;
    }
    if (insertedIds.has(id) || removedIds.has(id)) {
      continue;
    }
    const prevMeta = previousIndex.get(id)!;
    const parentChanged = prevMeta.parentId !== nextMeta.parentId;
    const indexChanged = prevMeta.index !== nextMeta.index;
    if (!parentChanged && !indexChanged) {
      continue;
    }
    moves.push({
      type: 'move',
      id,
      parentId: nextMeta.parentId,
      index: nextMeta.index,
    });
  }

  moves.sort((a, b) => {
    const depthA = nextIndex.get(a.id)?.depth ?? 0;
    const depthB = nextIndex.get(b.id)?.depth ?? 0;
    if (depthA !== depthB) {
      return depthA - depthB;
    }
    const parentA = (nextIndex.get(a.id)?.parentId ?? '');
    const parentB = (nextIndex.get(b.id)?.parentId ?? '');
    if (parentA !== parentB) {
      return parentA.localeCompare(parentB);
    }
    const indexA = nextIndex.get(a.id)?.index ?? 0;
    const indexB = nextIndex.get(b.id)?.index ?? 0;
    return indexA - indexB;
  });

  return moves;
}

function buildUpdateOperations<TValue>(
  previousIndex: Map<string, IndexedNode<TValue>>,
  nextIndex: Map<string, IndexedNode<TValue>>,
  insertedIds: Set<string>,
  removedIds: Set<string>,
  isEqual?: (previous: TreeNode<TValue>, next: TreeNode<TValue>) => boolean
): TreeUpdateOperation<TValue>[] {
  const updates: TreeUpdateOperation<TValue>[] = [];
  const comparator = isEqual ?? defaultNodeEqual;

  for (const [id, nextMeta] of nextIndex.entries()) {
    if (!previousIndex.has(id)) {
      continue;
    }
    if (insertedIds.has(id) || removedIds.has(id)) {
      continue;
    }
    const prevMeta = previousIndex.get(id)!;
    if (comparator(prevMeta.node, nextMeta.node)) {
      continue;
    }
    const hasValue = Object.prototype.hasOwnProperty.call(nextMeta.node, 'value');
    const value = hasValue ? deepClone(nextMeta.node.value) : undefined;
    updates.push({
      type: 'update',
      id,
      value,
      hasValue,
    });
  }

  return updates;
}

function pruneInsertedNode<TValue>(
  node: TreeNode<TValue>,
  insertedIds: Set<string>
): TreeNode<TValue> {
  const cloned: TreeNode<TValue> = { id: node.id };
  if (Object.prototype.hasOwnProperty.call(node, 'value')) {
    cloned.value = deepClone(node.value);
  }

  if (node.children && node.children.length > 0) {
    const children = node.children
      .filter((child) => insertedIds.has(child.id))
      .map((child) => pruneInsertedNode(child, insertedIds));
    if (children.length > 0) {
      cloned.children = children;
    }
  }

  return cloned;
}

function cloneTree<TValue>(nodes: ReadonlyArray<TreeNode<TValue>>): TreeNode<TValue>[] {
  return nodes.map((node) => cloneNode(node));
}

function cloneNode<TValue>(node: TreeNode<TValue>): TreeNode<TValue> {
  const cloned: TreeNode<TValue> = { id: node.id };
  if (Object.prototype.hasOwnProperty.call(node, 'value')) {
    cloned.value = deepClone(node.value);
  }
  if (node.children && node.children.length > 0) {
    cloned.children = node.children.map((child) => cloneNode(child));
  }
  return cloned;
}

function removeNode<TValue>(tree: TreeNode<TValue>[], operation: TreeRemoveOperation): void {
  const result = findNode(tree, operation.id);
  if (!result) {
    throw new Error(`Cannot remove node with id "${operation.id}" because it does not exist.`);
  }
  const { siblings, index } = result;
  siblings.splice(index, 1);
}

function insertNode<TValue>(tree: TreeNode<TValue>[], operation: TreeInsertOperation<TValue>): void {
  const targetSiblings = resolveSiblings(tree, operation.parentId);
  const node = cloneNode(operation.node);
  const index = clampIndex(operation.index, targetSiblings.length);
  targetSiblings.splice(index, 0, node);
}

function moveNode<TValue>(tree: TreeNode<TValue>[], operation: TreeMoveOperation): void {
  const current = findNode(tree, operation.id);
  if (!current) {
    throw new Error(`Cannot move node with id "${operation.id}" because it does not exist.`);
  }
  current.siblings.splice(current.index, 1);

  const targetSiblings = resolveSiblings(tree, operation.parentId);
  let targetIndex = clampIndex(operation.index, targetSiblings.length);
  if (targetSiblings === current.siblings && current.index < targetIndex) {
    targetIndex -= 1;
  }
  targetSiblings.splice(targetIndex, 0, current.node);
}

function updateNode<TValue>(tree: TreeNode<TValue>[], operation: TreeUpdateOperation<TValue>): void {
  const current = findNode(tree, operation.id);
  if (!current) {
    throw new Error(`Cannot update node with id "${operation.id}" because it does not exist.`);
  }
  if (operation.hasValue) {
    current.node.value = deepClone(operation.value);
  } else {
    delete current.node.value;
  }
}

interface LocatedNode<TValue> {
  node: TreeNode<TValue>;
  siblings: TreeNode<TValue>[];
  index: number;
}

function findNode<TValue>(
  nodes: TreeNode<TValue>[],
  id: string
): LocatedNode<TValue> | null {
  const stack: Array<{ siblings: TreeNode<TValue>[]; index: number }> = [];
  stack.push({ siblings: nodes, index: 0 });

  while (stack.length > 0) {
    const frame = stack.pop()!;
    const { siblings, index } = frame;
    for (let cursor = index; cursor < siblings.length; cursor += 1) {
      const node = siblings[cursor];
      if (node.id === id) {
        return { node, siblings, index: cursor };
      }
      if (node.children && node.children.length > 0) {
        stack.push({ siblings: node.children, index: 0 });
      }
    }
  }

  return null;
}

function resolveSiblings<TValue>(
  tree: TreeNode<TValue>[],
  parentId: string | null
): TreeNode<TValue>[] {
  if (parentId === null) {
    return tree;
  }

  const located = findNode(tree, parentId);
  if (!located) {
    throw new Error(`Cannot resolve parent with id "${parentId}".`);
  }
  if (!located.node.children) {
    located.node.children = [];
  }
  return located.node.children;
}

function clampIndex(index: number, length: number): number {
  if (!Number.isInteger(index) || index < 0) {
    return 0;
  }
  if (index > length) {
    return length;
  }
  return index;
}

function defaultNodeEqual<TValue>(prev: TreeNode<TValue>, next: TreeNode<TValue>): boolean {
  return deepEqual(prev.value, next.value);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a === null || b === null) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let index = 0; index < a.length; index += 1) {
      if (!deepEqual(a[index], b[index])) {
        return false;
      }
    }
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }
    for (const [key, value] of a.entries()) {
      if (!b.has(key) || !deepEqual(value, b.get(key))) {
        return false;
      }
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) {
      return false;
    }
    for (const value of a.values()) {
      let found = false;
      for (const candidate of b.values()) {
        if (deepEqual(value, candidate)) {
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        return false;
      }
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}
