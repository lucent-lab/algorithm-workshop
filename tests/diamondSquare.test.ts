import { describe, expect, it } from 'vitest';

import { diamondSquare } from '../src/index.js';

describe('diamondSquare', () => {
  it('produces deterministic grids for identical seeds', () => {
    const options = { size: 9, seed: 123, roughness: 0.55, initialAmplitude: 1 } as const;
    const a = diamondSquare(options);
    const b = diamondSquare(options);
    expect(a.grid).toEqual(b.grid);
    expect(a.min).toBeCloseTo(b.min, 10);
    expect(a.max).toBeCloseTo(b.max, 10);
  });

  it('normalizes heights to [0, 1] when requested', () => {
    const { grid, min, max } = diamondSquare({
      size: 17,
      seed: 99,
      roughness: 0.6,
      initialAmplitude: 2,
      normalize: true,
    });

    expect(min).toBe(0);
    expect(max).toBe(1);
    for (const row of grid) {
      expect(row.every((value) => value >= 0 && value <= 1)).toBe(true);
    }
  });
});
