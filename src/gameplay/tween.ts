export type TweenStatus = 'idle' | 'running' | 'completed';

export interface TweenOptions {
  /** Duration in seconds (> 0). */
  duration: number;
  /** Optional delay before starting in seconds (>= 0). */
  delay?: number;
  /** Starting value. */
  from: number;
  /** Target value. */
  to: number;
  /** Optional easing function mapping progress [0,1] -> [0,1]. */
  easing?: (t: number) => number;
  /** Optional onUpdate callback invoked every tick. */
  onUpdate?: (value: number, progress: number) => void;
  /** Optional onComplete callback when tween finishes. */
  onComplete?: () => void;
  /** Number of times to repeat the tween (0 = none). */
  repeat?: number;
  /** Whether to reverse direction after each repeat. */
  yoyo?: boolean;
}

export interface TweenController {
  update(delta: number): void;
  getValue(): number;
  getProgress(): number;
  getStatus(): TweenStatus;
  getElapsed(): number;
  play(): void;
  pause(): void;
  reset(): void;
  setSpeed(multiplier: number): void;
  isPlaying(): boolean;
}

export type TweenFactory = (options: TweenOptions) => TweenController;

export interface TweenSystemOptions {
  /** Speed multiplier applied to all tweens. Defaults to 1. */
  speed?: number;
}

export interface TweenSystem {
  create(options: TweenOptions): TweenController;
  update(delta: number): void;
  setGlobalSpeed(multiplier: number): void;
  getGlobalSpeed(): number;
  clear(): void;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function defaultEasing(t: number): number {
  return t;
}

interface InternalTween {
  options: Required<Omit<TweenOptions, 'repeat' | 'yoyo'>> & {
    repeat: number;
    yoyo: boolean;
  };
  value: number;
  direction: 1 | -1;
  elapsed: number;
  delayRemaining: number;
  status: TweenStatus;
  repeatsDone: number;
  playing: boolean;
  localSpeed: number;
}

function normalizeOptions(options: TweenOptions): InternalTween {
  assertFinite(options.duration, 'duration');
  if (options.duration <= 0) {
    throw new Error('duration must be greater than 0.');
  }
  const delay = options.delay ?? 0;
  assertFinite(delay, 'delay');
  if (delay < 0) {
    throw new Error('delay must be >= 0.');
  }
  assertFinite(options.from, 'from');
  assertFinite(options.to, 'to');

  const easing = options.easing ?? defaultEasing;
  if (typeof easing !== 'function') {
    throw new Error('easing must be a function.');
  }
  if (options.onUpdate && typeof options.onUpdate !== 'function') {
    throw new Error('onUpdate must be a function.');
  }
  if (options.onComplete && typeof options.onComplete !== 'function') {
    throw new Error('onComplete must be a function.');
  }
  const repeat = options.repeat ?? 0;
  assertFinite(repeat, 'repeat');
  if (!Number.isInteger(repeat) || repeat < 0) {
    throw new Error('repeat must be a non-negative integer.');
  }
  const yoyo = options.yoyo ?? false;

  return {
    options: {
      duration: options.duration,
      delay,
      from: options.from,
      to: options.to,
      easing,
      onUpdate: options.onUpdate ?? (() => {}),
      onComplete: options.onComplete ?? (() => {}),
      repeat,
      yoyo,
    },
    value: options.from,
    direction: 1,
    elapsed: 0,
    delayRemaining: delay,
    status: 'idle',
    repeatsDone: 0,
    playing: true,
    localSpeed: 1,
  };
}

function updateTween(tween: InternalTween, delta: number, globalSpeed: number): void {
  assertFinite(delta, 'delta');
  if (delta < 0) {
    throw new Error('delta must be >= 0.');
  }
  if (!tween.playing || tween.status === 'completed') {
    return;
  }

  const scaledDelta = delta * globalSpeed * tween.localSpeed;

  if (tween.delayRemaining > 0) {
    tween.delayRemaining -= scaledDelta;
    if (tween.delayRemaining > 0) {
      return;
    }
    tween.delayRemaining = 0;
  }

  const { duration, from, to, easing, onUpdate, onComplete, repeat, yoyo } = tween.options;
  if (tween.status === 'idle') {
    tween.status = 'running';
  }

  tween.elapsed += scaledDelta * tween.direction;
  let progress = tween.elapsed / duration;

  if (progress >= 1 || progress <= 0) {
    progress = clamp01(progress);
    tween.elapsed = progress * duration;
    const easedBoundary = easing(progress);
    tween.value = from + (to - from) * easedBoundary;
    onUpdate(tween.value, progress);

    if (yoyo && tween.direction === 1) {
      tween.direction = -1;
      tween.elapsed = duration;
      return;
    }
    if (yoyo && tween.direction === -1) {
      tween.direction = 1;
      tween.elapsed = 0;
      tween.repeatsDone += 1;
    }

    if (!yoyo) {
      tween.repeatsDone += 1;
    }

    if (tween.repeatsDone > repeat) {
      tween.status = 'completed';
      tween.playing = false;
      tween.value = to;
      onComplete();
      return;
    }

    tween.elapsed = yoyo ? (tween.direction === -1 ? duration : 0) : 0;
    const restartProgress = clamp01(tween.elapsed / duration);
    const easedRestart = easing(restartProgress);
    tween.value = from + (to - from) * easedRestart;
    onUpdate(tween.value, restartProgress);
    return;
  }

  progress = clamp01(progress);
  const eased = easing(progress);
  tween.value = from + (to - from) * eased;
  onUpdate(tween.value, progress);
}

function createTweenController(
  initial: InternalTween,
  registry: Set<InternalTween>,
  speedMultiplierRef: { value: number }
): TweenController {
  const tween = initial;

  return {
    update(delta: number) {
      updateTween(tween, delta, speedMultiplierRef.value);
      if (tween.status === 'completed') {
        registry.delete(tween);
      }
    },
    getValue() {
      return tween.value;
    },
    getProgress() {
      return clamp01(tween.elapsed / tween.options.duration);
    },
    getStatus() {
      return tween.status;
    },
    getElapsed() {
      const clamped = clamp01(tween.elapsed / tween.options.duration);
      return clamped * tween.options.duration;
    },
    play() {
      if (tween.status === 'completed') {
        return;
      }
      tween.playing = true;
    },
    pause() {
      tween.playing = false;
    },
    reset() {
      tween.elapsed = 0;
      tween.delayRemaining = tween.options.delay;
      tween.value = tween.options.from;
      tween.direction = 1;
      tween.repeatsDone = 0;
      tween.status = 'idle';
      tween.playing = true;
      registry.add(tween);
    },
    setSpeed(multiplier: number) {
      assertFinite(multiplier, 'speed');
      if (multiplier < 0) {
        throw new Error('speed must be >= 0.');
      }
      tween.localSpeed = multiplier;
    },
    isPlaying() {
      return tween.playing;
    },
  };
}

/**
 * Creates a tween factory for value interpolation with optional global speed control.
 * Useful for: UI animations, transitions, and gameplay feedback effects.
 */
export function createTweenSystem({ speed = 1 }: TweenSystemOptions = {}): TweenSystem {
  assertFinite(speed, 'speed');
  if (speed < 0) {
    throw new Error('speed must be >= 0.');
  }

  const activeTweens = new Set<InternalTween>();
  const speedMultiplierRef = { value: speed };

  function createTween(options: TweenOptions): TweenController {
    const tween = normalizeOptions(options);
    activeTweens.add(tween);
    const controller = createTweenController(tween, activeTweens, speedMultiplierRef);
    return controller;
  }

  function update(delta: number): void {
    assertFinite(delta, 'delta');
    if (delta < 0) {
      throw new Error('delta must be >= 0.');
    }

    const snapshot = Array.from(activeTweens);
    for (const tween of snapshot) {
      const previousStatus = tween.status;
      updateTween(tween, delta, speedMultiplierRef.value);
      if (tween.status === 'completed' && previousStatus !== 'completed') {
        activeTweens.delete(tween);
      }
    }
  }

  function setGlobalSpeed(multiplier: number): void {
    assertFinite(multiplier, 'speed');
    if (multiplier < 0) {
      throw new Error('speed must be >= 0.');
    }
    speedMultiplierRef.value = multiplier;
  }

  function clear(): void {
    activeTweens.clear();
  }

  return {
    create: createTween,
    update,
    setGlobalSpeed,
    getGlobalSpeed: () => speedMultiplierRef.value,
    clear,
  };
}

/** @internal */
export const __internals = {
  normalizeOptions,
  updateTween,
  clamp01,
};
