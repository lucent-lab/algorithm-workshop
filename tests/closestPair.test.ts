import { describe, expect, it } from 'vitest';

import { closestPair } from '../src/geometry/closestPair.js';

describe('closestPair', () => {
  it('finds the minimal distance among scattered points', () => {
    const result = closestPair([
      { x: 0, y: 0 },
      { x: 5, y: 4 },
      { x: 1, y: 1 },
      { x: 10, y: 10 },
      { x: 1.5, y: 1.5 },
    ]);

    expect(result.distance).toBeCloseTo(Math.hypot(0.5, 0.5), 6);
    expect(result.pair).not.toBeNull();
    expect(result.pair?.map((p) => `${p.x}:${p.y}`)).toContain('1:1');
    expect(result.pair?.map((p) => `${p.x}:${p.y}`)).toContain('1.5:1.5');
  });

  it('handles duplicate points returning zero distance', () => {
    const result = closestPair([
      { x: 2, y: 3 },
      { x: 5, y: 7 },
      { x: 2, y: 3 },
    ]);

    expect(result.distance).toBe(0);
    expect(result.pair).not.toBeNull();
  });

  it('returns infinity when less than two points provided', () => {
    expect(closestPair([])).toEqual({ distance: Infinity, pair: null });
    expect(closestPair([{ x: 1, y: 2 }])).toEqual({ distance: Infinity, pair: null });
  });
});
