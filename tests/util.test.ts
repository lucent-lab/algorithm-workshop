import { describe, it, expect } from 'vitest';
import { memoize } from '../src/util/memoize.js';
import { diff } from '../src/data/diff.js';
import { groupBy } from '../src/data/groupBy.js';
import { deepClone } from '../src/data/deepClone.js';
import { LRUCache } from '../src/util/lruCache.js';
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

describe('deepClone', () => {
  it('clones nested collections without sharing references', () => {
    const original = {
      date: new Date('2024-01-01T00:00:00Z'),
      regex: /abc/gi,
      map: new Map([
        ['nested', { value: 42 }],
      ]),
      set: new Set([1, 2]),
      list: [1, { inner: ['x', 'y'] }],
    };
    const clone = deepClone(original);

    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.map).not.toBe(original.map);
    expect(clone.set).not.toBe(original.set);
    expect(clone.list).not.toBe(original.list);
    expect(clone.list[1]).not.toBe(original.list[1]);
    expect(clone.map.get('nested')).not.toBe(original.map.get('nested'));
  });

  it('preserves cyclic references', () => {
    const node: { value: number; self?: unknown } = { value: 1 };
    node.self = node;

    const clone = deepClone(node);
    expect(clone).not.toBe(node);
    expect(clone.self).toBe(clone);
  });
});

describe('LRUCache', () => {
  it('evicts least recently used entries and updates access order', () => {
    const cache = new LRUCache<string, number>(2);
    cache.put('a', 1);
    cache.put('b', 2);
    expect(cache.get('a')).toBe(1);

    cache.put('c', 3);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);

    cache.put('a', 4);
    expect(cache.get('a')).toBe(4);
  });

  it('throws on invalid capacity', () => {
    expect(() => new LRUCache(0)).toThrow('capacity must be a positive integer');
  });
});

describe('perlin', () => {
  it('generates deterministic noise for given seed', () => {
    const first = perlin({ width: 3, height: 3, seed: 42 });
    const second = perlin({ width: 3, height: 3, seed: 42 });
    expect(first).toEqual(second);
  });
});
