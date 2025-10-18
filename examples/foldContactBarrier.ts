import { createContactBarrier } from '../src/index.js';

const barrier = createContactBarrier({ extendedDirectionScale: 1.25 });

const evaluation = barrier.evaluate(
  {
    gap: -0.01,
    maxGap: 0,
    stiffness: 0,
    direction: { x: 0, y: 0, z: 1 },
    extendedDirection: { x: 0, y: 1, z: 0 },
    effectiveMass: 0.2,
    metadata: {
      hessian: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
    },
  },
  { deltaTime: 1 / 120 }
);

console.log('contact energy', evaluation.energy);
