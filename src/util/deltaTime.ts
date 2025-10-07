/**
 * Configuration options for {@link createDeltaTimeManager}.
 * Useful for: bounding large frame spikes and smoothing jitter.
 */
export interface DeltaTimeOptions {
  /** Maximum delta in seconds, defaults to 1/10 (100 ms). */
  maxDelta?: number;
  /** Number of samples to smooth, defaults to 1 (no smoothing). */
  smoothing?: number;
}

/**
 * Runtime interface returned by {@link createDeltaTimeManager}.
 * Useful for: polling delta inside fixed or variable timestep loops.
 */
export interface DeltaTimeManager {
  /** Updates the manager with the latest timestamp (ms) and returns smoothed delta (seconds). */
  update(timestamp: number): number;
  /** Returns the most recent smoothed delta (seconds). */
  getDelta(): number;
  /** Resets internal state and clears accumulated samples. */
  reset(): void;
}

/**
 * Creates a delta-time manager for animation/gameplay loops.
 * Useful for: smoothing frame time, clamping spikes, and driving interpolation factors.
 *
 * @example
 * ```ts
 * const manager = createDeltaTimeManager({ maxDelta: 0.05, smoothing: 4 });
 * const delta = manager.update(performance.now());
 * ```
 */
export function createDeltaTimeManager({
  maxDelta = 0.1,
  smoothing = 1,
}: DeltaTimeOptions = {}): DeltaTimeManager {
  if (typeof maxDelta !== 'number' || Number.isNaN(maxDelta) || !Number.isFinite(maxDelta)) {
    throw new Error('maxDelta must be a finite number.');
  }
  if (maxDelta <= 0) {
    throw new Error('maxDelta must be greater than zero.');
  }
  if (typeof smoothing !== 'number' || Number.isNaN(smoothing) || smoothing < 1) {
    throw new Error('smoothing must be a number >= 1.');
  }
  if (!Number.isInteger(smoothing)) {
    throw new Error('smoothing must be an integer.');
  }

  let lastTimestamp: number | undefined;
  const samples: number[] = [];
  let currentDelta = 0;

  function update(timestamp: number): number {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp) || !Number.isFinite(timestamp)) {
      throw new Error('timestamp must be a finite number.');
    }

    if (lastTimestamp === undefined) {
      lastTimestamp = timestamp;
      currentDelta = 0;
      return currentDelta;
    }

    let delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (delta > maxDelta) {
      delta = maxDelta;
    } else if (delta < 0) {
      delta = 0;
    }

    samples.push(delta);
    if (samples.length > smoothing) {
      samples.shift();
    }

    currentDelta = samples.reduce((sum, value) => sum + value, 0) / samples.length;
    return currentDelta;
  }

  function getDelta(): number {
    return currentDelta;
  }

  function reset(): void {
    lastTimestamp = undefined;
    samples.length = 0;
    currentDelta = 0;
  }

  return { update, getDelta, reset };
}
