import { createGeneticAlgorithm } from '../src/index.js';

const TARGET = 'HELLO';

type Individual = string;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let randomIndex = 0;
const sequence = [0.2, 0.8, 0.5, 0.3, 0.9, 0.1, 0.7, 0.4, 0.6, 0.2];
const seededRandom = () => {
  const value = sequence[randomIndex % sequence.length];
  randomIndex += 1;
  return value;
};

const initialPopulation: Individual[] = Array.from({ length: 5 }, () => randomIndividual(seededRandom));

const ga = createGeneticAlgorithm<Individual>({
  population: initialPopulation,
  fitness: computeFitness,
  mutate: (individual, rand) => mutateIndividual(individual, rand),
  crossover: (a, b, rand) => crossoverIndividuals(a, b, rand),
  elitism: 1,
  random: seededRandom,
});

console.log('Generation', ga.getGeneration(), 'best', ga.getBest());
ga.run(5);
const best = ga.getBest();
console.log('Generation', ga.getGeneration(), 'best individual', best.individual, 'fitness', best.fitness);

function computeFitness(individual: Individual): number {
  let score = 0;
  for (let i = 0; i < TARGET.length; i += 1) {
    if (individual[i] === TARGET[i]) {
      score += 1;
    }
  }
  return score;
}

function mutateIndividual(individual: Individual, rand: () => number): Individual {
  const index = Math.floor(rand() * TARGET.length);
  const chars = individual.split('');
  chars[index] = TARGET[index];
  return chars.join('');
}

function crossoverIndividuals(a: Individual, b: Individual, rand: () => number): Individual {
  const midpoint = Math.floor(rand() * TARGET.length);
  return a.slice(0, midpoint) + b.slice(midpoint);
}

function randomIndividual(rand: () => number): Individual {
  let result = '';
  for (let i = 0; i < TARGET.length; i += 1) {
    const index = Math.floor(rand() * alphabet.length);
    result += alphabet[index];
  }
  return result;
}
