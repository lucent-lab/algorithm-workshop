import { describe, expect, it } from 'vitest';

import { createContactBarrier } from '../src/physics/fold/contactBarrier.js';

describe('contact barrier', () => {
  it('falls back to cubic barrier when no violation occurs', () => {
    const barrier = createContactBarrier();
    const evaluation = barrier.evaluate(
      {
        gap: 0.1,
        maxGap: 0,
        stiffness: 10,
        direction: { x: 0, y: 0, z: 1 },
        effectiveMass: 1,
      },
      { deltaTime: 1 / 60 }
    );

    expect(evaluation.energy).toBe(0);
  });

  it('uses extended direction and stiffness design', () => {
    const barrier = createContactBarrier({ extendedDirectionScale: 1.25 });
    const evaluation = barrier.evaluate(
      {
        gap: -0.02,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 0, z: 1 },
        extendedDirection: { x: 0, y: 1, z: 0 },
        effectiveMass: 0.5,
        metadata: {
          hessian: [
            [2, 0, 0],
            [0, 4, 0],
            [0, 0, 6],
          ],
        },
      },
      { deltaTime: 1 / 60 }
    );

    expect(evaluation.energy).toBeGreaterThan(0);
    expect(evaluation.gradient.y).toBeGreaterThan(0);
  });
});
