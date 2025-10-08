interface Evaluated<T> {
  individual: T;
  fitness: number;
}

export type ParentSelector<T> = (
  population: ReadonlyArray<T>,
  fitnesses: ReadonlyArray<number>,
  random: () => number,
  maximize: boolean
) => number;

export interface GeneticAlgorithmOptions<T> {
  population: ReadonlyArray<T>;
  fitness: (individual: T) => number;
  mutate: (individual: T, random: () => number) => T;
  crossover?: (a: T, b: T, random: () => number) => T;
  selection?: ParentSelector<T>;
  elitism?: number;
  maximize?: boolean;
  random?: () => number;
}

export interface GeneticAlgorithmController<T> {
  step(): void;
  run(generations: number): void;
  getPopulation(): ReadonlyArray<T>;
  getBest(): Evaluated<T>;
  getGeneration(): number;
}

export function createGeneticAlgorithm<T>(options: GeneticAlgorithmOptions<T>): GeneticAlgorithmController<T> {
  validateOptions(options);

  const random = options.random ?? Math.random;
  const selector = options.selection ?? tournamentSelection;
  const maximize = options.maximize ?? true;
  const elitism = options.elitism ?? 0;
  const size = options.population.length;
  const mutate = options.mutate;
  const crossover = options.crossover;
  const fitness = options.fitness;

  let generation = 0;
  let population = options.population.slice();
  let evaluated = evaluatePopulation(population, fitness);

  function step(): void {
    generation += 1;
    evaluated = evaluatePopulation(population, fitness);
    const sorted = [...evaluated].sort((a, b) => compareFitness(a.fitness, b.fitness, maximize));

    const newPopulation: T[] = [];
    const eliteCount = Math.min(Math.max(elitism, 0), size);
    for (let index = 0; index < eliteCount; index += 1) {
      newPopulation.push(sorted[index].individual);
    }

    const fitnesses = evaluated.map((entry) => entry.fitness);
    while (newPopulation.length < size) {
      const parentA = population[selector(population, fitnesses, random, maximize)];
      const parentB = population[selector(population, fitnesses, random, maximize)];
      let child = crossover ? crossover(parentA, parentB, random) : parentA;
      child = mutate(child, random);
      newPopulation.push(child);
    }

    population = newPopulation;
    evaluated = evaluatePopulation(population, fitness);
  }

  function run(generations: number): void {
    if (!Number.isInteger(generations) || generations < 0) {
      throw new Error('generations must be a non-negative integer.');
    }
    for (let index = 0; index < generations; index += 1) {
      step();
    }
  }

  return {
    step,
    run,
    getPopulation: () => population.slice(),
    getBest: () => [...evaluated].sort((a, b) => compareFitness(a.fitness, b.fitness, maximize))[0],
    getGeneration: () => generation,
  };
}

function evaluatePopulation<T>(population: ReadonlyArray<T>, fitness: (individual: T) => number): Evaluated<T>[] {
  return population.map((individual) => ({ individual, fitness: fitness(individual) }));
}

function compareFitness(a: number, b: number, maximize: boolean): number {
  return maximize ? b - a : a - b;
}

function tournamentSelection<T>(
  population: ReadonlyArray<T>,
  fitnesses: ReadonlyArray<number>,
  random: () => number,
  maximize: boolean
): number {
  const size = population.length;
  const candidates = Math.min(3, size);
  let bestIndex = randomIndex(size, random);
  for (let i = 1; i < candidates; i += 1) {
    const contender = randomIndex(size, random);
    if (compareFitness(fitnesses[contender], fitnesses[bestIndex], maximize) < 0) {
      continue;
    }
    bestIndex = contender;
  }
  return bestIndex;
}

function randomIndex(size: number, random: () => number): number {
  return Math.max(0, Math.min(size - 1, Math.floor(random() * size)));
}

function validateOptions<T>(options: GeneticAlgorithmOptions<T>): void {
  if (!Array.isArray(options.population) || options.population.length === 0) {
    throw new Error('population must contain at least one individual.');
  }
  if (typeof options.fitness !== 'function') {
    throw new Error('fitness function is required.');
  }
  if (typeof options.mutate !== 'function') {
    throw new Error('mutate function is required.');
  }
  if (options.elitism !== undefined && (!Number.isInteger(options.elitism) || options.elitism < 0)) {
    throw new Error('elitism must be a non-negative integer.');
  }
}

