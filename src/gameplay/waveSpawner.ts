export interface SpawnPayload<T> {
  waveIndex: number;
  entityIndex: number;
  template: T;
}

export interface WaveDefinition<T> {
  /** Delay in seconds before this wave starts. */
  delay: number;
  /** Number of entities to spawn in this wave. */
  count: number;
  /** Template or metadata for spawned entities. */
  template: T;
  /** Spacing in seconds between each spawn inside the wave. */
  interval?: number;
}

export interface WaveSpawnerOptions<T> {
  waves: ReadonlyArray<WaveDefinition<T>>;
  loop?: boolean;
}

export interface WaveSpawnerSnapshot {
  waveIndex: number;
  timeUntilNextSpawn: number;
  spawnedInWave: number;
  looped: number;
}

export interface WaveSpawner<T> {
  update(delta: number): SpawnPayload<T>[];
  isFinished(): boolean;
  reset(snapshot?: WaveSpawnerSnapshot): void;
  toJSON(): WaveSpawnerSnapshot;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertNonNegative(value: number, label: string): void {
  assertFinite(value, label);
  if (value < 0) {
    throw new Error(`${label} must be non-negative.`);
  }
}

function normalizeWaves<T>(waves: ReadonlyArray<WaveDefinition<T>>): WaveDefinition<T>[] {
  if (!Array.isArray(waves) || waves.length === 0) {
    throw new Error('waves must contain at least one definition.');
  }
  return waves.map((wave: WaveDefinition<T>, index) => {
    const { delay, count, template } = wave;
    const interval = wave.interval ?? 0;
    assertNonNegative(delay, `waves[${index}].delay`);
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error(`waves[${index}].count must be a positive integer.`);
    }
    if (wave.interval !== undefined) {
      assertNonNegative(interval, `waves[${index}].interval`);
    }
    return {
      delay,
      count,
      template,
      interval,
    };
  });
}

/**
 * Creates a wave spawner that emits spawn payloads based on configured waves.
 * Useful for: enemy spawning, encounter scripting, and timed events.
 */
export function createWaveSpawner<T>(options: WaveSpawnerOptions<T>): WaveSpawner<T> {
  const waves = normalizeWaves(options.waves);
  const loop = options.loop ?? false;
  const EPSILON = 1e-8;

  let waveIndex = 0;
  let timeUntilNextSpawn = waves[0]?.delay ?? 0;
  let spawnedInWave = 0;
  let loopCount = 0;

  function setState(index: number, time: number, spawned: number, loops: number): void {
    waveIndex = index;
    timeUntilNextSpawn = time;
    spawnedInWave = spawned;
    loopCount = loops;
  }

  function advanceWave(leftover: number): boolean {
    spawnedInWave = 0;
    waveIndex += 1;
    if (waveIndex >= waves.length) {
      if (!loop) {
        waveIndex = waves.length;
        timeUntilNextSpawn = 0;
        return false;
      }
      loopCount += 1;
      waveIndex = 0;
    }
    const nextDelay = waves[waveIndex]?.delay ?? 0;
    timeUntilNextSpawn = nextDelay + leftover;
    return leftover < -EPSILON;
  }

  function update(delta: number): SpawnPayload<T>[] {
    assertNonNegative(delta, 'delta');
    const spawns: SpawnPayload<T>[] = [];

    if (waveIndex >= waves.length) {
      return spawns;
    }

    timeUntilNextSpawn -= delta;

    while (waveIndex < waves.length && timeUntilNextSpawn <= EPSILON) {
      const currentWave = waves[waveIndex];
      const leftover = timeUntilNextSpawn;
      spawnEntity(spawns, currentWave);

      if (spawnedInWave >= currentWave.count) {
        const carried = advanceWave(leftover);
        if (waveIndex >= waves.length || !carried) {
          timeUntilNextSpawn = Math.max(timeUntilNextSpawn, 0);
          break;
        }
      } else {
        const nextInterval = currentWave.interval ?? 0;
        timeUntilNextSpawn = nextInterval + leftover;
      }
    }

    if (timeUntilNextSpawn < 0 && waveIndex < waves.length) {
      // Avoid accumulating large negative drift when consuming multiple spawns in a single frame.
      timeUntilNextSpawn = Math.max(timeUntilNextSpawn, -EPSILON);
    }
    return spawns;
  }

  function spawnEntity(spawns: SpawnPayload<T>[], wave: WaveDefinition<T>): void {
    spawnedInWave += 1;
    spawns.push({
      waveIndex,
      entityIndex: spawnedInWave - 1,
      template: wave.template,
    });
  }

  function isFinished(): boolean {
    return !loop && waveIndex >= waves.length;
  }

  function reset(snapshot?: WaveSpawnerSnapshot): void {
    if (snapshot) {
      validateSnapshot(snapshot);
      setState(snapshot.waveIndex, snapshot.timeUntilNextSpawn, snapshot.spawnedInWave, snapshot.looped);
    } else {
      setState(0, waves[0]?.delay ?? 0, 0, 0);
    }
  }

  function toJSON(): WaveSpawnerSnapshot {
    return {
      waveIndex,
      timeUntilNextSpawn,
      spawnedInWave,
      looped: loopCount,
    };
  }

  function validateSnapshot(snapshot: WaveSpawnerSnapshot): void {
    if (!Number.isInteger(snapshot.waveIndex) || snapshot.waveIndex < 0 || snapshot.waveIndex > waves.length) {
      throw new Error('snapshot.waveIndex is out of range.');
    }
    assertNonNegative(snapshot.timeUntilNextSpawn, 'snapshot.timeUntilNextSpawn');
    if (!Number.isInteger(snapshot.spawnedInWave) || snapshot.spawnedInWave < 0) {
      throw new Error('snapshot.spawnedInWave must be a non-negative integer.');
    }
    if (!Number.isInteger(snapshot.looped) || snapshot.looped < 0) {
      throw new Error('snapshot.looped must be a non-negative integer.');
    }
    if (snapshot.waveIndex < waves.length) {
      const wave = waves[snapshot.waveIndex];
      if (snapshot.spawnedInWave > wave.count) {
        throw new Error('snapshot.spawnedInWave exceeds wave count.');
      }
    } else if (snapshot.waveIndex === waves.length && snapshot.spawnedInWave !== 0) {
      throw new Error('Completed snapshots must not track spawned entities.');
    }
  }

  return {
    update,
    isFinished,
    reset,
    toJSON,
  };
}
