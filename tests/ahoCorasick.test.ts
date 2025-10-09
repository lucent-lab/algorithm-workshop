import { describe, expect, it } from 'vitest';

import { createAhoCorasick } from '../src/index.js';

describe('createAhoCorasick', () => {
  it('finds overlapping multi-pattern matches', () => {
    const ac = createAhoCorasick({ patterns: ['ab', 'bc', 'abc'] });
    const res = ac.search('ababc');
    expect(res['ab']).toEqual([0, 2]);
    expect(res['bc']).toEqual([3]);
    expect(res['abc']).toEqual([2]);
  });

  it('supports case-insensitive matching and empty patterns', () => {
    const ac = createAhoCorasick({ patterns: ['He', 'eL', ''], caseSensitive: false });
    const res = ac.search('HeLlo');
    expect(res['He']).toEqual([0]);
    expect(res['eL']).toEqual([1]);
    expect(res['']).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

