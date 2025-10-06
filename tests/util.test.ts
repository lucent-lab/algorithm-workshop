import { describe, it, expect } from 'vitest';
import { memoize } from '../src/util/memoize.js';
import { diff } from '../src/data/diff.js';
import { groupBy } from '../src/data/groupBy.js';
import { perlin } from '../src/procedural/perlin.js';

describe('memoize', () => {
  it('caches function results', () => {
    let calls = 0;
    const fn = memoize((n: number) => {
      calls += 1;
      return n * 2;
    });

    expect(fn(2)).toBe(4);
    expect(fn(2)).toBe(4);
    expect(calls).toBe(1);
  });
});

describe('diff', () => {
  it('creates insert/remove operations', () => {
    const operations = diff(['a', 'b'], ['b', 'c']);
    expect(operations).toEqual([
      { type: 'remove', value: 'a' },
      { type: 'equal', value: 'b' },
      { type: 'insert', value: 'c' },
    ]);
  });
});

describe('groupBy', () => {
  it('groups by property name', () => {
    const grouped = groupBy(
      [
        { category: 'fruit', name: 'apple' },
        { category: 'veg', name: 'kale' },
        { category: 'fruit', name: 'pear' },
      ],
      'category'
    );
    expect(Object.keys(grouped)).toEqual(['fruit', 'veg']);
    expect(grouped.fruit).toHaveLength(2);
  });
});

describe('perlin', () => {
  it('generates deterministic noise for given seed', () => {
    const first = perlin({ width: 3, height: 3, seed: 42 });
    const second = perlin({ width: 3, height: 3, seed: 42 });
    expect(first).toEqual(second);
  });
});
