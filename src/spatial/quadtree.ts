import type { Point, Rect } from '../types.js';

interface StoredPoint<T> extends Point {
  data?: T;
}

/**
 * Quadtree spatial partitioning structure for 2D point queries.
 * Useful for: collision detection, visibility queries, proximity searches.
 */
export class Quadtree<T = unknown> {
  private bounds: Rect;
  private capacity: number;
  private points: Array<StoredPoint<T>> = [];
  private divided = false;
  private depth: number;
  private maxDepth: number;
  private children: [Quadtree<T>, Quadtree<T>, Quadtree<T>, Quadtree<T>] | [] = [];

  constructor(bounds: Rect, capacity = 8, depth = 0, maxDepth = 8) {
    validateRect(bounds);
    this.bounds = { ...bounds };
    this.capacity = capacity;
    this.depth = depth;
    this.maxDepth = maxDepth;
  }

  insert(point: Point, data?: T): boolean {
    if (!containsPoint(this.bounds, point)) {
      return false;
    }

    if (this.points.length < this.capacity || this.depth >= this.maxDepth) {
      this.points.push({ ...point, data });
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    for (const child of this.children) {
      if (child.insert(point, data)) {
        return true;
      }
    }
    return false;
  }

  query(range: Rect): Array<StoredPoint<T>> {
    validateRect(range);
    const found: Array<StoredPoint<T>> = [];
    this.queryRange(range, found);
    return found;
  }

  queryCircle(center: Point, radius: number): Array<StoredPoint<T>> {
    if (typeof center?.x !== 'number' || typeof center?.y !== 'number') {
      throw new TypeError('center must contain numeric x/y.');
    }
    if (typeof radius !== 'number' || radius < 0) {
      throw new TypeError('radius must be a non-negative number.');
    }

    const range: Rect = {
      x: center.x - radius,
      y: center.y - radius,
      width: radius * 2,
      height: radius * 2,
    };
    const candidates = this.query(range);
    const r2 = radius * radius;
    return candidates.filter((point) =>
      (point.x - center.x) ** 2 + (point.y - center.y) ** 2 <= r2
    );
  }

  private subdivide(): void {
    const { x, y, width, height } = this.bounds;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.children = [
      new Quadtree({ x, y, width: halfWidth, height: halfHeight }, this.capacity, this.depth + 1, this.maxDepth),
      new Quadtree({ x: x + halfWidth, y, width: halfWidth, height: halfHeight }, this.capacity, this.depth + 1, this.maxDepth),
      new Quadtree({ x, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.capacity, this.depth + 1, this.maxDepth),
      new Quadtree({
        x: x + halfWidth,
        y: y + halfHeight,
        width: halfWidth,
        height: halfHeight,
      }, this.capacity, this.depth + 1, this.maxDepth),
    ];

    this.divided = true;
    const oldPoints = this.points;
    this.points = [];

    for (const point of oldPoints) {
      this.insert(point, point.data);
    }
  }

  private queryRange(range: Rect, found: Array<StoredPoint<T>>): void {
    if (!rectanglesIntersect(this.bounds, range)) {
      return;
    }

    for (const point of this.points) {
      if (containsPoint(range, point)) {
        found.push(point);
      }
    }

    if (this.divided) {
      for (const child of this.children) {
        child.queryRange(range, found);
      }
    }
  }
}

function validateRect(rect: Rect): void {
  if (
    typeof rect?.x !== 'number' ||
    typeof rect?.y !== 'number' ||
    typeof rect?.width !== 'number' ||
    typeof rect?.height !== 'number'
  ) {
    throw new TypeError('Rect must contain numeric x, y, width, and height.');
  }
  if (rect.width < 0 || rect.height < 0) {
    throw new Error('Rect width and height must be non-negative.');
  }
}

function containsPoint(rect: Rect, point: Point): boolean {
  return (
    point.x >= rect.x &&
    point.x < rect.x + rect.width &&
    point.y >= rect.y &&
    point.y < rect.y + rect.height
  );
}

function rectanglesIntersect(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

export const __internals = { validateRect, containsPoint, rectanglesIntersect };
