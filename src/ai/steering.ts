import type { SteeringAgent, Vector2D, Agent } from '../types.js';

const EPSILON = 1e-5;

function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

function length(vec: Vector2D): number {
  return Math.hypot(vec.x, vec.y);
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

function truncate(vec: Vector2D, max: number): Vector2D {
  const len = length(vec);
  if (len > max) {
    return scale(vec, max / (len || 1));
  }
  return vec;
}

/**
 * Steering behaviour to move toward a target point.
 * Useful for: AI navigation, homing missiles, companion characters.
 */
export function seek(agent: SteeringAgent, target: Vector2D): Vector2D {
  const desired = subtract(target, agent.position);
  const desiredVelocity = scale(normalize(desired), agent.maxSpeed);
  const steer = subtract(desiredVelocity, agent.velocity);
  return truncate(steer, agent.maxForce);
}

/**
 * Steering behaviour to move away from a target point.
 * Useful for: avoidance, evasion, fear mechanics.
 */
export function flee(agent: SteeringAgent, target: Vector2D): Vector2D {
  const desired = subtract(agent.position, target);
  const desiredVelocity = scale(normalize(desired), agent.maxSpeed);
  const steer = subtract(desiredVelocity, agent.velocity);
  return truncate(steer, agent.maxForce);
}

/**
 * Steering behaviour to arrive smoothly at a target.
 * Useful for: graceful stopping, docking maneuvers, cinematic motion.
 */
export function arrive(agent: SteeringAgent, target: Vector2D, slowRadius: number): Vector2D {
  const toTarget = subtract(target, agent.position);
  const distance = length(toTarget);

  if (distance < EPSILON) {
    return { x: 0, y: 0 };
  }

  const speed = distance < slowRadius ? agent.maxSpeed * (distance / slowRadius) : agent.maxSpeed;
  const desiredVelocity = scale(toTarget, speed / distance);
  const steer = subtract(desiredVelocity, agent.velocity);
  return truncate(steer, agent.maxForce);
}

/**
 * Steering behaviour to pursue a moving target.
 * Useful for: chase AI, interceptors, guard responses.
 */
export function pursue(agent: SteeringAgent, target: Agent): Vector2D {
  const toTarget = subtract(target.position, agent.position);
  const relativeHeading = agent.velocity.x * target.velocity.x + agent.velocity.y * target.velocity.y;

  if (relativeHeading > 0 && length(toTarget) < 5) {
    return seek(agent, target.position);
  }

  const predictionTime = Math.max(length(toTarget) / (agent.maxSpeed + length(target.velocity)), 0.1);
  const futurePosition = {
    x: target.position.x + target.velocity.x * predictionTime,
    y: target.position.y + target.velocity.y * predictionTime,
  };
  return seek(agent, futurePosition);
}

/**
 * Steering behaviour for wandering with small random deviations.
 * Useful for: idle movement, ambient creatures, background NPCs.
 */
export function wander(
  agent: SteeringAgent,
  options: {
    circleDistance?: number;
    circleRadius?: number;
    jitter?: number;
    state?: { angle: number };
  } = {}
): { force: Vector2D; state: { angle: number } } {
  const { circleDistance = 2, circleRadius = 1.5, jitter = 0.4 } = options;
  const state = options.state ?? { angle: Math.random() * Math.PI * 2 };

  state.angle += (Math.random() - 0.5) * jitter;

  const circleCenter = scale(normalize(agent.velocity), circleDistance);
  const displacement = {
    x: Math.cos(state.angle) * circleRadius,
    y: Math.sin(state.angle) * circleRadius,
  };

  const wanderForce = {
    x: circleCenter.x + displacement.x,
    y: circleCenter.y + displacement.y,
  };

  return {
    force: truncate(wanderForce, agent.maxForce),
    state,
  };
}

export const __internals = { subtract, normalize, scale, truncate, length };
