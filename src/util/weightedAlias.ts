export interface WeightedAliasEntry<T = string> {
  value: T;
  weight: number;
}

export interface WeightedAliasSampler<T = string> {
  sample(random?: () => number): T;
  probabilities: number[];
  aliases: number[];
  values: T[];
}

/**
 * Creates a weighted random sampler using Vose's alias method.
 * Useful for: constant-time discrete sampling with many queries.
 * Complexity: O(n) preprocessing, O(1) sampling.
 */
export function createWeightedAliasSampler<T>(
  entries: ReadonlyArray<WeightedAliasEntry<T>>
): WeightedAliasSampler<T> {
  if (entries.length === 0) {
    throw new Error('entries must not be empty');
  }

  let totalWeight = 0;
  for (const entry of entries) {
    if (entry.weight <= 0) {
      throw new Error('weights must be positive numbers');
    }
    totalWeight += entry.weight;
  }
  if (totalWeight <= 0) {
    throw new Error('Total weight must be greater than zero.');
  }

  const count = entries.length;
  const probabilities = new Array<number>(count);
  const aliases = new Array<number>(count).fill(0);
  const values = entries.map((entry) => entry.value);

  const scaled = entries.map((entry) => (entry.weight * count) / totalWeight);
  const small: number[] = [];
  const large: number[] = [];

  scaled.forEach((value, index) => {
    if (value < 1) {
      small.push(index);
    } else {
      large.push(index);
    }
  });

  while (small.length > 0 && large.length > 0) {
    const less = small.pop()!;
    const more = large.pop()!;

    probabilities[less] = scaled[less];
    aliases[less] = more;

    scaled[more] = scaled[more] + scaled[less] - 1;
    if (scaled[more] < 1) {
      small.push(more);
    } else {
      large.push(more);
    }
  }

  for (const remaining of [...small, ...large]) {
    probabilities[remaining] = 1;
    aliases[remaining] = remaining;
  }

  function sample(random: () => number = Math.random): T {
    const r = random();
    if (r < 0 || r >= 1) {
      throw new Error('random function must return value in [0,1).');
    }
    const column = Math.floor(r * count);
    const probability = probabilities[column];
    const threshold = r * count - column;
    const index = threshold < probability ? column : aliases[column];
    return values[index];
  }

  return { sample, probabilities, aliases, values };
}
