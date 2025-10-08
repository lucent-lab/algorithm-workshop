import { describe, expect, it } from 'vitest';

import { flatten, unflatten } from '../src/index.js';

describe('flatten/unflatten', () => {
  it('flattens nested objects with arrays', () => {
    const input = { user: { name: 'Ada', tags: ['researcher', 'engineer'] } };
    const result = flatten(input);
    expect(result).toEqual({
      'user.name': 'Ada',
      'user.tags.0': 'researcher',
      'user.tags.1': 'engineer',
    });
  });

  it('round-trips via unflatten', () => {
    const entries = {
      'config.theme': 'dark',
      'config.layout.columns': 3,
      'config.features.0': 'beta',
    };
    const restored = unflatten(entries);
    expect(restored).toEqual({
      config: {
        theme: 'dark',
        layout: { columns: 3 },
        features: ['beta'],
      },
    });
  });
});

