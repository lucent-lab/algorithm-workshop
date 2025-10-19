import { enforceSpd } from '../src/index.js';
import type { Matrix3x3 } from '../src/types.js';

const matrix: Matrix3x3 = [
  [0.0, 0.2, 0.1],
  [0.2, -0.1, 0.3],
  [0.1, 0.3, 0.5],
];

const result = enforceSpd(matrix);
console.log(result);
