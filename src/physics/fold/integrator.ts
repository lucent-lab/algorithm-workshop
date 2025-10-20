import type { Matrix3x3, Vector3D } from '../../types.js';
import type {
  FoldConstraint,
  FoldConstraintEvaluation,
  FoldConstraintState,
  FoldComputationContext,
  FoldSolverSettings,
} from './types.js';
import { enforceSpd } from './spd.js';

export interface FoldIntegratorState {
  positions: Array<Vector3D>;
  velocities: Array<Vector3D>;
  constraints: Array<FoldConstraint>;
  settings: FoldSolverSettings;
  beta: number;
}

export interface IntegratorStepOptions {
  deltaTime: number;
  lineSearchScale?: number;
}

export interface IntegratorResult {
  positions: Array<Vector3D>;
  velocities: Array<Vector3D>;
  beta: number;
  iterations: number;
}

export function stepInexactNewton(
  state: FoldIntegratorState,
  options: IntegratorStepOptions
): IntegratorResult {
  validateState(state);
  const deltaTime = options.deltaTime;
  const lineSearchScale = options.lineSearchScale ?? 1.25;

  const context: FoldComputationContext = { deltaTime };
  let beta = state.beta;

  for (let iteration = 0; iteration < state.settings.maxIterations; iteration += 1) {
    context.iteration = iteration;
    const evaluations = evaluateConstraints(state.constraints, context);
    if (isConverged(evaluations, state.settings.tolerance)) {
      return {
        positions: state.positions,
        velocities: state.velocities,
        beta,
        iterations: iteration,
      };
    }

    beta = accumulateBeta(beta, deltaTime, iteration);
    applyLineSearch(state, evaluations, lineSearchScale);
    semiImplicitFreeze(state, evaluations);
  }

  return {
    positions: state.positions,
    velocities: state.velocities,
    beta,
    iterations: state.settings.maxIterations,
  };
}

function applyLineSearch(
  state: FoldIntegratorState,
  evaluations: FoldConstraintEvaluation[],
  scale: number
): void {
  for (const evaluation of evaluations) {
    if (!evaluation) continue;
    // Placeholder: scale positions by evaluation gradient to model line search.
    for (let i = 0; i < state.positions.length; i += 1) {
      state.positions[i] = add(state.positions[i], scaleVector(evaluation.gradient, -scale));
    }
  }
}

function semiImplicitFreeze(state: FoldIntegratorState, evaluations: FoldConstraintEvaluation[]): void {
  for (const evaluation of evaluations) {
    if (!evaluation) continue;
    const hessian = enforceSpd(evaluation.hessian);
    // Placeholder: adjust velocities based on SPD enforced Hessian.
    for (let i = 0; i < state.velocities.length; i += 1) {
      state.velocities[i] = add(state.velocities[i], multiplyMatrixVector(hessian, state.velocities[i]));
    }
  }
}

function accumulateBeta(beta: number, deltaTime: number, iteration: number): number {
  return beta + deltaTime * Math.pow(0.5, iteration + 1);
}

function evaluateConstraints(
  constraints: Array<FoldConstraint>,
  context: FoldComputationContext
): FoldConstraintEvaluation[] {
  const evaluations: FoldConstraintEvaluation[] = [];
  for (const constraint of constraints) {
    if (!constraint.enabled) continue;
    const state: FoldConstraintState = {
      gap: 0,
      maxGap: 0,
      stiffness: 0,
      direction: { x: 0, y: 1, z: 0 },
    };
    evaluations.push(constraint.evaluate(state, context));
  }
  return evaluations;
}

function isConverged(evaluations: FoldConstraintEvaluation[], tolerance: number): boolean {
  return evaluations.every((evaluation) => Math.abs(evaluation.energy) <= tolerance);
}

function validateState(state: FoldIntegratorState): void {
  if (!Array.isArray(state.positions) || !Array.isArray(state.velocities)) {
    throw new TypeError('Integrator state must contain positions and velocities arrays.');
  }
}

function add(a: Vector3D, b: Vector3D): Vector3D {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scaleVector(vector: Vector3D, scalar: number): Vector3D {
  return { x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar };
}

function multiplyMatrixVector(matrix: Matrix3x3, vector: Vector3D): Vector3D {
  return {
    x: (matrix[0][0] ?? 0) * vector.x + (matrix[0][1] ?? 0) * vector.y + (matrix[0][2] ?? 0) * vector.z,
    y: (matrix[1][0] ?? 0) * vector.x + (matrix[1][1] ?? 0) * vector.y + (matrix[1][2] ?? 0) * vector.z,
    z: (matrix[2][0] ?? 0) * vector.x + (matrix[2][1] ?? 0) * vector.y + (matrix[2][2] ?? 0) * vector.z,
  };
}
