type TransitionPhase = 'idle' | 'in' | 'hold' | 'out' | 'completed';

export interface ScreenTransitionOptions {
  durationIn: number;
  durationOut: number;
  hold?: number;
  easingIn?: (t: number) => number;
  easingOut?: (t: number) => number;
}

export interface ScreenTransitionState {
  phase: TransitionPhase;
  progress: number;
  value: number;
  elapsed: number;
  totalDuration: number;
}

export interface ScreenTransitionController {
  start(): void;
  update(delta: number): ScreenTransitionState;
  getState(): ScreenTransitionState;
  reset(): void;
  isActive(): boolean;
  isCompleted(): boolean;
}

export function createScreenTransition(options: ScreenTransitionOptions): ScreenTransitionController {
  validateOptions(options);
  const hold = options.hold ?? 0;
  const totalDuration = options.durationIn + hold + options.durationOut;
  let phase: TransitionPhase = 'idle';
  let elapsedPhase = 0;
  let elapsedTotal = 0;
  let state: ScreenTransitionState = {
    phase,
    progress: 0,
    value: 0,
    elapsed: 0,
    totalDuration,
  };

  function start(): void {
    phase = 'in';
    elapsedPhase = 0;
    elapsedTotal = 0;
    updateState(0);
  }

  function reset(): void {
    phase = 'idle';
    elapsedPhase = 0;
    elapsedTotal = 0;
    updateState(0);
  }

  function update(delta: number): ScreenTransitionState {
    assertNonNegative(delta, 'delta');
    if (phase === 'idle' || phase === 'completed') {
      return state;
    }

    let remaining = delta;
    while (remaining > 0 && phase !== 'completed') {
      const duration = getPhaseDuration(phase, options, hold);
      const timeLeft = duration - elapsedPhase;
      const step = Math.min(remaining, Math.max(timeLeft, 0));
      elapsedPhase += step;
      elapsedTotal += step;
      remaining -= step;

      if (phase === 'in') {
        const progress = duration === 0 ? 1 : clamp(elapsedPhase / duration);
        updateState(progress, options.easingIn ?? easeLinear);
        if (elapsedPhase >= duration) {
          phase = hold > 0 ? 'hold' : 'out';
          elapsedPhase = 0;
          if (phase === 'hold') {
            updateState(1);
          }
        }
      } else if (phase === 'hold') {
        updateState(1);
        if (elapsedPhase >= duration) {
          phase = 'out';
          elapsedPhase = 0;
          updateState(1, options.easingOut ?? easeReverseLinear);
        }
      } else if (phase === 'out') {
        const progress = duration === 0 ? 1 : clamp(elapsedPhase / duration);
        updateState(1 - progress, options.easingOut ?? easeReverseLinear);
        if (elapsedPhase >= duration) {
          phase = 'completed';
          updateState(0);
        }
      }

      if (timeLeft <= 0 && step === 0) {
        // Avoid infinite loops if duration is zero.
        break;
      }
    }

    return state;
  }

  function getPhaseDuration(current: TransitionPhase, cfg: ScreenTransitionOptions, holdDuration: number): number {
    switch (current) {
      case 'in':
        return cfg.durationIn;
      case 'hold':
        return holdDuration;
      case 'out':
        return cfg.durationOut;
      default:
        return 0;
    }
  }

  function updateState(progress: number, easing?: (t: number) => number): void {
    const value = easing ? easing(clamp(progress)) : clamp(progress);
    state = {
      phase,
      progress: clamp(progress),
      value,
      elapsed: elapsedTotal,
      totalDuration,
    };
  }

  return {
    start,
    update,
    getState: () => state,
    reset,
    isActive: () => phase !== 'idle' && phase !== 'completed',
    isCompleted: () => phase === 'completed',
  };
}

export interface FadeResult {
  opacity: number;
}

export function computeFade(state: ScreenTransitionState): FadeResult {
  return { opacity: clamp(state.value) };
}

export interface WipeResult {
  offset: number;
  direction: 'left' | 'right';
}

export function computeHorizontalWipe(state: ScreenTransitionState, direction: 'left' | 'right' = 'left'): WipeResult {
  const progress = direction === 'left' ? 1 - state.value : state.value;
  return { offset: clamp(progress), direction };
}

export interface LetterboxResult {
  barSize: number;
}

export function computeLetterbox(state: ScreenTransitionState, maxBar: number): LetterboxResult {
  assertNonNegative(maxBar, 'maxBar');
  return { barSize: clamp(state.value) * maxBar };
}

function validateOptions(options: ScreenTransitionOptions): void {
  assertPositive(options.durationIn, 'durationIn');
  assertPositive(options.durationOut, 'durationOut');
  if (options.hold !== undefined) {
    assertNonNegative(options.hold, 'hold');
  }
}

function easeLinear(t: number): number {
  return clamp(t);
}

function easeReverseLinear(t: number): number {
  return clamp(t);
}

function clamp(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 1;
  }
  return value;
}

function assertPositive(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
}

function assertNonNegative(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a non-negative number.`);
  }
}
