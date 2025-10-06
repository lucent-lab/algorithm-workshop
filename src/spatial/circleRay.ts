import type { Circle, Point, Ray, Vector2D } from '../types.js';

/**
 * Computes intersection points between a ray and a circle.
 * Useful for: visibility checks, projectile collision, ray casting effects.
 *
 * @returns Array of intersection points sorted by distance from ray origin.
 */
export function circleRayIntersection(ray: Ray, circle: Circle): Point[] {
  const direction = normalize(ray.direction);
  const toCircle = subtract(circleCenter(circle), ray.origin);

  const projectionLength = dot(toCircle, direction);
  const closestPoint = add(ray.origin, scale(direction, projectionLength));
  const distanceToCenterSq = distanceSquared(closestPoint, circleCenter(circle));
  const radiusSq = circle.radius * circle.radius;

  if (distanceToCenterSq > radiusSq + Number.EPSILON) {
    return [];
  }

  const offset = Math.sqrt(Math.max(radiusSq - distanceToCenterSq, 0));
  const intersections: Point[] = [];

  const t1 = projectionLength - offset;
  const t2 = projectionLength + offset;

  if (t1 >= 0) {
    intersections.push(add(ray.origin, scale(direction, t1)));
  }
  if (t2 >= 0 && offset !== 0) {
    intersections.push(add(ray.origin, scale(direction, t2)));
  }

  intersections.sort(
    (a, b) => distanceSquared(ray.origin, a) - distanceSquared(ray.origin, b)
  );
  return intersections;
}

function circleCenter(circle: Circle): Point {
  return { x: circle.x, y: circle.y };
}

function subtract(a: Point, b: Point): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

function add(a: Point, b: Vector2D): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

function scale(vec: Vector2D, scalar: number): Vector2D {
  return { x: vec.x * scalar, y: vec.y * scalar };
}

function dot(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

function normalize(vec: Vector2D): Vector2D {
  const length = Math.hypot(vec.x, vec.y);
  if (!length) {
    return { x: 0, y: 0 };
  }
  return { x: vec.x / length, y: vec.y / length };
}

function distanceSquared(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export const __internals = {
  circleCenter,
  subtract,
  add,
  scale,
  dot,
  normalize,
  distanceSquared,
};
