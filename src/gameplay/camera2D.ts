import type { Point, Rect } from '../types.js';

export interface CameraBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface CameraDeadzone {
  width: number;
  height: number;
}

export interface CameraShakeOptions {
  /** Total duration of the shake in seconds. */
  duration?: number;
  /** Maximum offset applied to the camera. */
  magnitude: number;
  /** Oscillation frequency in Hz. */
  frequency?: number;
}

export interface Camera2DOptions {
  viewportWidth: number;
  viewportHeight: number;
  position?: Point;
  bounds?: CameraBounds;
  deadzone?: CameraDeadzone;
  smoothing?: number;
  random?: () => number;
}

export interface CameraUpdateOptions {
  target: Point;
  /** Delta time in seconds. */
  delta: number;
}

export interface Camera2D {
  update(options: CameraUpdateOptions): Rect;
  getView(): Rect;
  getPosition(): Point;
  getCenter(): Point;
  setBounds(bounds?: CameraBounds): void;
  setDeadzone(deadzone?: CameraDeadzone): void;
  setSmoothing(value: number): void;
  applyShake(options: CameraShakeOptions): void;
  isShaking(): boolean;
  reset(position?: Point): void;
}

interface ShakeState {
  duration: number;
  magnitude: number;
  frequency: number;
  elapsed: number;
  phaseX: number;
  phaseY: number;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertPoint(point: Point, label: string): void {
  assertFinite(point.x, `${label}.x`);
  assertFinite(point.y, `${label}.y`);
}

function normalizeSmoothing(value: number | undefined): number {
  if (value === undefined) {
    return 0.2;
  }
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error('smoothing must be a finite number.');
  }
  return clamp(value, 0, 1);
}

function normalizeDeadzone(deadzone: CameraDeadzone | undefined, viewportWidth: number, viewportHeight: number): CameraDeadzone {
  if (!deadzone) {
    return { width: 0, height: 0 };
  }
  assertFinite(deadzone.width, 'deadzone.width');
  assertFinite(deadzone.height, 'deadzone.height');
  const width = clamp(deadzone.width, 0, viewportWidth);
  const height = clamp(deadzone.height, 0, viewportHeight);
  return { width, height };
}

function validateBounds(bounds: CameraBounds): CameraBounds {
  assertFinite(bounds.minX, 'bounds.minX');
  assertFinite(bounds.maxX, 'bounds.maxX');
  assertFinite(bounds.minY, 'bounds.minY');
  assertFinite(bounds.maxY, 'bounds.maxY');
  if (bounds.minX > bounds.maxX || bounds.minY > bounds.maxY) {
    throw new Error('bounds min values must be <= max values.');
  }
  return {
    minX: bounds.minX,
    maxX: bounds.maxX,
    minY: bounds.minY,
    maxY: bounds.maxY,
  };
}

function resolveBoundsClamp(value: number, min: number, max: number, size: number): number {
  const maxPos = max - size;
  if (maxPos < min) {
    return (min + max - size) / 2;
  }
  return clamp(value, min, maxPos);
}

function computeSmoothingFactor(base: number, delta: number): number {
  if (base <= 0) {
    return 1;
  }
  if (base >= 1) {
    return 1;
  }
  const clampedDelta = Math.max(delta, 0);
  const factor = 1 - Math.pow(1 - base, clampedDelta * 60);
  return clamp(factor, 0, 1);
}

function createShakeState(options: CameraShakeOptions, random: () => number): ShakeState {
  const duration = options.duration ?? 0.4;
  const frequency = options.frequency ?? 18;
  if (duration <= 0) {
    throw new Error('shake duration must be greater than zero.');
  }
  if (options.magnitude <= 0) {
    throw new Error('shake magnitude must be greater than zero.');
  }
  if (frequency <= 0) {
    throw new Error('shake frequency must be greater than zero.');
  }
  return {
    duration,
    frequency,
    magnitude: options.magnitude,
    elapsed: 0,
    phaseX: random() * Math.PI * 2,
    phaseY: random() * Math.PI * 2,
  };
}

function updateShakes(shakes: ShakeState[], delta: number): Point {
  let offsetX = 0;
  let offsetY = 0;
  for (let i = shakes.length - 1; i >= 0; i -= 1) {
    const shake = shakes[i];
    shake.elapsed += delta;
    if (shake.elapsed >= shake.duration) {
      shakes.splice(i, 1);
      continue;
    }
    const progress = shake.elapsed / shake.duration;
    const damping = 1 - progress;
    const angle = shake.phaseX + shake.elapsed * shake.frequency * Math.PI * 2;
    const secondary = shake.phaseY + shake.elapsed * (shake.frequency * 0.9) * Math.PI * 2;
    offsetX += Math.cos(angle) * shake.magnitude * damping;
    offsetY += Math.sin(secondary) * shake.magnitude * damping;
  }
  return { x: offsetX, y: offsetY };
}

/**
 * Creates a 2D camera system supporting smooth follow, dead zones, and screen shake.
 * Useful for: side-scrollers, top-down games, and cinematic camera control.
 */
export function createCamera2D(options: Camera2DOptions): Camera2D {
  const {
    viewportWidth,
    viewportHeight,
    position,
    bounds,
    deadzone,
    smoothing,
    random = Math.random,
  } = options;

  assertFinite(viewportWidth, 'viewportWidth');
  assertFinite(viewportHeight, 'viewportHeight');
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    throw new Error('viewport dimensions must be greater than zero.');
  }
  if (typeof random !== 'function') {
    throw new Error('random must be a function.');
  }

  const viewport = { width: viewportWidth, height: viewportHeight };
  let current = {
    x: position?.x ?? 0,
    y: position?.y ?? 0,
  };
  let currentView: Rect = { x: current.x, y: current.y, width: viewport.width, height: viewport.height };
  let smoothingBase = normalizeSmoothing(smoothing);
  let currentDeadzone = normalizeDeadzone(deadzone, viewport.width, viewport.height);
  let currentBounds = bounds ? validateBounds(bounds) : undefined;
  const shakes: ShakeState[] = [];

  function clampPosition(pos: Point): Point {
    if (!currentBounds) {
      return pos;
    }
    return {
      x: resolveBoundsClamp(pos.x, currentBounds.minX, currentBounds.maxX, viewport.width),
      y: resolveBoundsClamp(pos.y, currentBounds.minY, currentBounds.maxY, viewport.height),
    };
  }

  function update(options: CameraUpdateOptions): Rect {
    assertPoint(options.target, 'target');
    assertFinite(options.delta, 'delta');

    let desiredX = current.x;
    let desiredY = current.y;

    const zoneWidth = currentDeadzone.width;
    const zoneHeight = currentDeadzone.height;
    const zoneLeft = current.x + (viewport.width - zoneWidth) / 2;
    const zoneRight = zoneLeft + zoneWidth;
    const zoneTop = current.y + (viewport.height - zoneHeight) / 2;
    const zoneBottom = zoneTop + zoneHeight;

    if (options.target.x < zoneLeft) {
      desiredX -= zoneLeft - options.target.x;
    } else if (options.target.x > zoneRight) {
      desiredX += options.target.x - zoneRight;
    }

    if (options.target.y < zoneTop) {
      desiredY -= zoneTop - options.target.y;
    } else if (options.target.y > zoneBottom) {
      desiredY += options.target.y - zoneBottom;
    }

    const clamped = clampPosition({ x: desiredX, y: desiredY });
    const factor = computeSmoothingFactor(smoothingBase, options.delta);
    current.x += (clamped.x - current.x) * factor;
    current.y += (clamped.y - current.y) * factor;

    const shakeOffset = updateShakes(shakes, options.delta);
    currentView = {
      x: current.x + shakeOffset.x,
      y: current.y + shakeOffset.y,
      width: viewport.width,
      height: viewport.height,
    };
    return currentView;
  }

  function getView(): Rect {
    return { ...currentView };
  }

  function getPosition(): Point {
    return { x: current.x, y: current.y };
  }

  function getCenter(): Point {
    return {
      x: currentView.x + currentView.width / 2,
      y: currentView.y + currentView.height / 2,
    };
  }

  function setBounds(bounds?: CameraBounds): void {
    currentBounds = bounds ? validateBounds(bounds) : undefined;
    const clamped = clampPosition(current);
    current.x = clamped.x;
    current.y = clamped.y;
    currentView = { x: current.x, y: current.y, width: viewport.width, height: viewport.height };
  }

  function setDeadzone(deadzone?: CameraDeadzone): void {
    currentDeadzone = normalizeDeadzone(deadzone, viewport.width, viewport.height);
  }

  function setSmoothing(value: number): void {
    smoothingBase = normalizeSmoothing(value);
  }

  function applyShake(options: CameraShakeOptions): void {
    shakes.push(createShakeState(options, () => {
      const r = random();
      if (typeof r !== 'number' || Number.isNaN(r) || !Number.isFinite(r)) {
        throw new Error('random() must return a finite number.');
      }
      return r;
    }));
  }

  function isShaking(): boolean {
    return shakes.length > 0;
  }

  function reset(position?: Point): void {
    if (position) {
      assertPoint(position, 'position');
      current = clampPosition({ x: position.x, y: position.y });
    }
    shakes.length = 0;
    currentView = { x: current.x, y: current.y, width: viewport.width, height: viewport.height };
  }

  return {
    update,
    getView,
    getPosition,
    getCenter,
    setBounds,
    setDeadzone,
    setSmoothing,
    applyShake,
    isShaking,
    reset,
  };
}

/** @internal */
export const __internals = {
  clamp,
  normalizeSmoothing,
  normalizeDeadzone,
  validateBounds,
  resolveBoundsClamp,
  computeSmoothingFactor,
  updateShakes,
};
