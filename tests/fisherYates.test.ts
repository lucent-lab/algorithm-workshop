import { describe, expect, it } from 'vitest';

import { fisherYatesShuffle } from '../src/index.js';

describe('fisherYatesShuffle', () => {
  it('shuffles array in place using deterministic random', () => {
    const items = [1, 2, 3, 4];
    let index = 0;
    const randomValues = [0.1, 0.9, 0.3, 0.7];
    const random = () => {
      const value = randomValues[index % randomValues.length] ?? 0;
      index += 1;
      return value;
    };

    const result = fisherYatesShuffle(items, { random });
    expect(result).toEqual([2, 4, 3, 1]);
    expect(result).toBe(items); // in place
  });

  it('throws when random returns value outside [0,1)', () => {
    const arr = [1, 2];
    expect(() => fisherYatesShuffle(arr, { random: () => 1 })).toThrow();
  });
});
