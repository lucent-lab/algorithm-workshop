import { describe, expect, it } from 'vitest';

import { enforceSpd } from '../src/physics/fold/spd.js';
import type { Matrix3x3 } from '../src/types.js';

const isPositiveDefinite = (matrix: Matrix3x3): boolean => {
  const n = matrix.length;
  const cholesky: number[][] = [];
  for (let i = 0; i < n; i += 1) {
    const row: number[] = Array.from({ length: n }, () => 0);
    cholesky.push(row);
  }
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let sum = matrix[i][j];
      for (let k = 0; k < j; k += 1) {
        sum -= cholesky[i][k] * cholesky[j][k];
      }
      if (i === j) {
        if (sum <= 0) return false;
        cholesky[i][j] = Math.sqrt(sum);
      } else {
        cholesky[i][j] = sum / cholesky[j][j];
      }
    }
  }
  return true;
};

describe('enforceSpd', () => {
  it('returns SPD matrix for indefinite input', () => {
    const matrix: Matrix3x3 = [
      [0.0, 0.2, 0.1],
      [0.2, -0.5, 0.3],
      [0.1, 0.3, 0.5],
    ];

    const result = enforceSpd(matrix);
    expect(isPositiveDefinite(result)).toBe(true);
  });

  it('returns original matrix when already SPD', () => {
    const matrix: Matrix3x3 = [
      [2, 0, 0],
      [0, 3, 0],
      [0, 0, 4],
    ];

    const result = enforceSpd(matrix);
    expect(result).toEqual(matrix);
    expect(result).not.toBe(matrix);
    expect(matrix).toEqual([
      [2, 0, 0],
      [0, 3, 0],
      [0, 0, 4],
    ]);
  });
});
