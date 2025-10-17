import type { Matrix3x3, Vector3D } from '../../types.js';

export type FoldConstraintType =
  | 'cubic-barrier'
  | 'contact-barrier'
  | 'pin-barrier'
  | 'wall-barrier'
  | 'strain-barrier'
  | 'friction'
  | 'assembly'
  | 'gap-evaluator';

export interface FoldConstraintState {
  /** Signed distance or constraint gap value. */
  gap: number;
  /** Maximum admissible distance before penalties engage. */
  maxGap: number;
  /** Effective stiffness (frozen) for this evaluation. */
  stiffness: number;
  /** Primary constraint direction or normal. */
  direction: Vector3D;
  /** Optional extended direction used by Fold contact formulations. */
  extendedDirection?: Vector3D;
  /** Effective mass or mass-like term used for stiffness design. */
  effectiveMass?: number;
  /** Optional metadata bag for constraint-specific state. */
  metadata?: Record<string, unknown>;
}

export interface FoldComputationContext {
  /** Current simulation time step. */
  deltaTime: number;
  /** Iteration index inside the solver/integrator. */
  iteration?: number;
  /** Optional absolute time for schedule dependent systems. */
  time?: number;
}

export interface FoldConstraintEvaluation {
  energy: number;
  gradient: Vector3D;
  hessian: Matrix3x3;
}

export interface FoldConstraint<TState = FoldConstraintState, TResult = FoldConstraintEvaluation> {
  readonly type: FoldConstraintType;
  readonly id?: string;
  enabled: boolean;
  evaluate(state: TState, context: FoldComputationContext): TResult;
}

export interface FoldConstraintFactory<TConfig, TState = FoldConstraintState, TResult = FoldConstraintEvaluation> {
  readonly type: FoldConstraintType;
  create(config: TConfig): FoldConstraint<TState, TResult>;
}

export interface FoldConstraintRegistry {
  register<TConfig>(factory: FoldConstraintFactory<TConfig>): void;
  get(type: FoldConstraintType): FoldConstraintFactory<unknown> | undefined;
  list(): ReadonlyArray<FoldConstraintFactory<unknown>>;
}

export function createFoldConstraintRegistry(): FoldConstraintRegistry {
  const factories = new Map<FoldConstraintType, FoldConstraintFactory<unknown>>();

  return {
    register<TConfig>(factory: FoldConstraintFactory<TConfig>) {
      factories.set(factory.type, factory as FoldConstraintFactory<unknown>);
    },
    get(type: FoldConstraintType) {
      return factories.get(type);
    },
    list() {
      return Array.from(factories.values());
    },
  };
}

export interface FoldSolverSettings {
  maxIterations: number;
  tolerance: number;
  allowEarlyExit?: boolean;
}

export interface FoldSystemState {
  positions: Array<Vector3D>;
  velocities: Array<Vector3D>;
  constraints: Array<FoldConstraint>;
  settings: FoldSolverSettings;
}
