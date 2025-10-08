import { describe, expect, it } from 'vitest';

import { createGeneticAlgorithm } from '../src/index.js';

const TARGET = '1111';

describe('createGeneticAlgorithm', () => {
  it('evolves population toward higher fitness with elitism', () => {
    let randomIndex = 0;
    const sequence = [0.1, 0.6, 0.2, 0.8, 0.4, 0.9, 0.3, 0.7];
    const random = () => {
      const value = sequence[randomIndex % sequence.length];
      randomIndex += 1;
      return value;
    };

    const initial = ['0000', '0101', '1010', '0011'];

    const ga = createGeneticAlgorithm<string>({
      population: initial,
      fitness: score,
      mutate: (individual) => mutate(individual),
      crossover: (a, b, rand) => crossover(a, b, rand),
      elitism: 1,
      random,
    });

    expect(ga.getBest().fitness).toBeLessThan(TARGET.length);

    ga.run(3);

    const best = ga.getBest();
    expect(best.individual).toBe(TARGET);
    expect(best.fitness).toBe(TARGET.length);
    expect(ga.getGeneration()).toBe(3);
  });
});

function score(individual: string): number {
  let total = 0;
  for (let index = 0; index < TARGET.length; index += 1) {
    if (individual[index] === TARGET[index]) {
      total += 1;
    }
  }
  return total;
}

function mutate(individual: string): string {
  if (individual === TARGET) {
    return individual;
  }
  return TARGET;
}

function crossover(a: string, b: string, rand: () => number): string {
  const midpoint = Math.floor(rand() * TARGET.length);
  return a.slice(0, midpoint) + b.slice(midpoint);
}
