import type { Matrix3x3 } from '../../types.js';

export interface SpdEnforcementOptions {
  epsilon?: number;
  maxIterations?: number;
  initialShift?: number;
}

export function enforceSpd(matrix: Matrix3x3, options: SpdEnforcementOptions = {}): Matrix3x3 {
  validateMatrix(matrix);

  const epsilon = options.epsilon ?? 1e-8;
  const maxIterations = options.maxIterations ?? 12;
  const base = symmetrise(matrix);
  let shift = Math.max(options.initialShift ?? 0, 0);
  let current = shift > 0 ? addShift(base, shift) : base;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    if (isPositiveDefinite(current)) {
      return current;
    }

    const minDiag = Math.min(base[0][0], base[1][1], base[2][2]);
    const requiredShift = minDiag > 0 ? shift : Math.max(-minDiag + epsilon, shift);
    shift = Math.max(shift > 0 ? shift * 2 : epsilon, requiredShift);
    current = addShift(base, shift);
  }

  return addShift(base, shift > 0 ? shift : epsilon);
}

function validateMatrix(matrix: Matrix3x3 | undefined): asserts matrix is Matrix3x3 {
  if (!Array.isArray(matrix) || matrix.length !== 3) {
    throw new TypeError('Matrix must be a 3x3 array.');
  }
  matrix.forEach((row) => {
    if (!Array.isArray(row) || row.length !== 3 || row.some((value) => !Number.isFinite(value))) {
      throw new TypeError('Matrix rows must contain three finite numbers.');
    }
  });
}

function symmetrise(matrix: Matrix3x3): Matrix3x3 {
  return matrix.map((row, i) =>
    row.map((_, j) => ((matrix[i]?.[j] ?? 0) + (matrix[j]?.[i] ?? 0)) / 2)
  ) as Matrix3x3;
}

function addShift(matrix: Matrix3x3, shift: number): Matrix3x3 {
  const shifted: Matrix3x3 = matrix.map((row) => [...row]) as Matrix3x3;
  for (let i = 0; i < 3; i += 1) {
    shifted[i][i] = (shifted[i][i] ?? 0) + shift;
  }
  return shifted;
}

function isPositiveDefinite(matrix: Matrix3x3): boolean {
  const cholesky = Array.from({ length: 3 }, () => [0, 0, 0]);
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let sum = matrix[i][j];
      for (let k = 0; k < j; k += 1) {
        sum -= cholesky[i][k] * cholesky[j][k];
      }
      if (i === j) {
        if (sum <= 0) {
          return false;
        }
        cholesky[i][j] = Math.sqrt(sum);
      } else {
        cholesky[i][j] = sum / cholesky[j][j];
      }
    }
  }
  return true;
}
