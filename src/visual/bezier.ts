import type { Point } from '../types.js';

/**
 * Evaluates a quadratic Bezier curve at parameter t.
 * Useful for: curve drawing, animation paths, vector illustration tooling.
 */
export function quadraticBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const invT = 1 - t;
  const x = invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x;
  const y = invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y;
  return { x, y };
}

/**
 * Evaluates a cubic Bezier curve at parameter t.
 * Useful for: CSS animation timing, SVG path interpolation, camera paths.
 */
export function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const invT = 1 - t;
  const x =
    invT ** 3 * p0.x +
    3 * invT * invT * t * p1.x +
    3 * invT * t * t * p2.x +
    t ** 3 * p3.x;
  const y =
    invT ** 3 * p0.y +
    3 * invT * invT * t * p1.y +
    3 * invT * t * t * p2.y +
    t ** 3 * p3.y;
  return { x, y };
}
