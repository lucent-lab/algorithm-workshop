import type { Matrix3x3, Vector3D } from '../../types.js';
import type {
  FoldComputationContext,
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
} from './types.js';

export interface FrictionOptions {
  id?: string;
  coefficient?: number;
  epsilon?: number;
}

const ZERO_GRADIENT: Vector3D = { x: 0, y: 0, z: 0 };
const ZERO_HESSIAN: Matrix3x3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export function createFrictionPotential(options: FrictionOptions = {}): FoldConstraint {
  const coefficient = options.coefficient ?? 0.5;
  const epsilon = options.epsilon ?? 1e-6;

  return {
    type: 'friction',
    id: options.id,
    enabled: true,
    evaluate(state: FoldConstraintState, context: FoldComputationContext): FoldConstraintEvaluation {
      void context;
      const contactForce = getContactForce(state.metadata?.contactForce);
      const tangent = getVector(state.metadata?.tangentDisplacement);

      if (!tangent || contactForce <= 0 || coefficient <= 0) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const rawMagnitude = Math.hypot(tangent.x, tangent.y, tangent.z);
      if (rawMagnitude <= epsilon) {
        return { energy: 0, gradient: ZERO_GRADIENT, hessian: ZERO_HESSIAN };
      }

      const tangentMagnitude = rawMagnitude;
      const normalizedTangent = {
        x: tangent.x / tangentMagnitude,
        y: tangent.y / tangentMagnitude,
        z: tangent.z / tangentMagnitude,
      };

      const stiffness = coefficient * contactForce / tangentMagnitude;
      const energy = 0.5 * stiffness * tangentMagnitude * tangentMagnitude;
      const gradient = scaleVector(normalizedTangent, stiffness * tangentMagnitude);
      const hessian = outerProduct(normalizedTangent, stiffness);

      return { energy, gradient, hessian };
    },
  };
}

function getContactForce(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function getVector(value: unknown): Vector3D | null {
  if (!value) return null;
  const vector = value as Partial<Vector3D>;
  if (
    typeof vector.x === 'number' && Number.isFinite(vector.x) &&
    typeof vector.y === 'number' && Number.isFinite(vector.y) &&
    typeof vector.z === 'number' && Number.isFinite(vector.z)
  ) {
    return { x: vector.x, y: vector.y, z: vector.z };
  }
  return null;
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
