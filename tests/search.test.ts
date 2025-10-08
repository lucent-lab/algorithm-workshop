import { describe, expect, it } from 'vitest';
import { binarySearch } from '../src/search/binarySearch.js';
import { fuzzySearch, fuzzyScore } from '../src/search/fuzzy.js';
import { Trie } from '../src/search/trie.js';
import { kmpSearch } from '../src/search/kmp.js';
import { rabinKarp } from '../src/search/rabinKarp.js';
import { boyerMooreSearch } from '../src/search/boyerMoore.js';
import { buildSuffixArray } from '../src/search/suffixArray.js';
import { diffStrings, longestCommonSubsequence } from '../src/search/lcs.js';

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

describe('kmpSearch', () => {
  it('finds all occurrences of a pattern', () => {
    expect(kmpSearch({ text: 'aaaaa', pattern: 'aa' })).toEqual([0, 1, 2, 3]);
  });

  it('supports case-insensitive matching', () => {
    expect(kmpSearch({ text: 'Hello World', pattern: 'world', caseSensitive: false })).toEqual([6]);
  });

  it('returns every position for empty pattern', () => {
    expect(kmpSearch({ text: 'abc', pattern: '' })).toEqual([0, 1, 2, 3]);
  });
});

describe('rabinKarp', () => {
  it('finds multiple patterns simultaneously', () => {
    const matches = rabinKarp({ text: 'abracadabra', patterns: ['abra', 'cad'] });
    expect(matches['abra']).toEqual([0, 7]);
    expect(matches['cad']).toEqual([4]);
  });

  it('supports case-insensitive matching and empty patterns', () => {
    const matches = rabinKarp({ text: 'ABCabc', patterns: ['abc', 'ABC', ''], caseSensitive: false });
    expect(matches['abc']).toEqual([0, 3]);
    expect(matches['ABC']).toEqual([0, 3]);
    expect(matches['']).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});

describe('boyerMooreSearch', () => {
  it('finds single pattern occurrences efficiently', () => {
    expect(boyerMooreSearch({ text: 'abracadabra', pattern: 'abra' })).toEqual([0, 7]);
  });

  it('handles case-insensitive searches and empty pattern', () => {
    expect(boyerMooreSearch({ text: 'Hello', pattern: 'hello', caseSensitive: false })).toEqual([0]);
    expect(boyerMooreSearch({ text: 'abc', pattern: '' })).toEqual([0, 1, 2, 3]);
  });
});

describe('buildSuffixArray', () => {
  it('produces suffix and LCP arrays', () => {
    const { suffixArray, lcpArray } = buildSuffixArray({ text: 'banana' });
    expect(suffixArray).toEqual([5, 3, 1, 0, 4, 2]);
    expect(lcpArray).toEqual([1, 3, 0, 0, 2]);
  });

  it('supports case-insensitive construction', () => {
    const lower = buildSuffixArray({ text: 'AbC', caseSensitive: true });
    const upper = buildSuffixArray({ text: 'abc', caseSensitive: false });
    expect(lower.suffixArray).not.toEqual(upper.suffixArray);
  });
});

describe('longestCommonSubsequence', () => {
  it('computes LCS length and sequence', () => {
    const result = longestCommonSubsequence({ a: 'ABCBDAB', b: 'BDCABA' });
    expect(result.length).toBe(4);
    expect(isSubsequence(result.sequence, 'ABCBDAB')).toBe(true);
    expect(isSubsequence(result.sequence, 'BDCABA')).toBe(true);
  });
});

describe('diffStrings', () => {
  it('emits diff operations between two strings', () => {
    const diff = diffStrings({ a: 'abc', b: 'axbc' });
    expect(diff).toEqual([
      { type: 'equal', value: 'a' },
      { type: 'insert', value: 'x' },
      { type: 'equal', value: 'b' },
      { type: 'equal', value: 'c' },
    ]);
  });
});

function isSubsequence(subsequence: string, text: string): boolean {
  let index = 0;
  for (const char of text) {
    if (char === subsequence[index]) {
      index += 1;
      if (index === subsequence.length) {
        return true;
      }
    }
  }
  return subsequence.length === 0;
}
