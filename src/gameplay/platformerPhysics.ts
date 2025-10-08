import type { Vector2D } from '../types.js';

export interface PlatformerCharacterState {
  position: Vector2D;
  velocity: Vector2D;
  onGround: boolean;
}

export interface PlatformerInput {
  move: number;
  jump: boolean;
}

export interface PlatformerUpdateOptions {
  delta: number;
  input: PlatformerInput;
  onGround: boolean;
}

export interface PlatformerPhysicsOptions {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  gravity: number;
  jumpVelocity: number;
  maxFallSpeed?: number;
  airControl?: number;
  coyoteTime?: number;
  jumpBufferTime?: number;
  jumpCutMultiplier?: number;
}

export interface PlatformerController {
  update(options: PlatformerUpdateOptions): PlatformerCharacterState;
  getState(): PlatformerCharacterState;
  reset(state?: Partial<PlatformerCharacterState>): void;
  setOptions(options: Partial<PlatformerPhysicsOptions>): void;
}

interface InternalOptions {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  gravity: number;
  jumpVelocity: number;
  maxFallSpeed: number;
  airControl: number;
  coyoteTime: number;
  jumpBufferTime: number;
  jumpCutMultiplier: number;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function normalizeOptions(options: PlatformerPhysicsOptions): InternalOptions {
  assertFinite(options.acceleration, 'acceleration');
  assertFinite(options.deceleration, 'deceleration');
  assertFinite(options.maxSpeed, 'maxSpeed');
  assertFinite(options.gravity, 'gravity');
  assertFinite(options.jumpVelocity, 'jumpVelocity');
  if (options.acceleration <= 0 || options.deceleration <= 0) {
    throw new Error('acceleration and deceleration must be greater than 0.');
  }
  if (options.maxSpeed <= 0) {
    throw new Error('maxSpeed must be greater than 0.');
  }
  if (options.jumpVelocity <= 0) {
    throw new Error('jumpVelocity must be greater than 0.');
  }

  const maxFallSpeedRaw = options.maxFallSpeed ?? Infinity;
  if (maxFallSpeedRaw !== Infinity) {
    assertFinite(maxFallSpeedRaw, 'maxFallSpeed');
    if (maxFallSpeedRaw <= 0) {
      throw new Error('maxFallSpeed must be greater than 0.');
    }
  }
  const maxFallSpeed = maxFallSpeedRaw;

  const airControl = options.airControl ?? 0.6;
  assertFinite(airControl, 'airControl');
  if (airControl < 0) {
    throw new Error('airControl must be >= 0.');
  }

  const coyoteTime = options.coyoteTime ?? 0.1;
  assertFinite(coyoteTime, 'coyoteTime');
  if (coyoteTime < 0) {
    throw new Error('coyoteTime must be >= 0.');
  }

  const jumpBufferTime = options.jumpBufferTime ?? 0.1;
  assertFinite(jumpBufferTime, 'jumpBufferTime');
  if (jumpBufferTime < 0) {
    throw new Error('jumpBufferTime must be >= 0.');
  }

  const jumpCutMultiplier = options.jumpCutMultiplier ?? 0.5;
  assertFinite(jumpCutMultiplier, 'jumpCutMultiplier');
  if (jumpCutMultiplier < 0 || jumpCutMultiplier > 1) {
    throw new Error('jumpCutMultiplier must be between 0 and 1.');
  }

  return {
    acceleration: options.acceleration,
    deceleration: options.deceleration,
    maxSpeed: options.maxSpeed,
    gravity: options.gravity,
    jumpVelocity: options.jumpVelocity,
    maxFallSpeed,
    airControl,
    coyoteTime,
    jumpBufferTime,
    jumpCutMultiplier,
  };
}

function cloneState(state: PlatformerCharacterState): PlatformerCharacterState {
  return {
    position: { x: state.position.x, y: state.position.y },
    velocity: { x: state.velocity.x, y: state.velocity.y },
    onGround: state.onGround,
  };
}

/**
 * Creates a platformer physics controller with gravity, coyote time, and jump buffering.
 * Useful for: responsive side-scroller characters with forgiving jump controls.
 */
export function createPlatformerController(
  options: PlatformerPhysicsOptions,
  initialState: PlatformerCharacterState = {
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    onGround: false,
  }
): PlatformerController {
  let config = normalizeOptions(options);
  const baseline = cloneState(initialState);
  const state: PlatformerCharacterState = cloneState(initialState);

  let coyoteTimer = state.onGround ? config.coyoteTime : 0;
  let jumpBufferTimer = 0;
  let previousJumpPressed = false;

  function setOptions(partial: Partial<PlatformerPhysicsOptions>): void {
    config = normalizeOptions({
      acceleration: partial.acceleration ?? config.acceleration,
      deceleration: partial.deceleration ?? config.deceleration,
      maxSpeed: partial.maxSpeed ?? config.maxSpeed,
      gravity: partial.gravity ?? config.gravity,
      jumpVelocity: partial.jumpVelocity ?? config.jumpVelocity,
      maxFallSpeed: partial.maxFallSpeed ?? config.maxFallSpeed,
      airControl: partial.airControl ?? config.airControl,
      coyoteTime: partial.coyoteTime ?? config.coyoteTime,
      jumpBufferTime: partial.jumpBufferTime ?? config.jumpBufferTime,
      jumpCutMultiplier: partial.jumpCutMultiplier ?? config.jumpCutMultiplier,
    });
  }

  function update({ delta, input, onGround }: PlatformerUpdateOptions): PlatformerCharacterState {
    assertFinite(delta, 'delta');
    if (delta < 0) {
      throw new Error('delta must be >= 0.');
    }
    if (!input) {
      throw new Error('input is required.');
    }

    const move = clamp(input.move ?? 0, -1, 1);
    const jumpPressed = Boolean(input.jump);
    const jumpPressedThisFrame = jumpPressed && !previousJumpPressed;
    const jumpReleasedThisFrame = !jumpPressed && previousJumpPressed;
    previousJumpPressed = jumpPressed;

    if (jumpPressedThisFrame) {
      jumpBufferTimer = config.jumpBufferTime;
    } else {
      jumpBufferTimer = Math.max(0, jumpBufferTimer - delta);
    }

    if (onGround) {
      coyoteTimer = config.coyoteTime;
      state.onGround = true;
    } else {
      coyoteTimer = Math.max(0, coyoteTimer - delta);
      state.onGround = false;
    }

    const airMultiplier = state.onGround ? 1 : config.airControl;
    const acceleration = config.acceleration * airMultiplier;
    const deceleration = config.deceleration * airMultiplier;

    const targetSpeed = move * config.maxSpeed;
    if (targetSpeed !== 0) {
      const speedDiff = targetSpeed - state.velocity.x;
      const direction = Math.sign(speedDiff);
      const amount = acceleration * delta;
      if (Math.abs(speedDiff) <= amount) {
        state.velocity.x = targetSpeed;
      } else {
        state.velocity.x += direction * amount;
      }
    } else if (state.velocity.x !== 0) {
      const direction = Math.sign(state.velocity.x);
      const amount = deceleration * delta;
      if (Math.abs(state.velocity.x) <= amount) {
        state.velocity.x = 0;
      } else {
        state.velocity.x -= direction * amount;
      }
    }

    const canJump = jumpBufferTimer > 0 && coyoteTimer > 0;
    if (canJump) {
      state.velocity.y = -config.jumpVelocity;
      state.onGround = false;
      coyoteTimer = 0;
      jumpBufferTimer = 0;
    }

    if (jumpReleasedThisFrame && state.velocity.y < 0) {
      state.velocity.y *= config.jumpCutMultiplier;
    }

    state.velocity.y += config.gravity * delta;
    if (state.velocity.y > config.maxFallSpeed) {
      state.velocity.y = config.maxFallSpeed;
    }

    state.position.x += state.velocity.x * delta;
    state.position.y += state.velocity.y * delta;

    return cloneState(state);
  }

  function getState(): PlatformerCharacterState {
    return cloneState(state);
  }

  function reset(partial: Partial<PlatformerCharacterState> = {}): void {
    const sourcePosition = partial.position ?? baseline.position;
    const sourceVelocity = partial.velocity ?? baseline.velocity;
    const sourceGround = partial.onGround ?? baseline.onGround;

    state.position.x = sourcePosition.x;
    state.position.y = sourcePosition.y;
    state.velocity.x = sourceVelocity.x;
    state.velocity.y = sourceVelocity.y;
    state.onGround = sourceGround;
    coyoteTimer = state.onGround ? config.coyoteTime : 0;
    jumpBufferTimer = 0;
    previousJumpPressed = false;
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
  clamp,
};
