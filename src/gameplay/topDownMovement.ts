import type { Vector2D } from '../types.js';

export interface TopDownState {
  position: Vector2D;
  velocity: Vector2D;
  facing: Vector2D;
}

export interface TopDownInput {
  x: number;
  y: number;
}

export interface TopDownUpdateOptions {
  delta: number;
  input: TopDownInput;
}

export interface TopDownMovementOptions {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  drag?: number;
  normalizeDiagonal?: boolean;
}

export interface TopDownController {
  update(options: TopDownUpdateOptions): TopDownState;
  getState(): TopDownState;
  reset(state?: Partial<TopDownState>): void;
  setOptions(options: Partial<TopDownMovementOptions>): void;
}

interface InternalOptions {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  drag: number;
  normalizeDiagonal: boolean;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function normalizeOptions(options: TopDownMovementOptions): InternalOptions {
  assertFinite(options.acceleration, 'acceleration');
  assertFinite(options.deceleration, 'deceleration');
  assertFinite(options.maxSpeed, 'maxSpeed');
  if (options.acceleration <= 0 || options.deceleration <= 0) {
    throw new Error('acceleration and deceleration must be greater than 0.');
  }
  if (options.maxSpeed <= 0) {
    throw new Error('maxSpeed must be greater than 0.');
  }
  const drag = options.drag ?? 0;
  assertFinite(drag, 'drag');
  if (drag < 0) {
    throw new Error('drag must be >= 0.');
  }
  const normalizeDiagonal = options.normalizeDiagonal ?? true;

  return {
    acceleration: options.acceleration,
    deceleration: options.deceleration,
    maxSpeed: options.maxSpeed,
    drag,
    normalizeDiagonal,
  };
}

function cloneState(state: TopDownState): TopDownState {
  return {
    position: { x: state.position.x, y: state.position.y },
    velocity: { x: state.velocity.x, y: state.velocity.y },
    facing: { x: state.facing.x, y: state.facing.y },
  };
}

function magnitude(x: number, y: number): number {
  return Math.hypot(x, y);
}

function normalize(x: number, y: number): Vector2D {
  const length = magnitude(x, y);
  if (length === 0) {
    return { x: 0, y: 0 };
  }
  return { x: x / length, y: y / length };
}

/**
 * Creates a top-down movement controller with acceleration and directional damping.
 * Useful for: twin-stick or tile-based characters needing eight-direction movement.
 */
export function createTopDownController(
  options: TopDownMovementOptions,
  initialState: TopDownState = {
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    facing: { x: 1, y: 0 },
  }
): TopDownController {
  let config = normalizeOptions(options);
  const baseline = cloneState(initialState);
  const state: TopDownState = cloneState(initialState);

  function setOptions(partial: Partial<TopDownMovementOptions>): void {
    config = normalizeOptions({
      acceleration: partial.acceleration ?? config.acceleration,
      deceleration: partial.deceleration ?? config.deceleration,
      maxSpeed: partial.maxSpeed ?? config.maxSpeed,
      drag: partial.drag ?? config.drag,
      normalizeDiagonal: partial.normalizeDiagonal ?? config.normalizeDiagonal,
    });
  }

  function update({ delta, input }: TopDownUpdateOptions): TopDownState {
    assertFinite(delta, 'delta');
    if (delta < 0) {
      throw new Error('delta must be >= 0.');
    }
    if (!input) {
      throw new Error('input is required.');
    }

    let moveX = input.x ?? 0;
    let moveY = input.y ?? 0;
    if (!Number.isFinite(moveX) || !Number.isFinite(moveY)) {
      throw new Error('input values must be finite numbers.');
    }

    if (config.normalizeDiagonal) {
      const magnitudeInput = magnitude(moveX, moveY);
      if (magnitudeInput > 1) {
        moveX /= magnitudeInput;
        moveY /= magnitudeInput;
      }
    }

    const hasInput = Math.abs(moveX) > 1e-3 || Math.abs(moveY) > 1e-3;

    if (hasInput) {
      const direction = normalize(moveX, moveY);
      state.velocity.x += direction.x * config.acceleration * delta;
      state.velocity.y += direction.y * config.acceleration * delta;

      const speed = magnitude(state.velocity.x, state.velocity.y);
      if (speed > config.maxSpeed) {
        const normalized = normalize(state.velocity.x, state.velocity.y);
        state.velocity.x = normalized.x * config.maxSpeed;
        state.velocity.y = normalized.y * config.maxSpeed;
      }

      state.facing.x = direction.x;
      state.facing.y = direction.y;
    } else {
      const speed = magnitude(state.velocity.x, state.velocity.y);
      if (speed > 0) {
        const decelAmount = config.deceleration * delta;
        if (speed <= decelAmount) {
          state.velocity.x = 0;
          state.velocity.y = 0;
        } else {
          const normalized = normalize(state.velocity.x, state.velocity.y);
          const newSpeed = speed - decelAmount;
          state.velocity.x = normalized.x * newSpeed;
          state.velocity.y = normalized.y * newSpeed;
        }
      }
    }

    if (config.drag > 0) {
      const dragFactor = Math.max(0, 1 - config.drag * delta);
      state.velocity.x *= dragFactor;
      state.velocity.y *= dragFactor;
    }

    state.position.x += state.velocity.x * delta;
    state.position.y += state.velocity.y * delta;

    return cloneState(state);
  }

  function getState(): TopDownState {
    return cloneState(state);
  }

  function reset(partial: Partial<TopDownState> = {}): void {
    const position = partial.position ?? baseline.position;
    const velocity = partial.velocity ?? baseline.velocity;
    const facing = partial.facing ?? baseline.facing;

    state.position.x = position.x;
    state.position.y = position.y;
    state.velocity.x = velocity.x;
    state.velocity.y = velocity.y;
    state.facing.x = facing.x;
    state.facing.y = facing.y;
  }

  return {
    update,
    getState,
    reset,
    setOptions,
  };
}

/** @internal */
export const __internals = {
  normalizeOptions,
  normalize,
  magnitude,
};
