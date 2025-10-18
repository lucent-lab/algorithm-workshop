import { createCubicBarrier } from '../src/index.js';

const cubicBarrier = createCubicBarrier({ stiffnessOverride: 50 });

const evaluation = cubicBarrier.evaluate(
  {
    gap: -0.05,
    maxGap: 0,
    stiffness: 30,
    direction: { x: 0, y: 0, z: 1 },
  },
  { deltaTime: 1 / 60 }
);

console.log('energy', evaluation.energy);
console.log('gradient', evaluation.gradient);
