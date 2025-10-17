import { describe, it, expect } from 'vitest';

import { buildBvh, queryBvh, raycastBvh } from '../src/spatial/bvh.js';

describe('BVH', () => {
  const items = [
    { id: 'a', bounds: { x: 0, y: 0, z: 0, width: 2, height: 2, depth: 2 } },
    { id: 'b', bounds: { x: 5, y: 0, z: 0, width: 1, height: 1, depth: 1 } },
    { id: 'c', bounds: { x: -3, y: -1, z: 0, width: 1.5, height: 1.5, depth: 1 } },
    { id: 'd', bounds: { x: 2, y: 2, z: 2, width: 2, height: 2, depth: 2 } },
  ];

  it('builds a hierarchy and returns balanced nodes', () => {
    const tree = buildBvh(items, { getBounds: (entry) => entry.bounds });
    expect(tree).not.toBeNull();
    expect(tree?.bounds.width).toBeGreaterThan(0);
    if (tree?.type === 'branch') {
      expect(tree.left.bounds.width).toBeGreaterThan(0);
      expect(tree.right.bounds.width).toBeGreaterThan(0);
    }
  });

  it('queries entries intersecting an AABB', () => {
    const tree = buildBvh(items, { getBounds: (entry) => entry.bounds });
    const results = queryBvh(tree, { x: -1, y: -1, z: -1, width: 4, height: 4, depth: 4 });
    expect(results.map((entry) => entry.item.id).sort()).toEqual(['a', 'd']);
  });

  it('performs ray intersection against nearest entry', () => {
    const tree = buildBvh(items, { getBounds: (entry) => entry.bounds });
    const ray = { origin: { x: -5, y: 1, z: 1 }, direction: { x: 1, y: 0, z: 0 } };
    const hit = raycastBvh(tree, ray, (entry) => rayAabb(ray, entry.bounds));
    expect(hit?.entry.item.id).toBe('a');
    expect(hit?.distance).toBeCloseTo(5, 5);
  });

  it('validates build inputs and ray queries', () => {
    expect(() => buildBvh(items, { getBounds: () => ({ x: 0, y: 0, z: 0, width: -1, height: 1, depth: 1 }) })).toThrow();
    expect(() => buildBvh(items, {} as never)).toThrow('options.getBounds');

    const tree = buildBvh(items, { getBounds: (entry) => entry.bounds });
    expect(() => raycastBvh(tree, { origin: { x: 0, y: 0, z: 0 }, direction: { x: 0, y: 0, z: 0 } }, () => 0)).toThrow(
      'non-zero vector'
    );
  });
});

function rayAabb(
  ray: { origin: { x: number; y: number; z: number }; direction: { x: number; y: number; z: number } },
  box: { x: number; y: number; z: number; width: number; height: number; depth: number }
): number | null {
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

  if (tMax < 0) {
    return null;
  }

  return tMin >= 0 ? tMin : tMax;
}
