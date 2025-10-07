import type { RvoAgent, Vector2D } from '../types.js';

const EPSILON = 1e-6;

/**
 * Configuration for the RVO solver.
 * Useful for: tuning responsiveness, limiting neighbor checks, scaling deflection strength.
 */
export interface RvoOptions {
  /** Seconds to look ahead when predicting collisions. */
  timeHorizon?: number;
  /** Maximum neighbors each agent considers for avoidance. */
  maxNeighbors?: number;
  /** Multiplier controlling how strongly agents slide away from conflicts. */
  avoidanceStrength?: number;
}

/**
 * Velocity update returned by {@link rvoStep}.
 */
export interface RvoResult {
  /** Optional identifier carried over from the input agent. */
  id?: string;
  /** Steering-adjusted velocity vector that remains under the agent max speed. */
  velocity: Vector2D;
}

/**
 * Computes collision-avoiding agent velocities using reciprocal velocity obstacles (RVO).
 * Useful for: crowd steering, swarm navigation, multi-agent avoidance.
 *
 * @param agents - Collection of crowd agents with their state and preferred velocities.
 * @param options - Optional tuning parameters (time horizon, neighbor limits, avoidance strength).
 * @returns Velocity updates per agent, preserving their `id` when provided.
 *
 * @example
 * import { rvoStep } from 'llm-algorithms';
 *
 * const agents = [
 *   {
 *     id: 'alpha',
 *     position: { x: -1, y: 0 },
 *     velocity: { x: 1, y: 0 },
 *     preferredVelocity: { x: 1, y: 0 },
 *     radius: 0.35,
 *     maxSpeed: 1.5,
 *   },
 *   {
 *     id: 'beta',
 *     position: { x: 1, y: 0 },
 *     velocity: { x: -1, y: 0 },
 *     preferredVelocity: { x: -1, y: 0 },
 *     radius: 0.35,
 *     maxSpeed: 1.5,
 *   },
 * ];
 *
 * const updated = rvoStep(agents, { timeHorizon: 2.5 });
 * // updated[0].velocity.y and updated[1].velocity.y have opposite signs for lateral avoidance.
 *
 * @example
 * import { rvoStep } from 'llm-algorithms';
 *
 * const swarm = new Array(25).fill(null).map((_, index) => ({
 *   id: `agent-${index}`,
 *   position: { x: Math.cos((index / 25) * Math.PI * 2), y: Math.sin((index / 25) * Math.PI * 2) },
 *   velocity: { x: 0, y: 0 },
 *   preferredVelocity: { x: 0.6, y: 0 },
 *   radius: 0.25,
 *   maxSpeed: 0.8,
 * }));
 *
 * const step = rvoStep(swarm, { maxNeighbors: 10, avoidanceStrength: 0.5 });
 * // step contains safe velocities that can be fed into your integration loop.
 */
export function rvoStep(
  agents: ReadonlyArray<RvoAgent>,
  options: RvoOptions = {}
): RvoResult[] {
  if (!Array.isArray(agents)) {
    throw new TypeError('agents must be an array');
  }

  const timeHorizon = options.timeHorizon ?? 2;
  const maxNeighbors = options.maxNeighbors ?? agents.length;
  const avoidanceStrength = options.avoidanceStrength ?? 0.6;

  if (timeHorizon <= 0) {
    throw new RangeError('timeHorizon must be greater than zero');
  }
  if (maxNeighbors <= 0) {
    throw new RangeError('maxNeighbors must be greater than zero');
  }
  if (avoidanceStrength < 0) {
    throw new RangeError('avoidanceStrength must be non-negative');
  }

  return agents.map<RvoResult>((agent: RvoAgent, index: number) => {
    validateAgent(agent, index);

    const neighborEntries: Array<{ other: RvoAgent; distanceSq: number }> = agents
      .map((other: RvoAgent, otherIndex: number) => ({
        other,
        distanceSq: squaredDistance(agent.position, other.position),
        otherIndex,
      }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.distanceSq - b.distanceSq)
      .slice(0, maxNeighbors)
      .map(({ other, distanceSq }) => ({ other, distanceSq }));

    let adjusted = { ...agent.preferredVelocity };

    for (const { other } of neighborEntries) {
      const avoidance = computeAvoidance(agent, other, adjusted, timeHorizon, avoidanceStrength);
      adjusted = {
        x: adjusted.x + avoidance.x,
        y: adjusted.y + avoidance.y,
      };
    }

    const speed = length(adjusted);
    if (speed > agent.maxSpeed) {
      adjusted = scale(adjusted, agent.maxSpeed / (speed || 1));
    }

    return { id: agent.id, velocity: adjusted };
  });
}

function validateAgent(agent: RvoAgent, index: number): void {
  if (!agent) {
    throw new TypeError(`agents[${index}] is undefined`);
  }
  if (!isFinite(agent.position.x) || !isFinite(agent.position.y)) {
    throw new TypeError(`agents[${index}].position must contain finite numbers`);
  }
  if (!isFinite(agent.velocity.x) || !isFinite(agent.velocity.y)) {
    throw new TypeError(`agents[${index}].velocity must contain finite numbers`);
  }
  if (!isFinite(agent.preferredVelocity.x) || !isFinite(agent.preferredVelocity.y)) {
    throw new TypeError(`agents[${index}].preferredVelocity must contain finite numbers`);
  }
  if (!isFinite(agent.radius) || agent.radius < 0) {
    throw new RangeError(`agents[${index}].radius must be a non-negative number`);
  }
  if (!isFinite(agent.maxSpeed) || agent.maxSpeed <= 0) {
    throw new RangeError(`agents[${index}].maxSpeed must be a positive number`);
  }
}

function computeAvoidance(
  agent: RvoAgent,
  other: RvoAgent,
  candidateVelocity: Vector2D,
  timeHorizon: number,
  avoidanceStrength: number
): Vector2D {
  const relPos = subtract(other.position, agent.position);
  const relVel = subtract(other.velocity, candidateVelocity);
  const combinedRadius = agent.radius + other.radius;
  const distSq = dot(relPos, relPos);

  if (distSq < EPSILON) {
    const direction = normalize(subtract(agent.position, other.position));
    return scale(direction, avoidanceStrength * agent.maxSpeed);
  }

  const timeToCollision = computeTimeToCollision(relPos, relVel, combinedRadius);

  if (!Number.isFinite(timeToCollision) || timeToCollision > timeHorizon) {
    return { x: 0, y: 0 };
  }

  const weight = Math.max(0, (timeHorizon - timeToCollision) / timeHorizon);
  const separation = Math.sqrt(distSq);

  if (separation <= combinedRadius) {
    const away = normalize(subtract(agent.position, other.position));
    return scale(away, weight * avoidanceStrength * agent.maxSpeed);
  }

  const normal = normalize(relPos);
  const tangent = { x: -normal.y, y: normal.x };
  const directionSign = dot(relVel, tangent) >= 0 ? 1 : -1;
  const slide = scale(tangent, directionSign * weight * avoidanceStrength * agent.maxSpeed);
  return slide;
}

function computeTimeToCollision(relPos: Vector2D, relVel: Vector2D, combinedRadius: number): number {
  const a = dot(relVel, relVel);
  const b = 2 * dot(relPos, relVel);
  const c = dot(relPos, relPos) - combinedRadius * combinedRadius;

  if (a < EPSILON) {
    return Number.POSITIVE_INFINITY;
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return Number.POSITIVE_INFINITY;
  }

  const sqrtDisc = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);

  if (t1 > EPSILON) {
    return t1;
  }
  if (t2 > EPSILON) {
    return t2;
  }
  return Number.POSITIVE_INFINITY;
}

function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

function dot(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

function length(vec: Vector2D): number {
  return Math.hypot(vec.x, vec.y);
}

function squaredDistance(a: Vector2D, b: Vector2D): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function normalize(vec: Vector2D): Vector2D {
  const len = length(vec);
  if (len < EPSILON) {
    return { x: 0, y: 0 };
  }
  return { x: vec.x / len, y: vec.y / len };
}

function scale(vec: Vector2D, scalar: number): Vector2D {
  return { x: vec.x * scalar, y: vec.y * scalar };
}

export const __internals = { computeTimeToCollision, subtract, dot, length, normalize, scale };
