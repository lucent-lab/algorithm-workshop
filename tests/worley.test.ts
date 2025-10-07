import { describe, it, expect } from 'vitest';
import { worley, worleySample } from '../src/procedural/worley.js';

describe('worley noise', () => {
  it('produces deterministic matrix for same seed', () => {
    const first = worley({ width: 4, height: 4, points: 5, seed: 99 });
    const second = worley({ width: 4, height: 4, points: 5, seed: 99 });
    expect(first).toEqual(second);
  });

  it('supports custom distance metric', () => {
    const euclideanField = worley({ width: 3, height: 3, points: 2, seed: 7 });
    const manhattanField = worley({
      width: 3,
      height: 3,
      points: 2,
      seed: 7,
      distanceMetric: 'manhattan',
    });
    expect(euclideanField).not.toEqual(manhattanField);
  });

  it('computes sample distance against provided points', () => {
    const distance = worleySample(0.5, 0.5, [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ]);
    expect(distance).toBeCloseTo(Math.sqrt(0.5 ** 2 + 0.5 ** 2), 5);
  });
});
