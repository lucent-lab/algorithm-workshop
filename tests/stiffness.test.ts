import { describe, expect, it } from 'vitest';

import { computeFrozenStiffness } from '../src/physics/fold/stiffness.js';

describe('computeFrozenStiffness', () => {
  it('matches design principle formula for basic inputs', () => {
    const result = computeFrozenStiffness({
      gap: 0.1,
      effectiveMass: 2,
      direction: { x: 0, y: 0, z: 1 },
      hessian: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 3],
      ],
    });

    const expected = 2 / (0.1 * 0.1) + 3;
    expect(result).toBeCloseTo(expected, 6);
  });

  it('clamps values when bounds provided', () => {
    const result = computeFrozenStiffness(
      {
        gap: 0,
        effectiveMass: 1,
        direction: { x: 0, y: 0, z: 0 },
        hessian: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
      { max: 1e5 }
    );

    expect(result).toBeLessThanOrEqual(1e5);
  });
});
