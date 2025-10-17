import { buildBvh, queryBvh, raycastBvh } from '../src/index.js';

const objects = [
  { id: 'crate', bounds: { x: 0, y: 0, z: 0, width: 2, height: 2, depth: 2 } },
  { id: 'barrel', bounds: { x: 4, y: 0.5, z: 1, width: 1.5, height: 3, depth: 1.5 } },
  { id: 'pillar', bounds: { x: 8, y: 0, z: 0, width: 1, height: 6, depth: 1 } },
];

const bvh = buildBvh(objects, {
  getBounds: (item) => item.bounds,
});

const queryResult = queryBvh(bvh, {
  x: -1,
  y: -1,
  z: -1,
  width: 5,
  height: 5,
  depth: 5,
});
console.log('intersecting ids', queryResult.map((entry) => entry.item.id));

const hit = raycastBvh(
  bvh,
  { origin: { x: -5, y: 1, z: 1 }, direction: { x: 1, y: 0, z: 0 } },
  (entry, ray) => rayAabb(ray, entry.bounds)
);
console.log('first hit', hit?.entry.item.id, 'at distance', hit?.distance);

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
