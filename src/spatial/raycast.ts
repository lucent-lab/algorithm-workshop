import type { Point, Ray, Rect } from '../types.js';

export interface RaycastHit {
  point: Point;
  distance: number; // distance from ray.origin to hit point
}

/**
 * Ray vs. segment intersection using 2D cross products.
 * Returns the closest hit on the segment if it exists.
 */
export function raycastSegment(ray: Ray, a: Point, b: Point): RaycastHit | null {
  const r = ray.direction;
  const s = { x: b.x - a.x, y: b.y - a.y };
  const rxs = cross(r, s);
  const qp = { x: a.x - ray.origin.x, y: a.y - ray.origin.y };

  if (Math.abs(rxs) < 1e-12) {
    // Parallel or collinear: treat as no hit for simplicity
    return null;
  }

  const t = cross(qp, s) / rxs; // along ray r
  const u = cross(qp, r) / rxs; // along segment s

  if (t >= 0 && u >= 0 && u <= 1) {
    const hitPoint: Point = { x: ray.origin.x + r.x * t, y: ray.origin.y + r.y * t };
    return { point: hitPoint, distance: Math.hypot(hitPoint.x - ray.origin.x, hitPoint.y - ray.origin.y) };
  }

  return null;
}

/**
 * Ray vs. AABB intersection using the slabs method.
 * Returns the nearest hit point if any exists in front of origin.
 */
export function raycastAabb(ray: Ray, rect: Rect): RaycastHit | null {
  const dir = ray.direction;
  const invDirX = 1 / (dir.x || 1e-12);
  const invDirY = 1 / (dir.y || 1e-12);

  const t1 = (rect.x - ray.origin.x) * invDirX;
  const t2 = (rect.x + rect.width - ray.origin.x) * invDirX;
  const t3 = (rect.y - ray.origin.y) * invDirY;
  const t4 = (rect.y + rect.height - ray.origin.y) * invDirY;

  const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
  const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

  if (tmax < 0 || tmin > tmax) {
    return null; // box behind ray or no intersection
  }

  const tHit = tmin >= 0 ? tmin : tmax >= 0 ? tmax : null;
  if (tHit === null) {
    return null;
  }
  const hitPoint: Point = { x: ray.origin.x + dir.x * tHit, y: ray.origin.y + dir.y * tHit };
  return { point: hitPoint, distance: Math.hypot(hitPoint.x - ray.origin.x, hitPoint.y - ray.origin.y) };
}

function cross(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return a.x * b.y + 0 - a.y * b.x;
}

export const __internals = { cross };

