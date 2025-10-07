import { createLinearCongruentialGenerator } from '../util/prng.js';

export interface StochasticRule {
  successor: string;
  weight?: number;
}

export type ProductionRule = string | ReadonlyArray<StochasticRule>;

export type LSystemRules = Readonly<Record<string, ProductionRule>>;

export interface LSystemOptions {
  axiom: string;
  rules: LSystemRules;
  iterations: number;
  seed?: number;
  trackHistory?: boolean;
}

export interface LSystemResult {
  result: string;
  history: string[];
}

/**
 * Generates rewritten strings using Lindenmayer systems (L-systems).
 * Useful for: procedural foliage, fractal curves, grammar-based content.
 * Performance: O(n * iterations) where n is current string length per step.
 */
export function generateLSystem({
  axiom,
  rules,
  iterations,
  seed = Date.now(),
  trackHistory = false,
}: LSystemOptions): LSystemResult {
  if (iterations < 0 || !Number.isInteger(iterations)) {
    throw new Error('iterations must be a non-negative integer.');
  }
  if (!axiom) {
    throw new Error('axiom must be a non-empty string.');
  }

  const random = createLinearCongruentialGenerator(seed);
  let current = axiom;
  const history: string[] = trackHistory ? [axiom] : [];

  for (let i = 0; i < iterations; i += 1) {
    let next = '';
    for (const symbol of current) {
      const production = rules[symbol];
      if (production === undefined) {
        next += symbol;
        continue;
      }
      if (typeof production === 'string') {
        next += production;
      } else if (Array.isArray(production) && production.length > 0) {
        next += selectStochasticSuccessor(production, random);
      } else {
        next += symbol;
      }
    }
    current = next;
    if (trackHistory) {
      history.push(current);
    }
  }

  return {
    result: current,
    history,
  };
}

function selectStochasticSuccessor(rules: ReadonlyArray<StochasticRule>, random: () => number): string {
  let totalWeight = 0;
  for (const rule of rules) {
    totalWeight += rule.weight ?? 1;
  }
  if (totalWeight <= 0) {
    return rules[0]?.successor ?? '';
  }
  const threshold = random() * totalWeight;
  let cumulative = 0;
  for (const rule of rules) {
    cumulative += rule.weight ?? 1;
    if (threshold <= cumulative) {
      return rule.successor;
    }
  }
  return rules[rules.length - 1]?.successor ?? '';
}
