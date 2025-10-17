import { describe, expect, it } from 'vitest';

import { lz77Compress, lz77Decompress } from '../src/data/lz77.js';

describe('LZ77 compression', () => {
  it('round-trips a string with repeated sequences', () => {
    const input = 'abracadabra abracadabra';
    const tokens = lz77Compress(input, { windowSize: 12, lookaheadSize: 8 });
    const decoded = lz77Decompress(tokens);
    expect(decoded).toBe(input);
  });

  it('compresses highly repetitive data', () => {
    const input = 'aaaaaaaaaaaaaaaabbbbbbbbbbbb';
    const tokens = lz77Compress(input, { windowSize: 16 });
    expect(tokens.length).toBeLessThan(input.length);
    expect(lz77Decompress(tokens)).toBe(input);
  });

  it('validates tokens during decompression', () => {
    expect(() =>
      lz77Decompress([
        { offset: 5, length: 2, next: 'a' },
      ])
    ).toThrow('offset exceeds');
  });
});
