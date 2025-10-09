import { describe, it, expect } from 'vitest';
import { SegmentTree } from '../src/index.js';

describe('SegmentTree', () => {
  it('supports range sum queries and point updates', () => {
    const st = new SegmentTree<number>({ values: [1, 3, 5, 7, 9, 11] });
    expect(st.query(0, 2)).toBe(9); // 1+3+5
    expect(st.query(2, 5)).toBe(32); // 5+7+9+11
    st.update(3, 10); // [1,3,5,10,9,11]
    expect(st.query(2, 5)).toBe(35);
    expect(st.query(0, 0)).toBe(1);
  });

  it('works with custom combine functions (min)', () => {
    const st = new SegmentTree<number>({
      values: [5, 2, 7, 3, 9],
      combine: (a, b) => Math.min(a, b),
      identity: Number.POSITIVE_INFINITY,
    });
    expect(st.query(0, 4)).toBe(2);
    expect(st.query(2, 3)).toBe(3);
    st.update(1, 6);
    expect(st.query(0, 2)).toBe(5);
  });
});

