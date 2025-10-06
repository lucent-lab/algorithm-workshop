import type { Point, Vector2D } from '../types.js';

export interface CollisionManifold {
  collides: boolean;
  overlap: number;
  normal: Vector2D;
}

/**
 * Separating Axis Theorem collision detection for convex polygons.
 * Useful for: accurate 2D physics, platformers, rotating hit boxes.
 */
export function satCollision(polygonA: readonly Point[], polygonB: readonly Point[]): CollisionManifold {
  if (polygonA.length < 3 || polygonB.length < 3) {
    throw new Error('SAT collision requires convex polygons with at least 3 points.');
  }

  let overlap = Infinity;
  let smallestAxis: Vector2D = { x: 0, y: 0 };

  const axes = [...getAxes(polygonA), ...getAxes(polygonB)];

  for (const axis of axes) {
    const projectionA = projectPolygon(polygonA, axis);
    const projectionB = projectPolygon(polygonB, axis);
    const o = getOverlap(projectionA, projectionB);

    if (o <= 0) {
      return { collides: false, overlap: 0, normal: { x: 0, y: 0 } };
    }

    if (o < overlap) {
      overlap = o;
      smallestAxis = axis;
    }
  }

  return { collides: true, overlap, normal: smallestAxis };
}

function getAxes(polygon: readonly Point[]): Vector2D[] {
  const axes: Vector2D[] = [];
  for (let i = 0; i < polygon.length; i += 1) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    if (!p1 || !p2) {
      continue;
    }
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const normal = normalize({ x: -edge.y, y: edge.x });
    axes.push(normal);
  }
  return axes;
}

interface Projection {
  min: number;
  max: number;
}

function projectPolygon(polygon: readonly Point[], axis: Vector2D): Projection {
  const first = polygon[0];
  if (!first) {
    return { min: 0, max: 0 };
  }
  let min = dot(first, axis);
  let max = min;

  for (let i = 1; i < polygon.length; i += 1) {
    const p = polygon[i];
    if (!p) {
      continue;
    }
    const projection = dot(p, axis);
    if (projection < min) {
      min = projection;
    }
    if (projection > max) {
      max = projection;
    }
  }

  return { min, max };
}

function getOverlap(a: Projection, b: Projection): number {
  return Math.min(a.max, b.max) - Math.max(a.min, b.min);
}

function dot(a: Point, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

function length(vec: Vector2D): number {
  return Math.hypot(vec.x, vec.y);
}

function normalize(vec: Vector2D): Vector2D {
  const len = length(vec);
  if (!len) {
    return { x: 0, y: 0 };
  }
  return { x: vec.x / len, y: vec.y / len };
}

export const __internals = {
  getAxes,
  projectPolygon,
  getOverlap,
  dot,
  normalize,
};
