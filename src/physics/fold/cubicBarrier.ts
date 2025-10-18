import type { Matrix3x3, Vector3D } from '../../types.js';
import type {
  FoldComputationContext,
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
} from './types.js';

export interface CubicBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxGap?: number;
  direction?: Vector3D;
}

const ZERO_GRADIENT: Vector3D = { x: 0, y: 0, z: 0 };
const ZERO_HESSIAN: Matrix3x3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export function createCubicBarrier(options: CubicBarrierOptions = {}): FoldConstraint {
  return {
    type: 'cubic-barrier',
    id: options.id,
    enabled: true,
    evaluate(state: FoldConstraintState, context: FoldComputationContext): FoldConstraintEvaluation {
      void context;
      const maxGap = options.maxGap ?? state.maxGap;
      const stiffness = options.stiffnessOverride ?? state.stiffness;
      const direction = options.direction ?? state.direction;

      if (stiffness <= 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const violation = Math.max(0, maxGap - state.gap);
      if (violation <= 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const unit = normalise(direction);
      if (!unit) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const energy = stiffness * (violation ** 3) / 3;
      const gradientMagnitude = stiffness * (violation ** 2);
      const gradient = scaleVector(unit, gradientMagnitude);
      const hessianMagnitude = stiffness * 2 * violation;
      const hessian = outerProduct(unit, hessianMagnitude);

      return { energy, gradient, hessian };
    },
  };
}

function normalise(vector: Vector3D | undefined): Vector3D | null {
  if (!vector) return null;
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (length === 0) return null;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function scaleVector(vector: Vector3D, scalar: number): Vector3D {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
    z: vector.z * scalar,
  };
}

function outerProduct(vector: Vector3D, scalar: number): Matrix3x3 {
  return [
    [vector.x * vector.x * scalar, vector.x * vector.y * scalar, vector.x * vector.z * scalar],
    [vector.y * vector.x * scalar, vector.y * vector.y * scalar, vector.y * vector.z * scalar],
    [vector.z * vector.x * scalar, vector.z * vector.y * scalar, vector.z * vector.z * scalar],
  ];
}
