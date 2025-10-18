import { createFrictionPotential } from '../src/index.js';

const friction = createFrictionPotential({ coefficient: 0.6 });

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
  { deltaTime: 1 / 120 }
);

console.log('friction energy', evaluation.energy);
