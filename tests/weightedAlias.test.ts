import { describe, expect, it } from 'vitest';

import { createWeightedAliasSampler } from '../src/index.js';

describe('createWeightedAliasSampler', () => {
  it('throws on empty entries', () => {
    expect(() => createWeightedAliasSampler([])).toThrow();
  });

  it('samples according to weights with deterministic random', () => {
    const sampler = createWeightedAliasSampler([
      { value: 'a', weight: 1 },
      { value: 'b', weight: 3 },
    ]);

    const rngValues = [0.1, 0.6, 0.8, 0.2, 0.9];
    let index = 0;
    const random = () => {
      const value = rngValues[index % rngValues.length];
      index += 1;
      return value ?? 0;
    };

    const samples = Array.from({ length: rngValues.length }, () => sampler.sample(random));
    expect(samples.filter((value) => value === 'b').length).toBeGreaterThan(
      samples.filter((value) => value === 'a').length
    );
  });
});
