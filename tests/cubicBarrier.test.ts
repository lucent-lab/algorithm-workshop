import { describe, expect, it } from 'vitest';

import { createCubicBarrier } from '../src/physics/fold/cubicBarrier.js';

describe('cubic barrier potential', () => {
  it('returns zero output when constraint is satisfied', () => {
    const barrier = createCubicBarrier({ stiffness: 10 });
    const evaluation = barrier.evaluate(
      {
        gap: 0.5,
        maxGap: 0.5,
        stiffness: 10,
        direction: { x: 0, y: 0, z: 1 },
      },
      { deltaTime: 1 }
    );

    expect(evaluation.energy).toBe(0);
    expect(evaluation.gradient).toEqual({ x: 0, y: 0, z: 0 });
    expect(evaluation.hessian).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('produces cubic energy growth for penetration', () => {
    const barrier = createCubicBarrier();
    const evaluation = barrier.evaluate(
      {
        gap: -0.1,
        maxGap: 0,
        stiffness: 20,
        direction: { x: 0, y: 0, z: 1 },
      },
      { deltaTime: 1 / 60 }
    );

    expect(evaluation.energy).toBeCloseTo(20 * (0.1 ** 3) / 3, 6);
    expect(evaluation.gradient.z).toBeGreaterThan(0);
    expect(evaluation.hessian[2]?.[2]).toBeGreaterThan(0);
  });
});
