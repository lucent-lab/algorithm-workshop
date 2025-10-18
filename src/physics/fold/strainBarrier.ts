import type { Matrix3x3, Vector3D } from '../../types.js';
import type {
  FoldComputationContext,
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
} from './types.js';
import { createCubicBarrier } from './cubicBarrier.js';
import { computeFrozenStiffness } from './stiffness.js';

export interface StrainBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxStretch?: number;
  minCompression?: number;
  direction?: Vector3D;
}

const ZERO_GRADIENT: Vector3D = { x: 0, y: 0, z: 0 };
const ZERO_HESSIAN: Matrix3x3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const DEFAULT_MAX_STRETCH = 1.1;
const DEFAULT_MIN_COMPRESSION = 0.9;

export function createStrainBarrier(options: StrainBarrierOptions = {}): FoldConstraint {
  const baseBarrier = createCubicBarrier({
    id: options.id,
    maxGap: 0,
    direction: options.direction,
  });

  return {
    type: 'strain-barrier',
    id: options.id,
    enabled: true,
    evaluate(state: FoldConstraintState, context: FoldComputationContext): FoldConstraintEvaluation {
      const singularValues = extractSingularValues(state.metadata?.singularValues);
      if (singularValues.length === 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const maxStretch = options.maxStretch ?? DEFAULT_MAX_STRETCH;
      const minCompression = options.minCompression ?? DEFAULT_MIN_COMPRESSION;

      const violation = computeViolation(singularValues, maxStretch, minCompression);
      if (violation <= 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const direction = normalise(options.direction ?? state.direction);
      if (!direction) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const stiffness = options.stiffnessOverride ??
        computeFrozenStiffness(
          {
            gap: -violation,
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
          gap: -violation,
          direction,
          stiffness,
          maxGap: 0,
        },
        context
      );

      return evaluation;
    },
  };
}

function computeViolation(values: ReadonlyArray<number>, maxStretch: number, minCompression: number): number {
  let violation = 0;
  for (const sigma of values) {
    if (!Number.isFinite(sigma)) continue;
    if (sigma > maxStretch) {
      violation = Math.max(violation, sigma - maxStretch);
    } else if (sigma < minCompression) {
      violation = Math.max(violation, minCompression - sigma);
    }
  }
  return violation;
}

function extractSingularValues(values: unknown): number[] {
  if (!Array.isArray(values)) {
    return [];
  }
  return values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
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
