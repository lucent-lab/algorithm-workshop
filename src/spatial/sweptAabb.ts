import type { Rect, Vector2D } from '../types.js';

export interface MovingRect extends Rect {
  velocity: Vector2D;
}

export interface SweptResult {
  collided: boolean;
  time: number;
  normal: Vector2D;
}

/**
 * Performs swept AABB collision detection between a moving and static rectangle.
 * Useful for: continuous collision in platformers, fast-moving projectiles, physics engines.
 *
 * @param {MovingRect} moving - Rectangle with velocity describing motion during the frame.
 * @param {Rect} target - Static rectangle to test against.
 *
 * @returns {SweptResult} Collision state with time and collision normal.
 *
 * @example
 * const result = sweptAABB(
 *   { x: 0, y: 0, width: 1, height: 1, velocity: { x: 5, y: 0 } },
 *   { x: 4, y: 0, width: 1, height: 1 }
 * );
 * console.log(result.collided, result.time);
 * // => true, ~0.6
 *
 * @example
 * sweptAABB(
 *   { x: 0, y: 0, width: 1, height: 1, velocity: { x: -2, y: 0 } },
 *   { x: 5, y: 5, width: 1, height: 1 }
 * );
 * // => { collided: false, time: 1, normal: { x: 0, y: 0 } }
 */
export function sweptAABB(moving: MovingRect, target: Rect): SweptResult {
  const invEntry = { x: 0, y: 0 };
  const invExit = { x: 0, y: 0 };

  if (moving.velocity.x > 0) {
    invEntry.x = target.x - (moving.x + moving.width);
    invExit.x = target.x + target.width - moving.x;
  } else {
    invEntry.x = target.x + target.width - moving.x;
    invExit.x = target.x - (moving.x + moving.width);
  }

  if (moving.velocity.y > 0) {
    invEntry.y = target.y - (moving.y + moving.height);
    invExit.y = target.y + target.height - moving.y;
  } else {
    invEntry.y = target.y + target.height - moving.y;
    invExit.y = target.y - (moving.y + moving.height);
  }

  const entryTime = {
    x: moving.velocity.x === 0 ? Number.NEGATIVE_INFINITY : invEntry.x / moving.velocity.x,
    y: moving.velocity.y === 0 ? Number.NEGATIVE_INFINITY : invEntry.y / moving.velocity.y,
  };
  const exitTime = {
    x: moving.velocity.x === 0 ? Number.POSITIVE_INFINITY : invExit.x / moving.velocity.x,
    y: moving.velocity.y === 0 ? Number.POSITIVE_INFINITY : invExit.y / moving.velocity.y,
  };

  const entry = Math.max(entryTime.x, entryTime.y);
  const exit = Math.min(exitTime.x, exitTime.y);

  if (entry > exit || (entryTime.x < 0 && entryTime.y < 0) || entry > 1) {
    return { collided: false, time: 1, normal: { x: 0, y: 0 } };
  }

  const normal = { x: 0, y: 0 };
  if (entryTime.x > entryTime.y) {
    normal.x = invEntry.x < 0 ? 1 : -1;
  } else {
    normal.y = invEntry.y < 0 ? 1 : -1;
  }

  return { collided: true, time: clamp(entry, 0, 1), normal };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const __internals = {
  clamp,
};
