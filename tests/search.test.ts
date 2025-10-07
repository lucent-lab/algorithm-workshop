import { describe, expect, it } from 'vitest';
import { binarySearch } from '../src/search/binarySearch.js';
import { fuzzySearch, fuzzyScore } from '../src/search/fuzzy.js';
import { Trie } from '../src/search/trie.js';

describe('binarySearch', () => {
  it('finds elements in sorted numeric arrays', () => {
    const array = [1, 3, 5, 7, 9];
    expect(binarySearch(array, 1)).toBe(0);
    expect(binarySearch(array, 9)).toBe(4);
    expect(binarySearch(array, 4)).toBe(-1);
  });

  it('supports custom comparators', () => {
    const array = [
      { id: 1, name: 'alpha' },
      { id: 2, name: 'beta' },
      { id: 3, name: 'gamma' },
    ];
    const compare = (a: { id: number }, b: { id: number }) => a.id - b.id;
    expect(binarySearch(array, { id: 2, name: '' }, compare)).toBe(1);
  });
});

describe('fuzzy matching', () => {
  it('ranks matches by score and respects limit', () => {
    const items = ['apple', 'grape', 'snap', 'application'];
    expect(fuzzySearch('ap', items, 2)).toEqual(['apple', 'application']);
  });

  it('scores consecutive and word-start bonuses', () => {
    const base = fuzzyScore('ap', 'map');
    const wordStart = fuzzyScore('ap', 'apple');
    expect(wordStart).toBeGreaterThan(base);
  });

  it('returns empty array for blank queries and throws on invalid items', () => {
    expect(fuzzySearch('   ', ['a'])).toEqual([]);
    expect(() => fuzzySearch('a', null as unknown as string[])).toThrow(TypeError);
  });
});

describe('Trie', () => {
  it('supports insert, search, and startsWith operations', () => {
    const trie = new Trie();
    trie.insert('cat');
    trie.insert('car');
    trie.insert('cart');

    expect(trie.search('car')).toBe(true);
    expect(trie.search('cap')).toBe(false);
    expect(trie.startsWith('ca')).toEqual(['cat', 'car', 'cart']);
  });

  it('throws when inserting non-string values', () => {
    const trie = new Trie();
    expect(() => trie.insert(123 as unknown as string)).toThrow(TypeError);
  });
});
