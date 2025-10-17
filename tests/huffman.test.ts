import { describe, expect, it } from 'vitest';

import { createHuffmanTable, huffmanEncode, huffmanDecode } from '../src/data/huffman.js';

describe('Huffman coding', () => {
  it('encodes and decodes text', () => {
    const input = 'the quick brown fox jumps over the lazy dog';
    const table = createHuffmanTable(input);
    const { bitString } = huffmanEncode(input);
    expect(bitString).not.toHaveLength(0);
    const decoded = huffmanDecode(bitString, table);
    expect(decoded).toBe(input);
  });

  it('handles single character strings', () => {
    const input = 'aaaaaa';
    const { bitString, table } = huffmanEncode(input);
    expect(new Set(bitString).size).toBeLessThanOrEqual(1);
    expect(huffmanDecode(bitString, table)).toBe(input);
  });

  it('validates encoded data and tables', () => {
    const table = createHuffmanTable('abc');
    expect(() => huffmanDecode('abc', table)).toThrow('0 or 1');
    expect(() => huffmanDecode('0101', {})).toThrow('at least one');
    const bitString = 'ab'.split('').map((char) => table[char] ?? '').join('');
    expect(() => huffmanDecode(`${bitString}1`, table)).toThrow('incomplete');
  });
});
