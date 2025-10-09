import { describe, it, expect } from 'vitest';
import { runLengthEncode, runLengthDecode } from '../src/index.js';

describe('RLE', () => {
  it('encodes and decodes repetitive strings', () => {
    const s = 'AAAABBBCCDAA';
    const pairs = runLengthEncode(s);
    expect(pairs).toEqual([
      { char: 'A', count: 4 },
      { char: 'B', count: 3 },
      { char: 'C', count: 2 },
      { char: 'D', count: 1 },
      { char: 'A', count: 2 },
    ]);
    expect(runLengthDecode(pairs)).toBe(s);
  });

  it('handles empty and mixed content', () => {
    expect(runLengthEncode('')).toEqual([]);
    const s = 'ABAB';
    expect(runLengthDecode(runLengthEncode(s))).toBe(s);
  });
});

