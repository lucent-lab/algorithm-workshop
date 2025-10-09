import { describe, it, expect } from 'vitest';
import { BloomFilter } from '../src/index.js';

describe('BloomFilter', () => {
  it('adds items and reports membership without false negatives', () => {
    const bf = BloomFilter.fromCapacity(1000, 0.01, 123);
    const items = Array.from({ length: 200 }, (_, i) => `key-${i}`);
    for (const x of items) bf.add(x);
    for (const x of items) expect(bf.has(x)).toBe(true);

    // Most not-added items should be reported as false; avoid strict assertions
    const probes = Array.from({ length: 50 }, (_, i) => `other-${i + 10000}`);
    const maybes = probes.map((p) => bf.has(p));
    // At least some must be false
    expect(maybes.some((v) => v === false)).toBe(true);
  });
});

