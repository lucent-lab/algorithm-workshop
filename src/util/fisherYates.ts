export interface FisherYatesOptions {
  random?: () => number;
}

/**
 * Shuffles an array in place using the Fisher–Yates algorithm.
 * Useful for: unbiased random permutations for gameplay, sampling, or testing.
 */
export function fisherYatesShuffle<T>(items: T[], options: FisherYatesOptions = {}): T[] {
  const { random = Math.random } = options;
  if (!Array.isArray(items)) {
    throw new Error('items must be an array');
  }
  for (let i = items.length - 1; i > 0; i -= 1) {
    const r = random();
    if (r < 0 || r >= 1) {
      throw new Error('random function must return value in [0,1).');
    }
    const j = Math.floor(r * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
