import type { Vector3D, Matrix3x3 } from '../../types.js';
import type {
  FoldComputationContext,
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
} from './types.js';
import { createCubicBarrier } from './cubicBarrier.js';
import { computeFrozenStiffness } from './stiffness.js';

export interface WallBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxGap?: number;
  normal?: Vector3D;
  planePoint?: Vector3D;
}

const ZERO_GRADIENT: Vector3D = { x: 0, y: 0, z: 0 };
const ZERO_HESSIAN: Matrix3x3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export function createWallBarrier(options: WallBarrierOptions = {}): FoldConstraint {
  const baseBarrier = createCubicBarrier({
    id: options.id,
    maxGap: options.maxGap,
    direction: options.normal,
  });

  return {
    type: 'wall-barrier',
    id: options.id,
    enabled: true,
    evaluate(state: FoldConstraintState, context: FoldComputationContext): FoldConstraintEvaluation {
      const wallNormal = normalise(options.normal ?? state.direction);
      if (!wallNormal) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const adjustedGap = adjustGap(state, wallNormal, options.planePoint);

      const stiffness = options.stiffnessOverride ??
        computeFrozenStiffness(
          {
            gap: adjustedGap,
            effectiveMass: state.effectiveMass ?? 0,
            direction: wallNormal,
            hessian: (state.metadata?.hessian as Matrix3x3 | undefined) ?? ZERO_HESSIAN,
          },
          { min: 0 }
        );

      if (stiffness <= 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const evaluation = baseBarrier.evaluate(
        {
          ...state,
          gap: adjustedGap,
          direction: wallNormal,
          stiffness,
          maxGap: options.maxGap ?? state.maxGap,
        },
        context
      );

      return evaluation;
    },
  };
}

function adjustGap(
  state: FoldConstraintState,
  normal: Vector3D,
  planePoint: Vector3D | undefined
): number {
  if (!planePoint) {
    return state.gap;
  }

  const position = state.metadata?.position as Vector3D | undefined;
  if (!position) {
    return state.gap;
  }

  const offsetVector = {
    x: position.x - planePoint.x,
    y: position.y - planePoint.y,
    z: position.z - planePoint.z,
  };
  const signedDistance = dot(offsetVector, normal);
  return Math.min(state.gap, signedDistance);
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

function dot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
