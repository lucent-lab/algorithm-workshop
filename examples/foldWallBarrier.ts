import { createWallBarrier } from '../src/index.js';

const barrier = createWallBarrier({
  planePoint: { x: 0, y: 0, z: 0 },
  normal: { x: 0, y: 1, z: 0 },
});

const evaluation = barrier.evaluate(
  {
    gap: -0.03,
    maxGap: 0,
    stiffness: 0,
    direction: { x: 0, y: 1, z: 0 },
    effectiveMass: 0.25,
    metadata: {
      position: { x: 0, y: -0.03, z: 0 },
      hessian: [
        [3, 0, 0],
        [0, 3, 0],
        [0, 0, 3],
      ],
    },
  },
  { deltaTime: 1 / 90 }
);

console.log('wall energy', evaluation.energy);
