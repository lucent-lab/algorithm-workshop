import type { Matrix3x3, Vector3D } from '../../types.js';
import type {
  FoldComputationContext,
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
} from './types.js';
import { computeFrozenStiffness } from './stiffness.js';
import { createCubicBarrier } from './cubicBarrier.js';

export interface PinBarrierOptions {
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

export function createPinBarrier(options: PinBarrierOptions = {}): FoldConstraint {
  const baseBarrier = createCubicBarrier({
    id: options.id,
    maxGap: options.maxGap,
    direction: options.direction,
  });

  return {
    type: 'pin-barrier',
    id: options.id,
    enabled: true,
    evaluate(state: FoldConstraintState, context: FoldComputationContext): FoldConstraintEvaluation {
      const direction = options.direction ?? state.direction;
      if (!direction) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const stiffness = options.stiffnessOverride ??
        computeFrozenStiffness(
          {
            gap: state.gap,
            effectiveMass: state.effectiveMass ?? 0,
            direction,
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
          stiffness,
          direction,
          maxGap: options.maxGap ?? state.maxGap,
        },
        context
      );

      return evaluation;
    },
  };
}
