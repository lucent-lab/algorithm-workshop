import { describe, expect, it } from 'vitest';

import { createWaveSpawner } from '../src/index.js';

describe('createWaveSpawner', () => {
  it('spawns waves with delays and intervals', () => {
    const spawner = createWaveSpawner({
      waves: [
        { delay: 1, count: 2, interval: 0.5, template: 'grunt' },
        { delay: 2, count: 1, template: 'brute' },
      ],
    });

    let spawns = spawner.update(0.5);
    expect(spawns).toHaveLength(0);
    spawns = spawner.update(0.5);
    expect(spawns).toHaveLength(1);
    expect(spawns[0]).toMatchObject({ waveIndex: 0, entityIndex: 0, template: 'grunt' });

    spawns = spawner.update(0.5);
    expect(spawns).toHaveLength(1);
    expect(spawns[0].entityIndex).toBe(1);

    spawns = spawner.update(2);
    expect(spawns).toHaveLength(1);
    expect(spawns[0]).toMatchObject({ waveIndex: 1, entityIndex: 0, template: 'brute' });
    expect(spawner.isFinished()).toBe(true);
  });

  it('loops waves when configured', () => {
    const spawner = createWaveSpawner({
      loop: true,
      waves: [{ delay: 0, count: 1, template: 'loop' }],
    });

    let spawns = spawner.update(0);
    expect(spawns).toHaveLength(1);
    expect(spawner.isFinished()).toBe(false);

    spawns = spawner.update(0);
    expect(spawns).toHaveLength(1);
  });
});
