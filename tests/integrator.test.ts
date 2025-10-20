import { describe, expect, it } from 'vitest';

import { stepInexactNewton, constraintLineSearch, applyFreezeSchedule } from '../src/index.js';
import type { FoldConstraint } from '../src/physics/fold/types.js';

const createConstraint = (energy: number): FoldConstraint => ({
  type: 'cubic-barrier',
  enabled: true,
  evaluate: () => ({
    energy,
    gradient: { x: 0, y: 0, z: 0 },
    hessian: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  }),
});

describe('Fold integrator utilities', () => {
  it('performs inexact Newton step with beta accumulation', () => {
    const result = stepInexactNewton(
      {
        positions: [{ x: 0, y: 0, z: 0 }],
        velocities: [{ x: 0, y: 0, z: 0 }],
        constraints: [createConstraint(0.5)],
        settings: { maxIterations: 2, tolerance: 1e-6 },
        beta: 0,
      },
      { deltaTime: 1 / 60 }
    );

    expect(result.beta).toBeGreaterThan(0);
    expect(result.iterations).toBeGreaterThan(0);
  });

  it('runs constraint-only line search', () => {
    const step = constraintLineSearch(
      [
        {
          energy: 0.1,
          gradient: { x: 0, y: 0, z: 0 },
          hessian: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ],
        },
      ],
      { scale: 1, tolerance: 1e-4 }
    );

    expect(step).toBeLessThanOrEqual(1);
    expect(step).toBeGreaterThan(0);
  });

  it('applies semi-implicit freeze schedule', () => {
    const frozen = applyFreezeSchedule(
      {
        gap: 0,
        maxGap: 0,
        stiffness: 1,
        direction: { x: 0, y: 1, z: 0 },
      },
      {
        energy: 0,
        gradient: { x: 0, y: 0, z: 0 },
        hessian: [
          [2, 0, 0],
          [0, 2, 0],
          [0, 0, 2],
        ],
      },
      { damping: 0.5 }
    );

    expect(frozen.stiffness).toBeGreaterThan(0);
  });
});
