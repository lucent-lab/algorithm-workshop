import type { Matrix3x3, Vector3D } from '../../types.js';

const DEFAULT_EPSILON = 1e-8;

export interface StiffnessDesignInput {
  gap: number;
  effectiveMass: number;
  direction: Vector3D;
  hessian: Matrix3x3;
}

export interface StiffnessDesignOptions {
  epsilon?: number;
  min?: number;
  max?: number;
}

export function computeFrozenStiffness(
  input: StiffnessDesignInput,
  options: StiffnessDesignOptions = {}
): number {
  validateInput(input);
  const epsilon = options.epsilon ?? DEFAULT_EPSILON;

  const gapMagnitude = Math.max(Math.abs(input.gap), epsilon);
  const unit = normalise(input.direction);
  if (!unit) {
    return clamp(input.effectiveMass / (gapMagnitude * gapMagnitude), options.min, options.max);
  }

  const massContribution = input.effectiveMass / (gapMagnitude * gapMagnitude);
  const projected = projectHessian(unit, input.hessian);
  const stiffness = massContribution + projected;
  return clamp(stiffness, options.min, options.max);
}

function validateInput(input: StiffnessDesignInput): void {
  if (!isFiniteNumber(input.gap)) {
    throw new TypeError('gap must be a finite number.');
  }
  if (!isFiniteNumber(input.effectiveMass)) {
    throw new TypeError('effectiveMass must be a finite number.');
  }
  if (!isVector(input.direction)) {
    throw new TypeError('direction must be a finite 3D vector.');
  }
  if (!isMatrix(input.hessian)) {
    throw new TypeError('hessian must be a 3x3 matrix.');
  }
}

function projectHessian(direction: Vector3D, hessian: Matrix3x3): number {
  const hx = hessian[0];
  const hy = hessian[1];
  const hz = hessian[2];
  if (!hx || !hy || !hz) {
    throw new TypeError('hessian must be a 3x3 matrix.');
  }
  const vx = direction.x;
  const vy = direction.y;
  const vz = direction.z;
  const hvx = hx[0] * vx + hx[1] * vy + hx[2] * vz;
  const hvy = hy[0] * vx + hy[1] * vy + hy[2] * vz;
  const hvz = hz[0] * vx + hz[1] * vy + hz[2] * vz;
  return hvx * vx + hvy * vy + hvz * vz;
}

function normalise(vector: Vector3D): Vector3D | null {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (length <= 0) {
    return null;
  }
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (typeof min === 'number') {
    result = Math.max(result, min);
  }
  if (typeof max === 'number') {
    result = Math.min(result, max);
  }
  return result;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isVector(vector: Vector3D | undefined): vector is Vector3D {
  return (
    typeof vector?.x === 'number' && Number.isFinite(vector.x) &&
    typeof vector?.y === 'number' && Number.isFinite(vector.y) &&
    typeof vector?.z === 'number' && Number.isFinite(vector.z)
  );
}

function isMatrix(matrix: Matrix3x3 | undefined): matrix is Matrix3x3 {
  return (
    Array.isArray(matrix) &&
    matrix.length === 3 &&
    matrix.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 3 &&
        row.every((value) => typeof value === 'number' && Number.isFinite(value))
    )
  );
}
