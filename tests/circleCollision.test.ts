import { describe, it, expect } from 'vitest';
import {
  circleCollision,
  circleAabbCollision,
  circleSegmentIntersection,
} from '../src/index.js';

describe('circleCollision helpers', () => {
  it('detects overlapping and tangent circles', () => {
    // Overlapping
    expect(
      circleCollision({ x: 0, y: 0, radius: 2 }, { x: 3, y: 0, radius: 2 })
    ).toBe(true);
    // Tangent
    expect(
      circleCollision({ x: 0, y: 0, radius: 2 }, { x: 4, y: 0, radius: 2 })
    ).toBe(true);
    // Separated
    expect(
      circleCollision({ x: 0, y: 0, radius: 1 }, { x: 3, y: 3, radius: 1 })
    ).toBe(false);
  });

  it('detects circle vs AABB intersection', () => {
    // Circle inside rect
    expect(
      circleAabbCollision(
        { x: 5, y: 5, radius: 2 },
        { x: 0, y: 0, width: 10, height: 10 }
      )
    ).toBe(true);
    // Touching edge
    expect(
      circleAabbCollision(
        { x: 0, y: 0, radius: 2 },
        { x: 2, y: -1, width: 2, height: 2 }
      )
    ).toBe(true);
    // No overlap
    expect(
      circleAabbCollision(
        { x: -10, y: -10, radius: 1 },
        { x: 0, y: 0, width: 2, height: 2 }
      )
    ).toBe(false);
  });

  it('detects circle vs segment intersection', () => {
    // Segment passes through circle
    expect(
      circleSegmentIntersection(
        { x: 0, y: 0, radius: 1 },
        { x: -2, y: 0 },
        { x: 2, y: 0 }
      )
    ).toBe(true);
    // Segment tangent to circle
    expect(
      circleSegmentIntersection(
        { x: 0, y: 0, radius: 1 },
        { x: -2, y: 1 },
        { x: 2, y: 1 }
      )
    ).toBe(true);
    // Far away segment
    expect(
      circleSegmentIntersection(
        { x: 0, y: 0, radius: 1 },
        { x: 5, y: 5 },
        { x: 6, y: 6 }
      )
    ).toBe(false);
  });
});

