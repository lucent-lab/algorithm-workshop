import { describe, expect, it } from 'vitest';
import { calculateVirtualRange } from '../src/util/virtualScroll.js';

describe('calculateVirtualRange', () => {
  it('computes window for constant item heights', () => {
    const result = calculateVirtualRange({
      itemCount: 1000,
      itemHeight: 20,
      scrollOffset: 200,
      viewportHeight: 100,
    });

    expect(result.startIndex).toBe(9);
    expect(result.endIndex).toBe(15);
    expect(result.padFront).toBe(180);
    expect(result.padEnd).toBe(result.totalSize - result.padFront - result.items.reduce((sum, item) => sum + item.size, 0));
    expect(result.items).toHaveLength(7);
    result.items.forEach((item, index) => {
      expect(item.offset).toBe(180 + index * 20);
      expect(item.size).toBe(20);
    });
  });

  it('honours measurement overrides for specific rows', () => {
    const result = calculateVirtualRange({
      itemCount: 5,
      itemHeight: 20,
      scrollOffset: 0,
      viewportHeight: 90,
      measurements: [undefined, 40, undefined, 10],
      overscan: 0,
    });

    expect(result.startIndex).toBe(0);
    expect(result.items[1]).toMatchObject({ index: 1, size: 40 });
    expect(result.items[3]).toMatchObject({ index: 3, size: 10 });
    const totalVisible = result.items.reduce((sum, item) => sum + item.size, 0);
    expect(result.totalSize).toBe(5 * 20 + (40 - 20) + (10 - 20));
    expect(result.padEnd).toBe(0);
    expect(result.padFront + totalVisible + result.padEnd).toBe(result.totalSize);
  });

  it('returns empty result when list is empty', () => {
    const result = calculateVirtualRange({
      itemCount: 0,
      itemHeight: 20,
      scrollOffset: 0,
      viewportHeight: 100,
    });

    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(-1);
    expect(result.items).toHaveLength(0);
    expect(result.totalSize).toBe(0);
  });

  it('validates inputs', () => {
    expect(() =>
      calculateVirtualRange({
        itemCount: -1,
        itemHeight: 10,
        scrollOffset: 0,
        viewportHeight: 10,
      })
    ).toThrow(TypeError);

    expect(() =>
      calculateVirtualRange({
        itemCount: 1,
        itemHeight: 0,
        scrollOffset: 0,
        viewportHeight: 10,
      })
    ).toThrow(TypeError);

    expect(() =>
      calculateVirtualRange({
        itemCount: 1,
        itemHeight: 10,
        scrollOffset: -1,
        viewportHeight: 10,
      })
    ).toThrow(TypeError);

    expect(() =>
      calculateVirtualRange({
        itemCount: 2,
        itemHeight: 10,
        scrollOffset: 0,
        viewportHeight: 10,
        measurements: [10, 0],
      })
    ).toThrow(TypeError);
  });
});
