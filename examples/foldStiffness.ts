import { computeFrozenStiffness } from '../src/index.js';

const stiffness = computeFrozenStiffness({
  gap: -0.02,
  effectiveMass: 0.5,
  direction: { x: 0, y: 0, z: 1 },
  hessian: [
    [2, 0, 0],
    [0, 2, 0],
    [0, 0, 2],
  ],
});

console.log('stiffness', stiffness);
