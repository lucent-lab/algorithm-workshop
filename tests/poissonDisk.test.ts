import { describe, expect, it } from 'vitest';

import { poissonDiskSampling } from '../src/index.js';

describe('poissonDiskSampling', () => {
  it('produces deterministic samples for a fixed seed', () => {
    const options = { width: 50, height: 50, radius: 5, seed: 1, maxAttempts: 15 } as const;
    const pointsA = poissonDiskSampling(options);
    const pointsB = poissonDiskSampling(options);
    expect(pointsA).toEqual(pointsB);
  });

  it('keeps samples within bounds and separated by radius', () => {
    const radius = 6;
    const samples = poissonDiskSampling({ width: 40, height: 40, radius, seed: 2 });

    expect(samples.length).toBeGreaterThan(0);
    for (const { x, y } of samples) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(40);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(40);
    }

    for (let i = 0; i < samples.length; i += 1) {
      const a = samples[i];
      for (let j = i + 1; j < samples.length; j += 1) {
        const b = samples[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        expect(distance).toBeGreaterThanOrEqual(radius);
      }
    }
  });
});
