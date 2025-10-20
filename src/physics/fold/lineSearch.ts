import type { FoldConstraintEvaluation } from './types.js';

export interface LineSearchOptions {
  maxIterations?: number;
  scale?: number;
  tolerance?: number;
}

export function constraintLineSearch(
  evaluations: ReadonlyArray<FoldConstraintEvaluation>,
  options: LineSearchOptions = {}
): number {
  const maxIterations = options.maxIterations ?? 5;
  const scale = options.scale ?? 1.0;
  const tolerance = options.tolerance ?? 1e-6;

  let step = scale;
  for (let i = 0; i < maxIterations; i += 1) {
    if (evaluations.every((evaluation) => Math.abs(evaluation.energy) * step <= tolerance)) {
      break;
    }
    step *= 0.5;
  }
  return step;
}
