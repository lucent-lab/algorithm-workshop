import type { Point } from '../types.js';

/**
 * Determines whether a point lies inside a polygon (ray casting method).
 * Useful for: hit testing, geofencing, spatial queries.
 */
export function pointInPolygon(point: Point, polygon: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const current = polygon[i];
    const previous = polygon[j];
    if (!current || !previous) {
      continue;
    }
    const { x: xi, y: yi } = current;
    const { x: xj, y: yj } = previous;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}
