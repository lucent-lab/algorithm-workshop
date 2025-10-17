import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  createFoldConstraintRegistry,
  type FoldConstraint,
  type FoldConstraintEvaluation,
  type FoldConstraintState,
  type FoldConstraintType,
} from '../src/physics/fold/index.js';

const testConstraint: FoldConstraint = {
  type: 'cubic-barrier',
  enabled: true,
  evaluate(state) {
    return {
      energy: state.gap ** 2,
      gradient: { x: 0, y: 0, z: 0 },
      hessian: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
    };
  },
};

const registry = createFoldConstraintRegistry();
registry.register({
  type: 'cubic-barrier',
  create: () => testConstraint,
});

describe('Fold constraint registry', () => {
  it('registers and retrieves factories', () => {
    expect(registry.get('cubic-barrier')).toBeDefined();
    expect(registry.list()).toHaveLength(1);
  });

  it('evaluates through registered constraint', () => {
    const factory = registry.get('cubic-barrier');
    expect(factory).toBeDefined();
    if (!factory) return;

    const instance = factory.create({} as unknown);
    const evaluation = instance.evaluate(
      {
        gap: 0.1,
        maxGap: 1,
        stiffness: 10,
        direction: { x: 0, y: 0, z: 1 },
      },
      { deltaTime: 1 }
    );

    expect(evaluation.energy).toBeTypeOf('number');
  });

  it('provides type safety helpers', () => {
    expectTypeOf<FoldConstraintType>().toEqualTypeOf<
      | 'cubic-barrier'
      | 'contact-barrier'
      | 'pin-barrier'
      | 'wall-barrier'
      | 'strain-barrier'
      | 'friction'
      | 'assembly'
      | 'gap-evaluator'
    >();

    expectTypeOf<FoldConstraint>().toMatchTypeOf<FoldConstraint<FoldConstraintState, FoldConstraintEvaluation>>();
  });
});
