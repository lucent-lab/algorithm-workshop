import type { FoldConstraintEvaluation, FoldConstraintState } from './types.js';

export interface FreezeScheduleOptions {
  damping?: number;
  minStiffness?: number;
}

export function applyFreezeSchedule(
  state: FoldConstraintState,
  evaluation: FoldConstraintEvaluation,
  options: FreezeScheduleOptions = {}
): FoldConstraintState {
  const damping = options.damping ?? 0.95;
  const minStiffness = options.minStiffness ?? 1e-4;

  const stiffness = Math.max(state.stiffness * damping + evaluation.hessian[0][0] * (1 - damping), minStiffness);
  return {
    ...state,
    stiffness,
  };
}
