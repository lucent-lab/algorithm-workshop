import type { Point } from '../types.js';

/**
 * Computes the convex hull of a set of 2D points using Graham scan.
 * Useful for: collision envelopes, GIS boundaries, dataset outlines.
 */
export function convexHull(points: readonly Point[]): Point[] {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error('At least three points are required to compute a convex hull.');
  }

  const sorted = Array.from<Point>(points);
  sorted.sort((a, b) => a.y - b.y || a.x - b.x);
  const start = sorted[0];
  if (!start) {
    throw new Error('Convex hull computation failed: missing starting point.');
  }
  const byAngle = Array.from<Point>(sorted.slice(1));
  byAngle.sort((a, b) => angle(start, a) - angle(start, b) || distance(start, a) - distance(start, b));

  const hull: Point[] = [start];
  const firstAnglePoint = byAngle[0];
  if (firstAnglePoint) {
    hull.push(firstAnglePoint);
  }

  for (let i = 1; i < byAngle.length; i += 1) {
    const point = byAngle[i];
    if (!point) {
      continue;
    }
    while (hull.length >= 2) {
      const last = hull[hull.length - 1];
      const penultimate = hull[hull.length - 2];
      if (!last || !penultimate) {
        break;
      }
      if (cross(penultimate, last, point) > 0) {
        break;
      }
      hull.pop();
    }
    hull.push(point);
  }

  return hull;
}

function angle(origin: Point, point: Point): number {
  return Math.atan2(point.y - origin.y, point.x - origin.x);
}

function distance(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

export const __internals = { angle, distance, cross };
