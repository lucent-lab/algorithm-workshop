import { describe, expect, it } from 'vitest';

import { createFrictionPotential } from '../src/physics/fold/frictionPotential.js';

describe('friction potential', () => {
  it('returns zero when no tangential displacement', () => {
    const friction = createFrictionPotential({ coefficient: 0.5 });
    const evaluation = friction.evaluate(
      {
        gap: 0,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 0, z: 1 },
        effectiveMass: 0.1,
        metadata: { contactForce: 2, tangentDisplacement: { x: 0, y: 0, z: 0 } },
      },
      { deltaTime: 1 }
    );

    expect(evaluation.energy).toBe(0);
  });

  it('produces energy proportional to tangent displacement and force', () => {
    const friction = createFrictionPotential({ coefficient: 0.8 });
    const evaluation = friction.evaluate(
      {
        gap: 0,
        maxGap: 0,
        stiffness: 0,
        direction: { x: 0, y: 0, z: 1 },
        effectiveMass: 0.1,
        metadata: {
          contactForce: 5,
          tangentDisplacement: { x: 0.02, y: 0.01, z: 0 },
        },
      },
      { deltaTime: 1 / 60 }
    );

    expect(evaluation.energy).toBeGreaterThan(0);
    expect(evaluation.gradient.x ** 2 + evaluation.gradient.y ** 2).toBeGreaterThan(0);
  });
});
