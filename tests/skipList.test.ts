import { describe, it, expect } from 'vitest';
import { SkipList } from '../src/index.js';

describe('SkipList', () => {
  it('inserts, finds, removes, and iterates in order', () => {
    const sl = new SkipList<number>({ seed: 1337 });
    const data = [5, 1, 9, 3, 7];
    data.forEach((x) => sl.insert(x));
    expect(sl.has(3)).toBe(true);
    expect(sl.has(4)).toBe(false);
    expect(Array.from(sl.values())).toEqual([1, 3, 5, 7, 9]);
    expect(sl.remove(5)).toBe(true);
    expect(Array.from(sl.values())).toEqual([1, 3, 7, 9]);
    expect(sl.remove(5)).toBe(false);
  });
});

