import type { Matrix3x3, Vector3D } from '../../types.js';
import type {
  FoldComputationContext,
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
} from './types.js';
import { computeFrozenStiffness } from './stiffness.js';
import { createCubicBarrier } from './cubicBarrier.js';

export interface ContactBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxGap?: number;
  direction?: Vector3D;
  extendedDirectionScale?: number;
}

const ZERO_GRADIENT: Vector3D = { x: 0, y: 0, z: 0 };
const ZERO_HESSIAN: Matrix3x3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export function createContactBarrier(options: ContactBarrierOptions = {}): FoldConstraint {
  const extendedScale = options.extendedDirectionScale ?? 1.25;
  const baseBarrier = createCubicBarrier({
    id: options.id,
    stiffnessOverride: options.stiffnessOverride,
    maxGap: options.maxGap,
    direction: options.direction,
  });

  return {
    type: 'contact-barrier',
    id: options.id,
    enabled: true,
    evaluate(state: FoldConstraintState, context: FoldComputationContext): FoldConstraintEvaluation {
      const baseDirection = options.direction ?? state.direction;
      const contactDirection = state.extendedDirection ?? baseDirection ?? state.direction;
      const stiffness = options.stiffnessOverride ??
        computeFrozenStiffness(
          {
            gap: state.gap,
            effectiveMass: state.effectiveMass ?? 0,
            direction: contactDirection ?? baseDirection ?? state.direction,
            hessian: (state.metadata?.hessian as Matrix3x3 | undefined) ?? ZERO_HESSIAN,
          },
          { min: 0 }
        );

      const maxGap = options.maxGap ?? state.maxGap;
      const direction = contactDirection ?? baseDirection ?? state.direction;

      if (!direction) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const violation = Math.max(0, maxGap - state.gap * extendedScale);
      if (violation <= 0 || stiffness <= 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const unit = normalise(direction);
      if (!unit) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const cubicEvaluation = baseBarrier.evaluate(
        {
          ...state,
          maxGap,
          direction,
          stiffness,
        },
        context
      );

      return cubicEvaluation;
    },
  };
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
