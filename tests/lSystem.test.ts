import { describe, expect, it } from 'vitest';

import { generateLSystem } from '../src/index.js';

describe('generateLSystem', () => {
  it('expands deterministically for axiom and production rules', () => {
    const { result, history } = generateLSystem({
      axiom: 'A',
      iterations: 3,
      rules: {
        A: 'AB',
        B: 'A',
      },
      trackHistory: true,
    });

    expect(result).toBe('ABAAB');
    expect(history).toEqual(['A', 'AB', 'ABA', 'ABAAB']);
  });

  it('supports stochastic rules with deterministic seed', () => {
    const rules = {
      X: [
        { successor: 'XY', weight: 1 },
        { successor: 'XX', weight: 2 },
      ],
    } as const;

    const { result: a } = generateLSystem({ axiom: 'X', iterations: 4, rules, seed: 123 });
    const { result: b } = generateLSystem({ axiom: 'X', iterations: 4, rules, seed: 123 });
    const { result: c } = generateLSystem({ axiom: 'X', iterations: 4, rules, seed: 456 });

    expect(a).toEqual(b);
    expect(c).not.toEqual(a);
  });
});
