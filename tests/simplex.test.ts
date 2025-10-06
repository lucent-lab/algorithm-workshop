import { describe, it, expect } from 'vitest';
import { simplex2D, SimplexNoise } from '../src/procedural/simplex.js';

describe('Simplex noise', () => {
  it('returns deterministic samples for given seed', () => {
    const first = simplex2D(0.1, 0.2, 99);
    const second = simplex2D(0.1, 0.2, 99);
    expect(first).toBeCloseTo(second, 10);
  });

  it('produces different noise with different seeds', () => {
    const a = simplex2D(0.3, 0.7, 1);
    const b = simplex2D(0.3, 0.7, 2);
    expect(a).not.toBe(b);
  });

  it('supports reusable generator instances', () => {
    const simplex = new SimplexNoise(7);
    const a = simplex.simplex3D(0.1, 0.2, 0.3);
    const b = simplex.simplex3D(0.1, 0.2, 0.3);
    expect(a).toBeCloseTo(b, 10);
  });
});
