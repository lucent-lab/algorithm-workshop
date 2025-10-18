import { describe, expect, it } from 'vitest';

import { createStrainBarrier } from '../src/physics/fold/strainBarrier.js';

describe('strain barrier', () => {
  it('returns zero when singular values within limits', () => {
    const barrier = createStrainBarrier({ maxStretch: 1.1, minCompression: 0.9 });
    const evaluation = barrier.evaluate(
      {
        gap: 0,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 0, z: 1 },
        effectiveMass: 0.3,
        metadata: { singularValues: [1.05, 0.95] },
      },
      { deltaTime: 1 / 120 }
    );

    expect(evaluation.energy).toBe(0);
  });

  it('produces energy when strain exceeds limits', () => {
    const barrier = createStrainBarrier({ maxStretch: 1.05, minCompression: 0.95 });
    const evaluation = barrier.evaluate(
      {
        gap: 0,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 0, z: 1 },
        effectiveMass: 0.4,
        metadata: {
          singularValues: [1.12, 0.98],
          hessian: [
            [4, 0, 0],
            [0, 4, 0],
            [0, 0, 4],
          ],
        },
      },
      { deltaTime: 1 / 60 }
    );

    expect(evaluation.energy).toBeGreaterThan(0);
    expect(evaluation.gradient.z).toBeGreaterThan(0);
  });
});
