import { describe, expect, it } from 'vitest';

import { computeInfluenceMap } from '../src/index.js';

describe('computeInfluenceMap', () => {
  it('accumulates influence with linear falloff and decay', () => {
    const result = computeInfluenceMap({
      width: 3,
      height: 3,
      cellSize: 1,
      sources: [{ position: { x: 1, y: 1 }, strength: 9, radius: 2, falloff: 'linear' }],
      decay: 0.1,
    });

    expect(result.width).toBe(3);
    expect(result.height).toBe(3);
    expect(result.values).toHaveLength(9);
    expect(result.values[4]).toBeGreaterThan(5);
    expect(result.values[4]).toBeLessThanOrEqual(9);
    expect(result.values[0]).toBeGreaterThan(0);
  });

  it('supports inverse falloff and obstacles', () => {
    const map = computeInfluenceMap({
      width: 3,
      height: 3,
      cellSize: 1,
      sources: [{ position: { x: 0, y: 0 }, strength: 4, radius: 3, falloff: 'inverse' }],
      obstacles: (x, y) => x === 1 && y === 0,
    });

    expect(map.values[0]).toBeGreaterThan(3.5);
    expect(map.values[0]).toBeLessThanOrEqual(8);
    expect(map.values[1]).toBe(0);
    expect(map.values[3]).toBeGreaterThan(map.values[4]);
  });

  it('validates decay range and falloff values', () => {
    expect(() =>
      computeInfluenceMap({
        width: 2,
        height: 2,
        decay: 1.5,
        sources: [{ position: { x: 0, y: 0 }, strength: 1 }],
      })
    ).toThrow('decay must be in the range [0, 1].');

    expect(() =>
      computeInfluenceMap({
        width: 2,
        height: 2,
        sources: [{ position: { x: 0, y: 0 }, strength: 1, falloff: 'quadratic' as 'linear' }],
      })
    ).toThrow('Source falloff must be linear, inverse, or constant when provided.');
  });
});
