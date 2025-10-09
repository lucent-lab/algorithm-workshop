import { describe, it, expect } from 'vitest';
import { BinaryHeap } from '../src/index.js';

describe('BinaryHeap', () => {
  it('orders items by comparator', () => {
    const heap = new BinaryHeap<number>((a, b) => a - b, [5, 1, 3, 4, 2]);
    expect(heap.size).toBe(5);
    expect(heap.peek()).toBe(1);
    const popped: number[] = [];
    while (heap.size) popped.push(heap.pop()!);
    expect(popped).toEqual([1, 2, 3, 4, 5]);
  });

  it('supports pushing and popping', () => {
    const heap = new BinaryHeap<number>((a, b) => a - b);
    heap.push(10);
    heap.push(5);
    heap.push(7);
    expect(heap.peek()).toBe(5);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(7);
    expect(heap.pop()).toBe(10);
    expect(heap.pop()).toBeUndefined();
  });
});

