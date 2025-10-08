import type { Point, Vector2D } from '../types.js';

export interface RangeOptions {
  min: number;
  max: number;
}

export interface ParticleEmitterOptions {
  /** Particles spawned per second. */
  rate?: number;
  /** Emitter origin for new particles. */
  position?: Point;
  /** Lifetime range in seconds for each particle. */
  life: RangeOptions;
  /** Initial speed magnitude range. */
  speed?: RangeOptions;
  /** Emission angle range in radians. */
  angle?: RangeOptions;
  /** Initial particle size range. */
  size?: RangeOptions;
  /** Constant acceleration applied each update (e.g., gravity). */
  acceleration?: Vector2D;
}

export interface ParticleSystemOptions {
  emitter: ParticleEmitterOptions;
  /** Maximum particles retained in the system at once. Defaults to 500. */
  maxParticles?: number;
  /** Deterministic random function override (0-1 range). */
  random?: () => number;
}

export interface Particle {
  position: Point;
  velocity: Vector2D;
  age: number;
  life: number;
  size: number;
}

export interface ParticleSystem {
  update(delta: number): void;
  burst(count: number): void;
  getParticles(): readonly Particle[];
  setEmitter(options: Partial<ParticleEmitterOptions>): void;
  setPosition(position: Point): void;
  reset(): void;
}

interface NormalizedRange {
  min: number;
  max: number;
}

interface InternalParticle extends Particle {}

interface EmitterState {
  position: Point;
  rate: number;
  life: NormalizedRange;
  speed: NormalizedRange;
  angle: NormalizedRange;
  size: NormalizedRange;
  acceleration: Vector2D;
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

function normalizeRange(
  range: RangeOptions,
  label: string,
  constraints: { minValue?: number; inclusive?: boolean } = {}
): NormalizedRange {
  assertFinite(range.min, `${label}.min`);
  assertFinite(range.max, `${label}.max`);
  if (range.min > range.max) {
    throw new Error(`${label}.min must be <= ${label}.max.`);
  }

  if (Object.prototype.hasOwnProperty.call(constraints, 'minValue')) {
    const { minValue = 0, inclusive = false } = constraints;
    if (inclusive) {
      if (range.min < minValue || range.max < minValue) {
        throw new Error(`${label} values must be >= ${minValue}.`);
      }
    } else if (range.min <= minValue || range.max <= minValue) {
      throw new Error(`${label} values must be > ${minValue}.`);
    }
  }

  return { min: range.min, max: range.max };
}

function sampleRange(range: NormalizedRange, random: () => number): number {
  const span = range.max - range.min;
  if (span <= 0) {
    return range.min;
  }
  const value = random();
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error('random() must return a finite number.');
  }
  return range.min + value * span;
}

function normalizeEmitter(options: ParticleEmitterOptions): EmitterState {
  const position = options.position ?? { x: 0, y: 0 };
  assertPoint(position, 'emitter.position');

  const rate = options.rate ?? 0;
  assertFinite(rate, 'emitter.rate');
  if (rate < 0) {
    throw new Error('emitter.rate must be >= 0.');
  }

  const life = normalizeRange(options.life, 'emitter.life', { minValue: 0, inclusive: false });
  const speed = options.speed
    ? normalizeRange(options.speed, 'emitter.speed', { minValue: 0, inclusive: true })
    : { min: 0, max: 0 };
  const angle = options.angle ? normalizeRange(options.angle, 'emitter.angle') : { min: 0, max: Math.PI * 2 };
  const size = options.size
    ? normalizeRange(options.size, 'emitter.size', { minValue: 0, inclusive: true })
    : { min: 1, max: 1 };
  const acceleration = options.acceleration ?? { x: 0, y: 0 };
  assertFinite(acceleration.x, 'emitter.acceleration.x');
  assertFinite(acceleration.y, 'emitter.acceleration.y');

  return {
    position: { x: position.x, y: position.y },
    rate,
    life,
    speed,
    angle,
    size,
    acceleration: { x: acceleration.x, y: acceleration.y },
  };
}

function updateEmitter(state: EmitterState, options: Partial<ParticleEmitterOptions>): void {
  if (options.position) {
    assertPoint(options.position, 'emitter.position');
    state.position = { x: options.position.x, y: options.position.y };
  }
  if (options.rate !== undefined) {
    assertFinite(options.rate, 'emitter.rate');
    if (options.rate < 0) {
      throw new Error('emitter.rate must be >= 0.');
    }
    state.rate = options.rate;
  }
  if (options.life) {
    state.life = normalizeRange(options.life, 'emitter.life', { minValue: 0, inclusive: false });
  }
  if (options.speed) {
    state.speed = normalizeRange(options.speed, 'emitter.speed', { minValue: 0, inclusive: true });
  }
  if (options.angle) {
    state.angle = normalizeRange(options.angle, 'emitter.angle');
  }
  if (options.size) {
    state.size = normalizeRange(options.size, 'emitter.size', { minValue: 0, inclusive: true });
  }
  if (options.acceleration) {
    assertFinite(options.acceleration.x, 'emitter.acceleration.x');
    assertFinite(options.acceleration.y, 'emitter.acceleration.y');
    state.acceleration = { x: options.acceleration.x, y: options.acceleration.y };
  }
}

/**
 * Creates a particle system with configurable emitters and pooling.
 * Useful for: explosions, weather effects, and ambient VFX.
 */
export function createParticleSystem({
  emitter,
  maxParticles = 500,
  random = Math.random,
}: ParticleSystemOptions): ParticleSystem {
  if (!emitter) {
    throw new Error('emitter configuration is required.');
  }
  assertFinite(maxParticles, 'maxParticles');
  if (!Number.isInteger(maxParticles) || maxParticles <= 0) {
    throw new Error('maxParticles must be a positive integer.');
  }
  if (typeof random !== 'function') {
    throw new Error('random must be a function.');
  }

  const emitterState = normalizeEmitter(emitter);
  const particles: InternalParticle[] = [];
  const pool: InternalParticle[] = [];
  let spawnAccumulator = 0;

  function acquireParticle(): InternalParticle {
    const recycled = pool.pop();
    if (recycled) {
      return recycled;
    }
    return {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      age: 0,
      life: 0,
      size: 1,
    };
  }

  function releaseParticle(particle: InternalParticle): void {
    pool.push(particle);
  }

  function spawnParticle(): void {
    if (particles.length >= maxParticles) {
      return;
    }
    const particle = acquireParticle();
    const angle = sampleRange(emitterState.angle, random);
    const speed = sampleRange(emitterState.speed, random);
    const life = sampleRange(emitterState.life, random);
    const size = sampleRange(emitterState.size, random);

    particle.position.x = emitterState.position.x;
    particle.position.y = emitterState.position.y;
    particle.velocity.x = Math.cos(angle) * speed;
    particle.velocity.y = Math.sin(angle) * speed;
    particle.age = 0;
    particle.life = life;
    particle.size = size;

    particles.push(particle);
  }

  function spawnMultiple(count: number): void {
    for (let i = 0; i < count; i += 1) {
      spawnParticle();
    }
  }

  function update(delta: number): void {
    assertFinite(delta, 'delta');
    if (delta < 0) {
      throw new Error('delta must be >= 0.');
    }

    spawnAccumulator += emitterState.rate * delta;
    const spawnCount = Math.floor(spawnAccumulator);
    if (spawnCount > 0) {
      spawnAccumulator -= spawnCount;
      spawnMultiple(spawnCount);
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.age += delta;
      if (particle.age >= particle.life) {
        const removed = particles.pop();
        if (removed && removed !== particle) {
          particles[i] = removed;
        }
        releaseParticle(particle);
        continue;
      }

      particle.velocity.x += emitterState.acceleration.x * delta;
      particle.velocity.y += emitterState.acceleration.y * delta;
      particle.position.x += particle.velocity.x * delta;
      particle.position.y += particle.velocity.y * delta;
    }
  }

  function burst(count: number): void {
    assertFinite(count, 'count');
    if (!Number.isInteger(count) || count < 0) {
      throw new Error('count must be a non-negative integer.');
    }
    spawnMultiple(count);
  }

  function getParticles(): readonly Particle[] {
    return particles;
  }

  function setEmitter(options: Partial<ParticleEmitterOptions>): void {
    if (!options || Object.keys(options).length === 0) {
      return;
    }
    updateEmitter(emitterState, options);
  }

  function setPosition(position: Point): void {
    assertPoint(position, 'position');
    emitterState.position = { x: position.x, y: position.y };
  }

  function reset(): void {
    while (particles.length > 0) {
      const particle = particles.pop();
      if (particle) {
        releaseParticle(particle);
      }
    }
    spawnAccumulator = 0;
  }

  return {
    update,
    burst,
    getParticles,
    setEmitter,
    setPosition,
    reset,
  };
}

/** @internal */
export const __internals = {
  normalizeEmitter,
  updateEmitter,
  sampleRange,
  normalizeRange,
};
