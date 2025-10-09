import type { Circle, Point, Rect, Vector2D } from '../types.js';

/**
 * Tests whether two circles overlap or touch.
 * Useful for: simple collision tests, triggers, proximity checks.
 */
export function circleCollision(a: Circle, b: Circle): boolean {
  const dx = a.x + 0 - b.x;
  const dy = a.y + 0 - b.y;
  const r = a.radius + b.radius;
  return dx * dx + dy * dy <= r * r;
}

/**
 * Tests whether a circle intersects an axis-aligned rectangle (AABB).
 * Useful for: broad-phase checks against tiles, UI hit areas.
 */
export function circleAabbCollision(circle: Circle, rect: Rect): boolean {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

/**
 * Tests whether a line segment intersects a circle.
 * Useful for: hit scans, visibility checks, bullet vs. circle tests.
 */
export function circleSegmentIntersection(circle: Circle, a: Point, b: Point): boolean {
  const ab: Vector2D = { x: b.x - a.x, y: b.y - a.y };
  const ac: Vector2D = { x: circle.x - a.x, y: circle.y - a.y };

  const abLenSq = ab.x * ab.x + ab.y * ab.y;
  if (abLenSq === 0) {
    // Segment degenerates to point
    const dx = a.x - circle.x;
    const dy = a.y - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  // Project AC onto AB to find closest point on segment to circle center
  const t = clamp((ac.x * ab.x + ac.y * ab.y) / abLenSq, 0, 1);
  const closest: Point = { x: a.x + ab.x * t, y: a.y + ab.y * t };
  const dx = closest.x - circle.x;
  const dy = closest.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const __internals = { clamp };

