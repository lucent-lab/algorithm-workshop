import { createStrainBarrier } from '../src/index.js';

const barrier = createStrainBarrier({ maxStretch: 1.05, minCompression: 0.95 });

const evaluation = barrier.evaluate(
  {
    gap: 0,
    maxGap: 0,
    stiffness: 0,
    direction: { x: 0, y: 0, z: 1 },
    effectiveMass: 0.4,
    metadata: {
      singularValues: [1.1, 0.98],
      hessian: [
        [6, 0, 0],
        [0, 6, 0],
        [0, 0, 6],
      ],
    },
  },
  { deltaTime: 1 / 60 }
);

console.log('strain energy', evaluation.energy);
