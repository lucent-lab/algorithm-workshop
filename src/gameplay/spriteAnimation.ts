export type SpritePlaybackMode = 'loop' | 'once' | 'ping-pong';

export interface SpriteFrame<T = number> {
  /** Arbitrary frame payload (texture index, UV id, etc.). */
  frame: T;
  /** Duration of the frame in seconds (> 0). */
  duration: number;
  /** Optional events fired when this frame becomes active. */
  events?: ReadonlyArray<string>;
}

export interface SpriteAnimationOptions<T = number> {
  frames: ReadonlyArray<SpriteFrame<T>>;
  /** Playback mode, defaults to 'loop'. */
  mode?: SpritePlaybackMode;
  /** Playback speed multiplier, defaults to 1. */
  speed?: number;
  /** Whether playback starts immediately, defaults to true. */
  playOnStart?: boolean;
  /** Optional starting frame index. */
  startFrame?: number;
}

export interface SpriteAnimationEvent<T = number> {
  type: string;
  frame: SpriteFrame<T>;
  frameIndex: number;
  loopCount: number;
}

export interface SpriteAnimationController<T = number> {
  update(delta: number): void;
  getFrame(): SpriteFrame<T>;
  getFrameIndex(): number;
  getFrameTime(): number;
  getProgress(): number;
  getLoopCount(): number;
  isPlaying(): boolean;
  isFinished(): boolean;
  play(): void;
  pause(): void;
  reset(frameIndex?: number): void;
  setSpeed(speed: number): void;
  setMode(mode: SpritePlaybackMode): void;
  on(event: string, handler: (event: SpriteAnimationEvent<T>) => void): () => void;
}

interface InternalFrame<T> extends SpriteFrame<T> {
  events?: string[];
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function normalizeFrames<T>(frames: ReadonlyArray<SpriteFrame<T>>): InternalFrame<T>[] {
  if (!frames || frames.length === 0) {
    throw new Error('frames array must contain at least one frame.');
  }
  return frames.map((frame, index) => {
    if (!frame) {
      throw new Error(`frames[${index}] is undefined.`);
    }
    assertFinite(frame.duration, `frames[${index}].duration`);
    if (frame.duration <= 0) {
      throw new Error(`frames[${index}].duration must be > 0.`);
    }
    return {
      frame: frame.frame,
      duration: frame.duration,
      events: frame.events ? [...frame.events] : undefined,
    };
  });
}

function clampIndex(index: number, length: number): number {
  if (!Number.isInteger(index)) {
    throw new Error('frameIndex must be an integer.');
  }
  if (index < 0) {
    return 0;
  }
  if (index >= length) {
    return length - 1;
  }
  return index;
}

function assertMode(mode: SpritePlaybackMode): void {
  if (mode !== 'loop' && mode !== 'once' && mode !== 'ping-pong') {
    throw new Error('mode must be loop, once, or ping-pong.');
  }
}

/**
 * Creates a sprite animation controller with frame timing and events.
 * Useful for: sprite sheets, UI animations, and timeline-based effects.
 */
export function createSpriteAnimation<T>({
  frames: rawFrames,
  mode = 'loop',
  speed = 1,
  playOnStart = true,
  startFrame = 0,
}: SpriteAnimationOptions<T>): SpriteAnimationController<T> {
  const frames = normalizeFrames(rawFrames);
  assertMode(mode);
  assertFinite(speed, 'speed');
  if (speed < 0) {
    throw new Error('speed must be >= 0.');
  }
  assertFinite(startFrame, 'startFrame');

  let playbackMode: SpritePlaybackMode = mode;
  let playbackSpeed = speed;
  const listeners = new Map<string, Set<(event: SpriteAnimationEvent<T>) => void>>();

  let currentIndex = clampIndex(Math.trunc(startFrame), frames.length);
  let timeInFrame = 0;
  let playing = playOnStart;
  let finished = false;
  let direction = 1;
  let loopCount = 0;

  function emit(type: string): void {
    const frame = frames[currentIndex];
    const handlers = listeners.get(type);
    if (!handlers || handlers.size === 0) {
      return;
    }
    const event: SpriteAnimationEvent<T> = {
      type,
      frame,
      frameIndex: currentIndex,
      loopCount,
    };
    handlers.forEach((handler) => handler(event));
  }

  function emitFrameEvents(): void {
    emit('frame-enter');
    const frameEvents = frames[currentIndex].events;
    if (frameEvents) {
      frameEvents.forEach((name) => emit(name));
    }
  }

  function goToFrame(index: number, emitEvents: boolean): void {
    currentIndex = clampIndex(index, frames.length);
    timeInFrame = 0;
    if (emitEvents) {
      emitFrameEvents();
    }
  }

  function advanceFrame(): void {
    if (frames.length === 1) {
      if (playbackMode === 'loop' || playbackMode === 'ping-pong') {
        loopCount += 1;
        emit('loop');
      } else {
        finished = true;
        playing = false;
        emit('complete');
      }
      return;
    }

    if (playbackMode === 'loop') {
      currentIndex += 1;
      if (currentIndex >= frames.length) {
        currentIndex = 0;
        loopCount += 1;
        emit('loop');
      }
      timeInFrame = 0;
      emitFrameEvents();
      return;
    }

    if (playbackMode === 'once') {
      if (currentIndex >= frames.length - 1) {
        finished = true;
        playing = false;
        timeInFrame = frames[currentIndex].duration;
        emit('complete');
        return;
      }
      currentIndex += 1;
      timeInFrame = 0;
      emitFrameEvents();
      return;
    }

    // ping-pong
    let nextIndex = currentIndex + direction;
    if (nextIndex >= frames.length || nextIndex < 0) {
      direction *= -1;
      loopCount += 1;
      emit('loop');
      nextIndex = currentIndex + direction;
    }
    currentIndex = clampIndex(nextIndex, frames.length);
    timeInFrame = 0;
    emitFrameEvents();
  }

  function update(delta: number): void {
    assertFinite(delta, 'delta');
    if (delta < 0) {
      throw new Error('delta must be >= 0.');
    }
    if (!playing || finished || playbackSpeed === 0) {
      return;
    }
    let remaining = delta * playbackSpeed;
    while (remaining > 0 && playing && !finished) {
      const currentFrame = frames[currentIndex];
      const timeRemaining = currentFrame.duration - timeInFrame;
      if (remaining < timeRemaining) {
        timeInFrame += remaining;
        remaining = 0;
        break;
      }

      remaining -= timeRemaining;
      timeInFrame = currentFrame.duration;
      advanceFrame();
      if (!playing || finished) {
        break;
      }
    }
  }

  function on(event: string, handler: (event: SpriteAnimationEvent<T>) => void): () => void {
    if (typeof event !== 'string' || event.length === 0) {
      throw new Error('event name must be a non-empty string.');
    }
    if (typeof handler !== 'function') {
      throw new Error('handler must be a function.');
    }
    let handlers = listeners.get(event);
    if (!handlers) {
      handlers = new Set();
      listeners.set(event, handlers);
    }
    handlers.add(handler);
    return () => {
      handlers?.delete(handler);
      if (handlers && handlers.size === 0) {
        listeners.delete(event);
      }
    };
  }

  function play(): void {
    if (!finished) {
      playing = true;
    }
  }

  function pause(): void {
    playing = false;
  }

  function reset(frameIndex = 0): void {
    const wasPlaying = playing;
    currentIndex = clampIndex(frameIndex, frames.length);
    timeInFrame = 0;
    finished = false;
    loopCount = 0;
    direction = 1;
    emitFrameEvents();
    playing = wasPlaying;
  }

  function setSpeed(speedValue: number): void {
    assertFinite(speedValue, 'speed');
    if (speedValue < 0) {
      throw new Error('speed must be >= 0.');
    }
    playbackSpeed = speedValue;
  }

  function setMode(newMode: SpritePlaybackMode): void {
    assertMode(newMode);
    if (playbackMode === newMode) {
      return;
    }
    playbackMode = newMode;
    finished = false;
    loopCount = 0;
    direction = 1;
  }

  goToFrame(currentIndex, false);
  emitFrameEvents();
  playing = playOnStart;

  return {
    update,
    getFrame: () => frames[currentIndex],
    getFrameIndex: () => currentIndex,
    getFrameTime: () => timeInFrame,
    getProgress: () => (frames[currentIndex].duration === 0 ? 0 : timeInFrame / frames[currentIndex].duration),
    getLoopCount: () => loopCount,
    isPlaying: () => playing,
    isFinished: () => finished,
    play,
    pause,
    reset,
    setSpeed,
    setMode,
    on,
  };
}

/** @internal */
export const __internals = {
  normalizeFrames,
  clampIndex,
  assertMode,
};
