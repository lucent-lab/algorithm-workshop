import { describe, it, expect } from 'vitest';
import { Quadtree } from '../src/spatial/quadtree.js';
import { aabbCollision, aabbIntersection } from '../src/spatial/aabb.js';
import { satCollision } from '../src/spatial/sat.js';
import { circleRayIntersection } from '../src/spatial/circleRay.js';

describe('AABB helpers', () => {
  it('detects collision', () => {
    expect(
      aabbCollision(
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 5, y: 5, width: 5, height: 5 }
      )
    ).toBe(true);
  });

  it('computes intersection', () => {
    expect(
      aabbIntersection(
        { x: 0, y: 0, width: 4, height: 4 },
        { x: 2, y: 2, width: 4, height: 4 }
      )
    ).toEqual({ x: 2, y: 2, width: 2, height: 2 });
  });
});

describe('Quadtree', () => {
  it('stores and queries points', () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 }, 2);
    tree.insert({ x: 10, y: 10 });
    tree.insert({ x: 50, y: 50 });

    const found = tree.query({ x: 0, y: 0, width: 25, height: 25 });
    expect(found.map((p) => ({ x: p.x, y: p.y }))).toEqual([{ x: 10, y: 10 }]);
  });

  it('subdivides when capacity exceeded and preserves data', () => {
    const tree = new Quadtree<{ id: number }>({ x: 0, y: 0, width: 40, height: 40 }, 1, 0, 4);
    tree.insert({ x: 5, y: 5 }, { id: 1 });
    tree.insert({ x: 30, y: 5 }, { id: 2 });
    tree.insert({ x: 5, y: 30 }, { id: 3 });

    const results = tree.query({ x: 0, y: 0, width: 40, height: 40 });
    expect(results).toHaveLength(3);
    expect(results.map((point) => point.data?.id).sort()).toEqual([1, 2, 3]);
  });

  it('supports circular queries and validates inputs', () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 40, height: 40 });
    tree.insert({ x: 10, y: 10 });
    tree.insert({ x: 30, y: 10 });

    const circleHits = tree.queryCircle({ x: 8, y: 8 }, 5);
    expect(circleHits.map((p) => ({ x: p.x, y: p.y }))).toEqual([{ x: 10, y: 10 }]);

    expect(() => tree.queryCircle({ x: 'a' as unknown as number, y: 0 }, 5)).toThrow(TypeError);
    expect(() => tree.queryCircle({ x: 0, y: 0 }, -1)).toThrow('radius must be a non-negative number.');
  });
});

describe('SAT collision', () => {
  it('detects separating axis', () => {
    const squareA = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    const squareB = [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 1, y: 3 },
    ];

    const manifold = satCollision(squareA, squareB);
    expect(manifold.collides).toBe(true);
    expect(manifold.overlap).toBeGreaterThan(0);
  });

  it('returns no collision when polygons are separate', () => {
    const polyA = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    const polyB = [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 3, y: 4 },
    ];

    const manifold = satCollision(polyA, polyB);
    expect(manifold.collides).toBe(false);
  });
});

describe('circleRayIntersection', () => {
  it('returns two points when ray passes through circle', () => {
    const intersections = circleRayIntersection(
      { origin: { x: -5, y: 0 }, direction: { x: 1, y: 0 } },
      { x: 0, y: 0, radius: 2 }
    );

    expect(intersections.length).toBe(2);
    expect(intersections[0]?.x).toBeCloseTo(-2, 5);
    expect(intersections[1]?.x).toBeCloseTo(2, 5);
  });

  it('returns empty array when ray misses circle', () => {
    const intersections = circleRayIntersection(
      { origin: { x: 0, y: 5 }, direction: { x: 1, y: 0 } },
      { x: 0, y: 0, radius: 2 }
    );

    expect(intersections).toHaveLength(0);
  });
});
