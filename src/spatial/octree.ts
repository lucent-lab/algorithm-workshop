import type { Box3, Point3D } from '../types.js';

interface StoredPoint<T> extends Point3D {
  data?: T;
}

/**
 * Octree spatial partitioning structure for 3D point queries.
 * Useful for: broad-phase culling, proximity searches, collision detection.
 */
export class Octree<T = unknown> {
  private bounds: Box3;
  private capacity: number;
  private points: Array<StoredPoint<T>> = [];
  private divided = false;
  private depth: number;
  private maxDepth: number;
  private children:
    | [
        Octree<T>,
        Octree<T>,
        Octree<T>,
        Octree<T>,
        Octree<T>,
        Octree<T>,
        Octree<T>,
        Octree<T>
      ]
    | [] = [];

  constructor(bounds: Box3, capacity = 8, depth = 0, maxDepth = 8) {
    validateBox(bounds);
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('capacity must be a positive integer.');
    }
    if (!Number.isInteger(maxDepth) || maxDepth < 0) {
      throw new Error('maxDepth must be a non-negative integer.');
    }

    this.bounds = { ...bounds };
    this.capacity = capacity;
    this.depth = depth;
    this.maxDepth = maxDepth;
  }

  insert(point: Point3D, data?: T): boolean {
    validatePoint(point);
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

  query(range: Box3): Array<StoredPoint<T>> {
    validateBox(range);
    const found: Array<StoredPoint<T>> = [];
    this.queryRange(range, found);
    return found;
  }

  querySphere(center: Point3D, radius: number): Array<StoredPoint<T>> {
    validatePoint(center);
    if (typeof radius !== 'number' || Number.isNaN(radius) || radius < 0) {
      throw new TypeError('radius must be a non-negative number.');
    }

    const range: Box3 = {
      x: center.x - radius,
      y: center.y - radius,
      z: center.z - radius,
      width: radius * 2,
      height: radius * 2,
      depth: radius * 2,
    };
    const candidates = this.query(range);
    const radiusSquared = radius * radius;

    return candidates.filter(
      (point) => distanceSquared(point, center) <= radiusSquared
    );
  }

  private subdivide(): void {
    const { x, y, z, width, height, depth } = this.bounds;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;
    const nextDepth = this.depth + 1;

    const octants: Box3[] = [
      { x, y, z, width: halfWidth, height: halfHeight, depth: halfDepth },
      {
        x: x + halfWidth,
        y,
        z,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
      {
        x,
        y: y + halfHeight,
        z,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
      {
        x: x + halfWidth,
        y: y + halfHeight,
        z,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
      {
        x,
        y,
        z: z + halfDepth,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
      {
        x: x + halfWidth,
        y,
        z: z + halfDepth,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
      {
        x,
        y: y + halfHeight,
        z: z + halfDepth,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
      {
        x: x + halfWidth,
        y: y + halfHeight,
        z: z + halfDepth,
        width: halfWidth,
        height: halfHeight,
        depth: halfDepth,
      },
    ];

    this.children = octants.map(
      (childBounds) =>
        new Octree(childBounds, this.capacity, nextDepth, this.maxDepth)
    ) as typeof this.children;

    this.divided = true;
    const existingPoints = this.points;
    this.points = [];

    for (const point of existingPoints) {
      this.insert(point, point.data);
    }
  }

  private queryRange(range: Box3, found: Array<StoredPoint<T>>): void {
    if (!boxesIntersect(this.bounds, range)) {
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

function validatePoint(point: Point3D): void {
  if (
    typeof point?.x !== 'number' ||
    typeof point?.y !== 'number' ||
    typeof point?.z !== 'number' ||
    Number.isNaN(point.x) ||
    Number.isNaN(point.y) ||
    Number.isNaN(point.z)
  ) {
    throw new TypeError('Point must contain numeric x, y, and z values.');
  }
}

function validateBox(box: Box3): void {
  if (
    typeof box?.x !== 'number' ||
    typeof box?.y !== 'number' ||
    typeof box?.z !== 'number' ||
    typeof box?.width !== 'number' ||
    typeof box?.height !== 'number' ||
    typeof box?.depth !== 'number'
  ) {
    throw new TypeError(
      'Box must contain numeric x, y, z, width, height, and depth.'
    );
  }
  if (
    !Number.isFinite(box.x) ||
    !Number.isFinite(box.y) ||
    !Number.isFinite(box.z) ||
    !Number.isFinite(box.width) ||
    !Number.isFinite(box.height) ||
    !Number.isFinite(box.depth)
  ) {
    throw new TypeError('Box values must be finite numbers.');
  }
  if (box.width < 0 || box.height < 0 || box.depth < 0) {
    throw new Error('Box width, height, and depth must be non-negative.');
  }
}

function containsPoint(box: Box3, point: Point3D): boolean {
  return (
    point.x >= box.x &&
    point.x < box.x + box.width &&
    point.y >= box.y &&
    point.y < box.y + box.height &&
    point.z >= box.z &&
    point.z < box.z + box.depth
  );
}

function boxesIntersect(a: Box3, b: Box3): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y ||
    a.z + a.depth < b.z ||
    b.z + b.depth < a.z
  );
}

function distanceSquared(a: Point3D, b: Point3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}
