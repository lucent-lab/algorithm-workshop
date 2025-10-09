import { describe, it, expect } from 'vitest';
import { UnionFind } from '../src/index.js';

describe('UnionFind', () => {
  it('unions and finds components for numbers', () => {
    const uf = new UnionFind([0, 1, 2, 3, 4]);
    uf.union(0, 1);
    uf.union(2, 3);
    expect(uf.connected(0, 1)).toBe(true);
    expect(uf.connected(0, 2)).toBe(false);
    uf.union(1, 2);
    expect(uf.connected(0, 3)).toBe(true);
    expect(uf.size(0)).toBe(4);
    expect(uf.size(4)).toBe(1);
  });

  it('supports string keys', () => {
    const uf = new UnionFind<string>(['a', 'b', 'c']);
    uf.union('a', 'b');
    expect(uf.connected('a', 'b')).toBe(true);
    expect(uf.connected('a', 'c')).toBe(false);
    uf.makeSet('d');
    expect(uf.size('d')).toBe(1);
  });
});

