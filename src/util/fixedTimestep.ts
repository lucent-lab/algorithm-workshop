export interface FixedTimestepOptions {
  /** Target fixed update step in seconds. */
  step: number;
  /** Maximum delta to avoid spiral of death (seconds). */
  maxDelta?: number;
  /** Callback invoked for each fixed update tick. */
  update: (context: { alpha: number; accumulator: number; elapsed: number }) => void;
  /** Callback invoked for rendering/interpolation with interpolation alpha. */
  render?: (context: { alpha: number; accumulator: number; elapsed: number }) => void;
}

export interface FixedTimestepLoop {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

/**
 * Creates a fixed timestep loop ideal for gameplay update ticks.
 * Useful for: deterministic game logic and interpolation between frames.
 */
export function createFixedTimestepLoop({
  step,
  maxDelta = step * 5,
  update,
  render,
}: FixedTimestepOptions): FixedTimestepLoop {
  if (step <= 0) {
    throw new Error('step must be greater than zero.');
  }
  if (typeof update !== 'function') {
    throw new Error('update callback is required.');
  }

  let running = false;
  let lastTime: number | undefined;
  let accumulator = 0;
  let frameId: number | undefined;

  const epsilon = step * 0.0001;

  function loop(timestamp: number) {
    if (!running) {
      return;
    }
    if (lastTime === undefined) {
      lastTime = timestamp;
    }

    let delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (delta > maxDelta) {
      delta = maxDelta;
    }

    accumulator += delta;

    while (accumulator + epsilon >= step) {
      accumulator -= step;
      update({ alpha: accumulator / step, accumulator, elapsed: step });
    }
    if (accumulator < 0) {
      accumulator = 0;
    }

    if (render) {
      render({ alpha: accumulator / step, accumulator, elapsed: delta });
    }

    frameId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) {
      return;
    }
    running = true;
    lastTime = undefined;
    accumulator = 0;
    frameId = requestAnimationFrame(loop);
  }

  function stop() {
    if (!running) {
      return;
    }
    running = false;
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }
  }

  function isRunning(): boolean {
    return running;
  }

  return { start, stop, isRunning };
}
