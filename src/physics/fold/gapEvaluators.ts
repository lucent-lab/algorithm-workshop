import type { Point3D, Vector3D } from '../../types.js';

export interface PointTriangleGapResult {
  gap: number;
  closestPoint: Point3D;
  normal: Vector3D;
}

export interface EdgeEdgeGapResult {
  gap: number;
  closestPointA: Point3D;
  closestPointB: Point3D;
  normal: Vector3D;
}

export interface PointPlaneGapResult {
  gap: number;
  projectedPoint: Point3D;
  normal: Vector3D;
}

export function computePointTriangleGap(point: Point3D, triangle: readonly [Point3D, Point3D, Point3D]): PointTriangleGapResult {
  validatePoint(point);
  triangle.forEach(validatePoint);

  const [a, b, c] = triangle;
  const ab = subtract(b, a);
  const ac = subtract(c, a);
  const ap = subtract(point, a);
  const normal = normalise(cross(ab, ac)) ?? { x: 0, y: 0, z: 1 };

  const projection = dot(ap, normal);
  const projectedPoint = subtract(point, scale(normal, projection));
  const barycentric = barycentricCoordinates(projectedPoint, a, b, c);

  let closestPoint: Point3D;
  if (isInsideBarycentric(barycentric)) {
    closestPoint = projectedPoint;
  } else {
    closestPoint = closestPointOnEdges(projectedPoint, triangle);
  }

  const gap = projection;
  return { gap, closestPoint, normal };
}

export function computeEdgeEdgeGap(edgeA: readonly [Point3D, Point3D], edgeB: readonly [Point3D, Point3D]): EdgeEdgeGapResult {
  edgeA.forEach(validatePoint);
  edgeB.forEach(validatePoint);

  const [p1, q1] = edgeA;
  const [p2, q2] = edgeB;
  const d1 = subtract(q1, p1);
  const d2 = subtract(q2, p2);
  const r = subtract(p1, p2);
  const a = dot(d1, d1);
  const e = dot(d2, d2);
  const f = dot(d2, r);
  let s: number;
  let t: number;

  const EPS = 1e-8;
  if (a <= EPS && e <= EPS) {
    s = t = 0;
  } else if (a <= EPS) {
    s = 0;
    t = clamp(f / e, 0, 1);
  } else {
    const c = dot(d1, r);
    if (e <= EPS) {
      t = 0;
      s = clamp(-c / a, 0, 1);
    } else {
      const b = dot(d1, d2);
      const denom = a * e - b * b;
      if (denom !== 0) {
        s = clamp((b * f - c * e) / denom, 0, 1);
      } else {
        s = 0;
      }
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = clamp(-c / a, 0, 1);
      } else if (t > 1) {
        t = 1;
        s = clamp((b - c) / a, 0, 1);
      }
    }
  }

  const closestA = add(p1, scale(d1, s));
  const closestB = add(p2, scale(d2, t));
  const diff = subtract(closestB, closestA);
  const normal = normalise(diff) ?? { x: 0, y: 0, z: 1 };
  const gap = dot(diff, normal);
  return { gap, closestPointA: closestA, closestPointB: closestB, normal };
}

export function computePointPlaneGap(point: Point3D, planePoint: Point3D, planeNormal: Vector3D): PointPlaneGapResult {
  validatePoint(point);
  validatePoint(planePoint);
  validateVector(planeNormal);

  const normal = normalise(planeNormal) ?? { x: 0, y: 0, z: 1 };
  const diff = subtract(point, planePoint);
  const gap = dot(diff, normal);
  const projectedPoint = subtract(point, scale(normal, gap));
  return { gap, projectedPoint, normal };
}

function validatePoint(point: Point3D | undefined): asserts point is Point3D {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || !Number.isFinite(point.z)) {
    throw new TypeError('Point3D must contain finite x, y, z values.');
  }
}

function validateVector(vector: Vector3D | undefined): asserts vector is Vector3D {
  if (!vector || !Number.isFinite(vector.x) || !Number.isFinite(vector.y) || !Number.isFinite(vector.z)) {
    throw new TypeError('Vector3D must contain finite x, y, z values.');
  }
}

function subtract(a: Point3D, b: Point3D): Vector3D {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function add(a: Point3D, b: Vector3D): Point3D {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scale(v: Vector3D, s: number): Vector3D {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function dot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function normalise(v: Vector3D): Vector3D | null {
  const length = Math.hypot(v.x, v.y, v.z);
  if (length === 0) return null;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function barycentricCoordinates(p: Point3D, a: Point3D, b: Point3D, c: Point3D): { u: number; v: number; w: number } {
  const v0 = subtract(b, a);
  const v1 = subtract(c, a);
  const v2 = subtract(p, a);
  const d00 = dot(v0, v0);
  const d01 = dot(v0, v1);
  const d11 = dot(v1, v1);
  const d20 = dot(v2, v0);
  const d21 = dot(v2, v1);
  const denom = d00 * d11 - d01 * d01;
  if (denom === 0) {
    return { u: -1, v: -1, w: -1 };
  }
  const v = (d11 * d20 - d01 * d21) / denom;
  const w = (d00 * d21 - d01 * d20) / denom;
  const u = 1 - v - w;
  return { u, v, w };
}

function isInsideBarycentric({ u, v, w }: { u: number; v: number; w: number }): boolean {
  const EPS = -1e-8;
  return u >= EPS && v >= EPS && w >= EPS;
}

function closestPointOnEdges(point: Point3D, triangle: readonly [Point3D, Point3D, Point3D]): Point3D {
  const edges: Array<[Point3D, Point3D]> = [
    [triangle[0], triangle[1]],
    [triangle[1], triangle[2]],
    [triangle[2], triangle[0]],
  ];
  let closest = edges[0]?.[0] ?? point;
  let minDistance = Number.POSITIVE_INFINITY;
  for (const [start, end] of edges) {
    const candidate = closestPointSegment(point, start, end);
    const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y, candidate.z - point.z);
    if (distance < minDistance) {
      minDistance = distance;
      closest = candidate;
    }
  }
  return closest;
}

function closestPointSegment(point: Point3D, start: Point3D, end: Point3D): Point3D {
  const ab = subtract(end, start);
  const t = clamp(dot(subtract(point, start), ab) / dot(ab, ab), 0, 1);
  return add(start, scale(ab, t));
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
