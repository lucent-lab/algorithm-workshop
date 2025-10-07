import { describe, expect, it } from 'vitest';
import { levenshteinDistance } from '../src/search/levenshtein.js';

describe('levenshteinDistance', () => {
  it('computes edit distance between typical strings', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('handles empty strings', () => {
    expect(levenshteinDistance('', 'abc')).toBe(3);
    expect(levenshteinDistance('abc', '')).toBe(3);
  });

  it('returns zero for identical inputs', () => {
    expect(levenshteinDistance('same', 'same')).toBe(0);
  });

  it('throws when inputs are not strings', () => {
    expect(() => levenshteinDistance('abc', undefined as unknown as string)).toThrow(TypeError);
    expect(() => levenshteinDistance(undefined as unknown as string, 'abc')).toThrow(TypeError);
  });
});
