import { createPinBarrier } from '../src/index.js';

const barrier = createPinBarrier();

const evaluation = barrier.evaluate(
  {
    gap: -0.015,
    maxGap: 0,
    stiffness: 0,
    direction: { x: 1, y: 0, z: 0 },
    effectiveMass: 0.3,
    metadata: {
      hessian: [
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
      ],
    },
  },
  { deltaTime: 1 / 60 }
);

console.log('pin energy', evaluation.energy);
