import {
  stepInexactNewton,
  constraintLineSearch,
  applyFreezeSchedule,
} from '../src/index.js';

const integratorState = {
  positions: [{ x: 0, y: 0, z: 0 }],
  velocities: [{ x: 0, y: 0, z: 0 }],
  constraints: [],
  settings: { maxIterations: 3, tolerance: 1e-3 },
  beta: 0,
};

const result = stepInexactNewton(integratorState, { deltaTime: 1 / 60 });
console.log('beta', result.beta, 'iterations', result.iterations);

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
  { scale: 1 }
);
console.log('line search step', step);

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
  }
);
console.log('frozen stiffness', frozen.stiffness);
