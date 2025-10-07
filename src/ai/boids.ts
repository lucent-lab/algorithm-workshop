import type { Boid, Vector2D } from '../types.js';

export interface BoidOptions {
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  maxSpeed: number;
  maxForce: number;
  separationWeight?: number;
  alignmentWeight?: number;
  cohesionWeight?: number;
}

interface BoidWithNeighbours extends Boid {
  neighbours: Boid[];
}

/**
 * Updates an array of boids using classic flocking rules.
 * Useful for: swarm simulations, crowd movement, ambient particle effects.
 *
 * @param {Boid[]} boids - Mutable array of boid objects.
 * @param {BoidOptions} options - Behaviour configuration.
 *
 * @example
 * const boids = [
 *   { position: { x: 0, y: 0 }, velocity: { x: 1, y: 0 }, acceleration: { x: 0, y: 0 }, maxSpeed: 2, maxForce: 0.1 },
 *   { position: { x: 10, y: 0 }, velocity: { x: -1, y: 0 }, acceleration: { x: 0, y: 0 }, maxSpeed: 2, maxForce: 0.1 },
 * ];
 * updateBoids(boids, {
 *   separationDistance: 10,
 *   alignmentDistance: 20,
 *  cohesionDistance: 25,
 *   maxSpeed: 2,
 *   maxForce: 0.1,
 * });
 * console.log(boids[0].position.x);
 *
 * @example
 * const flock = Array.from({ length: 50 }, (_, i) => ({
 *   position: { x: i, y: i * 0.5 },
 *   velocity: { x: 0, y: 0 },
 *   acceleration: { x: 0, y: 0 },
 *   maxSpeed: 3,
 *   maxForce: 0.05,
 * }));
 * updateBoids(flock, {
 *   separationDistance: 12,
 *   alignmentDistance: 20,
 *   cohesionDistance: 30,
 *   maxSpeed: 3,
 *   maxForce: 0.05,
 *   separationWeight: 1.5,
 *   alignmentWeight: 1.0,
 *   cohesionWeight: 0.8,
 * });
 */
export function updateBoids(boids: Boid[], options: BoidOptions): void {
  const {
    separationDistance,
    alignmentDistance,
    cohesionDistance,
    maxSpeed,
    maxForce,
    separationWeight = 1,
    alignmentWeight = 1,
    cohesionWeight = 1,
  } = options;

  const enriched = mapNeighbours(boids);

  for (const boid of enriched) {
    const separation = steerSeparation(boid, separationDistance, maxSpeed, maxForce);
    const alignment = steerAlignment(boid, alignmentDistance, maxSpeed, maxForce);
    const cohesion = steerCohesion(boid, cohesionDistance, maxSpeed, maxForce);

    boid.acceleration.x = 0;
    boid.acceleration.y = 0;

    addForce(boid.acceleration, separation, separationWeight);
    addForce(boid.acceleration, alignment, alignmentWeight);
    addForce(boid.acceleration, cohesion, cohesionWeight);
  }

  // Integrate velocities and positions
  for (const boid of boids) {
    boid.velocity.x += boid.acceleration.x;
    boid.velocity.y += boid.acceleration.y;
    limit(boid.velocity, maxSpeed);
    boid.position.x += boid.velocity.x;
    boid.position.y += boid.velocity.y;
  }
}

function mapNeighbours(boids: Boid[]): BoidWithNeighbours[] {
  return boids.map((boid, _, arr) => ({
    ...boid,
    neighbours: arr,
  }));
}

function steerSeparation(
  boid: BoidWithNeighbours,
  radius: number,
  maxSpeed: number,
  maxForce: number
): Vector2D {
  const steer: Vector2D = { x: 0, y: 0 };
  let count = 0;

  for (const other of boid.neighbours) {
    if (other === boid) continue;
    const d = distance(boid.position, other.position);
    if (d > 0 && d < radius) {
      const diff = subtract(boid.position, other.position);
      div(diff, d);
      steer.x += diff.x;
      steer.y += diff.y;
      count += 1;
    }
  }

  if (count > 0) {
    div(steer, count);
  }

  if (length(steer) > 0) {
    normalize(steer);
    mul(steer, maxSpeed);
    sub(steer, boid.velocity);
    limit(steer, maxForce);
  }
  return steer;
}

function steerAlignment(
  boid: BoidWithNeighbours,
  radius: number,
  maxSpeed: number,
  maxForce: number
): Vector2D {
  const sum: Vector2D = { x: 0, y: 0 };
  let count = 0;

  for (const other of boid.neighbours) {
    if (other === boid) continue;
    const d = distance(boid.position, other.position);
    if (d > 0 && d < radius) {
      sum.x += other.velocity.x;
      sum.y += other.velocity.y;
      count += 1;
    }
  }

  if (count === 0) {
    return { x: 0, y: 0 };
  }

  div(sum, count);
  normalize(sum);
  mul(sum, maxSpeed);
  const steer = subtract(sum, boid.velocity);
  limit(steer, maxForce);
  return steer;
}

function steerCohesion(
  boid: BoidWithNeighbours,
  radius: number,
  maxSpeed: number,
  maxForce: number
): Vector2D {
  const sum: Vector2D = { x: 0, y: 0 };
  let count = 0;

  for (const other of boid.neighbours) {
    if (other === boid) continue;
    const d = distance(boid.position, other.position);
    if (d > 0 && d < radius) {
      sum.x += other.position.x;
      sum.y += other.position.y;
      count += 1;
    }
  }

  if (count === 0) {
    return { x: 0, y: 0 };
  }

  div(sum, count);
  return seekTowards(boid, sum, maxSpeed, maxForce);
}

function seekTowards(boid: Boid, target: Vector2D, maxSpeed: number, maxForce: number): Vector2D {
  const desired = subtract(target, boid.position);
  normalize(desired);
  mul(desired, maxSpeed);
  const steer = subtract(desired, boid.velocity);
  limit(steer, maxForce);
  return steer;
}

function addForce(acceleration: Vector2D, force: Vector2D, weight: number): void {
  acceleration.x += force.x * weight;
  acceleration.y += force.y * weight;
}

function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

function sub(a: Vector2D, b: Vector2D): void {
  a.x -= b.x;
  a.y -= b.y;
}

function mul(vec: Vector2D, scalar: number): void {
  vec.x *= scalar;
  vec.y *= scalar;
}

function div(vec: Vector2D, scalar: number): void {
  vec.x /= scalar;
  vec.y /= scalar;
}

function length(vec: Vector2D): number {
  return Math.hypot(vec.x, vec.y);
}

function normalize(vec: Vector2D): void {
  const len = length(vec);
  if (len === 0) {
    return;
  }
  vec.x /= len;
  vec.y /= len;
}

function limit(vec: Vector2D, max: number): void {
  const len = length(vec);
  if (len > max) {
    const factor = max / len;
    vec.x *= factor;
    vec.y *= factor;
  }
}

function distance(a: Vector2D, b: Vector2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export const __internals = {
  distance,
  limit,
  normalize,
  length,
  subtract,
  mapNeighbours,
};
