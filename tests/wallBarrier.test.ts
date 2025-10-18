import { describe, expect, it } from 'vitest';

import { createWallBarrier } from '../src/physics/fold/wallBarrier.js';

describe('wall barrier', () => {
  it('returns zero when outside penetration region', () => {
    const barrier = createWallBarrier({
      normal: { x: 0, y: 1, z: 0 },
      planePoint: { x: 0, y: 0, z: 0 },
    });

    const evaluation = barrier.evaluate(
      {
        gap: 0.1,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 1, z: 0 },
        effectiveMass: 0.2,
        metadata: { position: { x: 0, y: 0.5, z: 0 } },
      },
      { deltaTime: 1 }
    );

    expect(evaluation.energy).toBe(0);
  });

  it('computes energy when penetrating the wall', () => {
    const barrier = createWallBarrier({
      normal: { x: 0, y: 1, z: 0 },
      planePoint: { x: 0, y: 0, z: 0 },
    });

    const evaluation = barrier.evaluate(
      {
        gap: -0.05,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 1, z: 0 },
        effectiveMass: 0.3,
        metadata: {
          position: { x: 0, y: -0.05, z: 0 },
          hessian: [
            [5, 0, 0],
            [0, 5, 0],
            [0, 0, 5],
          ],
        },
      },
      { deltaTime: 1 / 60 }
    );

    expect(evaluation.energy).toBeGreaterThan(0);
    expect(evaluation.gradient.y).toBeGreaterThan(0);
  });
});
