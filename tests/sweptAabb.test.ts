import { describe, it, expect } from 'vitest';
import { sweptAABB } from '../src/spatial/sweptAabb.js';

describe('sweptAABB', () => {
  it('detects collision and returns time of impact', () => {
    const result = sweptAABB(
      { x: 0, y: 0, width: 1, height: 1, velocity: { x: 5, y: 0 } },
      { x: 4, y: 0, width: 1, height: 1 }
    );

    expect(result.collided).toBe(true);
    expect(result.time).toBeGreaterThan(0);
    expect(result.time).toBeLessThanOrEqual(1);
  });

  it('reports no collision when paths do not intersect', () => {
    const result = sweptAABB(
      { x: 0, y: 0, width: 1, height: 1, velocity: { x: -2, y: 0 } },
      { x: 5, y: 5, width: 1, height: 1 }
    );
    expect(result.collided).toBe(false);
    expect(result.normal).toEqual({ x: 0, y: 0 });
  });
});
