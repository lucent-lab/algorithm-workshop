import { describe, expect, it } from 'vitest';

import { createPinBarrier } from '../src/physics/fold/pinBarrier.js';

describe('pin barrier', () => {
  it('returns zero energy when stiffness is zero', () => {
    const barrier = createPinBarrier({ stiffnessOverride: 0 });
    const evaluation = barrier.evaluate(
      {
        gap: -0.05,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 1, y: 0, z: 0 },
      },
      { deltaTime: 1 }
    );

    expect(evaluation.energy).toBe(0);
  });

  it('derives stiffness from design principle', () => {
    const barrier = createPinBarrier();
    const evaluation = barrier.evaluate(
      {
        gap: -0.02,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 0, z: 1 },
        effectiveMass: 0.4,
        metadata: {
          hessian: [
            [4, 0, 0],
            [0, 4, 0],
            [0, 0, 4],
          ],
        },
      },
      { deltaTime: 1 / 120 }
    );

    expect(evaluation.energy).toBeGreaterThan(0);
    expect(evaluation.gradient.z).toBeGreaterThan(0);
  });
});
