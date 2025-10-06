import type { Rect } from '../types.js';

/**
 * Tests axis-aligned rectangles for overlap.
 * Useful for: broad-phase collision detection, UI hit-testing, layout overlaps.
 */
export function aabbCollision(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width <= b.x ||
    a.x >= b.x + b.width ||
    a.y + a.height <= b.y ||
    a.y >= b.y + b.height
  );
}

/**
 * Calculates intersection rectangle between two axis-aligned boxes.
 * Useful for: clipping regions, intersection observers, spatial analytics.
 */
export function aabbIntersection(a: Rect, b: Rect): Rect | null {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const width = Math.min(a.x + a.width, b.x + b.width) - x;
  const height = Math.min(a.y + a.height, b.y + b.height) - y;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { x, y, width, height };
}
