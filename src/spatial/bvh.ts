import type { Box3, Ray3D } from '../types.js';

export type BvhAxis = 'x' | 'y' | 'z';

export interface BvhEntry<T> {
  item: T;
  bounds: Box3;
}

export interface BvhLeaf<T> {
  type: 'leaf';
  bounds: Box3;
  entries: Array<BvhEntry<T>>;
}

export interface BvhBranch<T> {
  type: 'branch';
  bounds: Box3;
  axis: BvhAxis;
  left: BvhNode<T>;
  right: BvhNode<T>;
}

export type BvhNode<T> = BvhLeaf<T> | BvhBranch<T>;

export interface BuildBvhOptions<T> {
  getBounds(item: T): Box3;
  maxLeafSize?: number;
  maxDepth?: number;
}

export function buildBvh<T>(
  items: ReadonlyArray<T>,
  options: BuildBvhOptions<T>
): BvhNode<T> | null {
  if (!options || typeof options.getBounds !== 'function') {
    throw new TypeError('options.getBounds must be a function returning Box3 bounds.');
  }
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const maxLeafSize = Math.max(1, Math.floor(options.maxLeafSize ?? 4));
  const maxDepth = Math.max(1, Math.floor(options.maxDepth ?? 24));

  const entries = items.map<BvhEntry<T>>((item: T) => {
    const bounds = cloneBox(options.getBounds(item));
    validateBox(bounds);
    return { item, bounds };
  });

  return build(entries.slice(), 0);

  function build(currentEntries: Array<BvhEntry<T>>, depth: number): BvhNode<T> {
    const bounds = computeBounds(currentEntries);
    if (
      currentEntries.length <= maxLeafSize ||
      depth >= maxDepth ||
      isDegenerate(bounds)
    ) {
      return {
        type: 'leaf',
        bounds,
        entries: currentEntries.slice(),
      };
    }

    const axis = chooseSplitAxis(bounds);
    currentEntries.sort(
      (a, b) => centerAlongAxis(a.bounds, axis) - centerAlongAxis(b.bounds, axis)
    );
    const mid = Math.floor(currentEntries.length / 2);
    const leftEntries = currentEntries.slice(0, mid);
    const rightEntries = currentEntries.slice(mid);

    if (leftEntries.length === 0 || rightEntries.length === 0) {
      return {
        type: 'leaf',
        bounds,
        entries: currentEntries.slice(),
      };
    }

    return {
      type: 'branch',
      bounds,
      axis,
      left: build(leftEntries, depth + 1),
      right: build(rightEntries, depth + 1),
    };
  }
}

export function queryBvh<T>(
  node: BvhNode<T> | null,
  query: Box3,
  results: Array<BvhEntry<T>> = []
): Array<BvhEntry<T>> {
  if (!node) {
    return results;
  }
  validateBox(query);
  collect(node, query, results);
  return results;
}

export interface BvhRaycastHit<T> {
  entry: BvhEntry<T>;
  distance: number;
}

export function raycastBvh<T>(
  node: BvhNode<T> | null,
  ray: Ray3D,
  intersect: (entry: BvhEntry<T>, ray: Ray3D) => number | null,
  maxDistance = Infinity
): BvhRaycastHit<T> | null {
  if (!node) {
    return null;
  }
  validateRay(ray);
  let upperBound = Number.isFinite(maxDistance) ? maxDistance : Infinity;
  const rootHit = rayAabb(ray, node.bounds, upperBound);
  if (rootHit == null) {
    return null;
  }

  let closest: BvhRaycastHit<T> | null = null;
  const stack: Array<{ node: BvhNode<T>; distance: number }> = [
    { node, distance: rootHit },
  ];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (closest && current.distance > closest.distance) {
      continue;
    }

    if (current.node.type === 'leaf') {
      for (const entry of current.node.entries) {
        const hitDistance = intersect(entry, ray);
        if (hitDistance == null || hitDistance < 0) {
          continue;
        }
        if (!Number.isFinite(hitDistance)) {
          throw new Error('intersect callback must return a finite distance.');
        }
        if (hitDistance <= (closest?.distance ?? upperBound)) {
          closest = { entry, distance: hitDistance };
          upperBound = hitDistance;
        }
      }
    } else {
      const leftDistance = rayAabb(ray, current.node.left.bounds, upperBound);
      const rightDistance = rayAabb(ray, current.node.right.bounds, upperBound);

      if (leftDistance != null && rightDistance != null) {
        if (leftDistance > rightDistance) {
          stack.push({ node: current.node.left, distance: leftDistance });
          stack.push({ node: current.node.right, distance: rightDistance });
        } else {
          stack.push({ node: current.node.right, distance: rightDistance });
          stack.push({ node: current.node.left, distance: leftDistance });
        }
      } else if (leftDistance != null) {
        stack.push({ node: current.node.left, distance: leftDistance });
      } else if (rightDistance != null) {
        stack.push({ node: current.node.right, distance: rightDistance });
      }
    }
  }

  return closest;
}

function collect<T>(
  node: BvhNode<T>,
  query: Box3,
  results: Array<BvhEntry<T>>
): void {
  if (!boxesIntersect(node.bounds, query)) {
    return;
  }

  if (node.type === 'leaf') {
    for (const entry of node.entries) {
      if (boxesIntersect(entry.bounds, query)) {
        results.push(entry);
      }
    }
    return;
  }

  collect(node.left, query, results);
  collect(node.right, query, results);
}

function computeBounds<T>(entries: Array<BvhEntry<T>>): Box3 {
  const first = entries[0]?.bounds;
  if (!first) {
    throw new Error('Cannot compute BVH bounds for empty entry list.');
  }
  let minX = first.x;
  let minY = first.y;
  let minZ = first.z;
  let maxX = first.x + first.width;
  let maxY = first.y + first.height;
  let maxZ = first.z + first.depth;

  for (let i = 1; i < entries.length; i += 1) {
    const bounds = entries[i].bounds;
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    minZ = Math.min(minZ, bounds.z);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
    maxZ = Math.max(maxZ, bounds.z + bounds.depth);
  }

  return {
    x: minX,
    y: minY,
    z: minZ,
    width: maxX - minX,
    height: maxY - minY,
    depth: maxZ - minZ,
  };
}

function chooseSplitAxis(bounds: Box3): BvhAxis {
  const { width, height, depth } = bounds;
  if (width >= height && width >= depth) {
    return 'x';
  }
  if (height >= depth) {
    return 'y';
  }
  return 'z';
}

function centerAlongAxis(bounds: Box3, axis: BvhAxis): number {
  if (axis === 'x') {
    return bounds.x + bounds.width / 2;
  }
  if (axis === 'y') {
    return bounds.y + bounds.height / 2;
  }
  return bounds.z + bounds.depth / 2;
}

function isDegenerate(bounds: Box3): boolean {
  return bounds.width <= 0 || bounds.height <= 0 || bounds.depth <= 0;
}

function cloneBox(box: Box3): Box3 {
  return {
    x: box.x,
    y: box.y,
    z: box.z,
    width: box.width,
    height: box.height,
    depth: box.depth,
  };
}

function validateBox(box: Box3): void {
  if (
    typeof box?.x !== 'number' ||
    typeof box?.y !== 'number' ||
    typeof box?.z !== 'number' ||
    typeof box?.width !== 'number' ||
    typeof box?.height !== 'number' ||
    typeof box?.depth !== 'number'
  ) {
    throw new TypeError(
      'Box must contain numeric x, y, z, width, height, and depth.'
    );
  }
  if (
    !Number.isFinite(box.x) ||
    !Number.isFinite(box.y) ||
    !Number.isFinite(box.z) ||
    !Number.isFinite(box.width) ||
    !Number.isFinite(box.height) ||
    !Number.isFinite(box.depth)
  ) {
    throw new TypeError('Box values must be finite numbers.');
  }
  if (box.width < 0 || box.height < 0 || box.depth < 0) {
    throw new Error('Box width, height, and depth must be non-negative.');
  }
}

function validateRay(ray: Ray3D): void {
  if (
    typeof ray?.origin?.x !== 'number' ||
    typeof ray.origin?.y !== 'number' ||
    typeof ray.origin?.z !== 'number'
  ) {
    throw new TypeError('Ray origin must contain numeric x, y, and z values.');
  }
  if (
    typeof ray?.direction?.x !== 'number' ||
    typeof ray.direction?.y !== 'number' ||
    typeof ray.direction?.z !== 'number'
  ) {
    throw new TypeError('Ray direction must contain numeric x, y, and z values.');
  }
  if (
    (ray.direction.x === 0 && ray.direction.y === 0 && ray.direction.z === 0) ||
    !Number.isFinite(ray.direction.x) ||
    !Number.isFinite(ray.direction.y) ||
    !Number.isFinite(ray.direction.z)
  ) {
    throw new Error('Ray direction must be a finite, non-zero vector.');
  }
}

function boxesIntersect(a: Box3, b: Box3): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y ||
    a.z + a.depth < b.z ||
    b.z + b.depth < a.z
  );
}

function rayAabb(ray: Ray3D, box: Box3, maxDistance: number): number | null {
  const invDirX = 1 / ray.direction.x;
  const invDirY = 1 / ray.direction.y;
  const invDirZ = 1 / ray.direction.z;

  let tMin = ((ray.direction.x >= 0 ? box.x : box.x + box.width) - ray.origin.x) * invDirX;
  let tMax = ((ray.direction.x >= 0 ? box.x + box.width : box.x) - ray.origin.x) * invDirX;

  const tyMin = ((ray.direction.y >= 0 ? box.y : box.y + box.height) - ray.origin.y) * invDirY;
  const tyMax = ((ray.direction.y >= 0 ? box.y + box.height : box.y) - ray.origin.y) * invDirY;

  if (tMin > tyMax || tyMin > tMax) {
    return null;
  }

  if (tyMin > tMin) tMin = tyMin;
  if (tyMax < tMax) tMax = tyMax;

  const tzMin = ((ray.direction.z >= 0 ? box.z : box.z + box.depth) - ray.origin.z) * invDirZ;
  const tzMax = ((ray.direction.z >= 0 ? box.z + box.depth : box.z) - ray.origin.z) * invDirZ;

  if (tMin > tzMax || tzMin > tMax) {
    return null;
  }

  if (tzMin > tMin) tMin = tzMin;
  if (tzMax < tMax) tMax = tzMax;

  if (tMax < 0 || tMin > maxDistance) {
    return null;
  }

  const hitDistance = tMin >= 0 ? tMin : tMax;
  return hitDistance <= maxDistance ? hitDistance : null;
}
