import { describe, expect, it } from 'vitest';

import { bresenhamLine } from '../src/index.js';

describe('bresenhamLine', () => {
  it('handles horizontal lines', () => {
    const points = bresenhamLine({ x: 0, y: 2 }, { x: 4, y: 2 });
    expect(points).toEqual([
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ]);
  });

  it('handles steep lines', () => {
    const points = bresenhamLine({ x: 1, y: 1 }, { x: 3, y: 6 });
    expect(points).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
    ]);
  });

  it('rounds floating inputs', () => {
    const points = bresenhamLine({ x: 0.4, y: 0.6 }, { x: 2.6, y: 2.4 });
    expect(points).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ]);
  });

  it('handles identical points', () => {
    const points = bresenhamLine({ x: 1.2, y: 1.2 }, { x: 1.4, y: 1.4 });
    expect(points).toEqual([{ x: 1, y: 1 }]);
  });

  it('throws on invalid points', () => {
    expect(() => bresenhamLine({ x: Number.NaN, y: 0 }, { x: 1, y: 1 })).toThrow(/start.x/);
    expect(() => bresenhamLine({ x: 0, y: 0 }, { x: 1, y: Number.POSITIVE_INFINITY })).toThrow(/end.y/);
  });
});
