import type { Point } from '../types.js';

/**
 * Calculates intersection point of two line segments if they intersect.
 * Useful for: vector graphics, computational geometry, pathfinding physics.
 */
export function lineIntersection(a1: Point, a2: Point, b1: Point, b2: Point): Point | null {
  const denominator = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
  if (denominator === 0) {
    return null; // Parallel lines
  }

  const ua = ((b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) / denominator;
  const ub = ((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) / denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }

  return {
    x: a1.x + ua * (a2.x - a1.x),
    y: a1.y + ua * (a2.y - a1.y),
  };
}
