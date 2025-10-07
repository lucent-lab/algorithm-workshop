import { describe, expect, it } from 'vitest';
import { convexHull } from '../src/geometry/convexHull.js';
import { lineIntersection } from '../src/geometry/lineIntersection.js';
import { pointInPolygon } from '../src/geometry/pointInPolygon.js';

describe('convexHull', () => {
  it('computes hull for a set including interior points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0.5, y: 0.5 },
    ];
    const hull = convexHull(points);
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('throws when less than three points provided', () => {
    expect(() => convexHull([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toThrow();
  });
});

describe('lineIntersection', () => {
  it('returns intersection point for crossing segments', () => {
    expect(
      lineIntersection(
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 2, y: 0 }
      )
    ).toEqual({ x: 1, y: 1 });
  });

  it('returns null for parallel segments', () => {
    expect(
      lineIntersection(
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      )
    ).toBeNull();
  });
});

describe('pointInPolygon', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: 0, y: 2 },
  ];

  it('detects points inside polygon', () => {
    expect(pointInPolygon({ x: 1, y: 1 }, square)).toBe(true);
  });

  it('rejects points outside polygon', () => {
    expect(pointInPolygon({ x: -1, y: 1 }, square)).toBe(false);
  });
});
