import type { Point } from '../types.js';

function assertPoint(point: Point, name: string): void {
  if (typeof point?.x !== 'number' || Number.isNaN(point.x) || !Number.isFinite(point.x)) {
    throw new Error(`${name}.x must be a finite number.`);
  }
  if (typeof point?.y !== 'number' || Number.isNaN(point.y) || !Number.isFinite(point.y)) {
    throw new Error(`${name}.y must be a finite number.`);
  }
}

function round(value: number): number {
  return Math.round(value);
}

/**
 * Generates integer raster coordinates using Bresenham's line algorithm.
 * Useful for: tile picking, grid ray tracing, and discrete drawing operations.
 */
export function bresenhamLine(start: Point, end: Point): Point[] {
  assertPoint(start, 'start');
  assertPoint(end, 'end');

  let x0 = round(start.x);
  let y0 = round(start.y);
  const x1 = round(end.x);
  const y1 = round(end.y);

  const points: Point[] = [];

  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;

  points.push({ x: x0, y: y0 });
  while (x0 !== x1 || y0 !== y1) {
    const e2 = 2 * error;
    if (e2 >= dy) {
      error += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      error += dx;
      y0 += sy;
    }
    points.push({ x: x0, y: y0 });
  }

  return points;
}

/** @internal */
export const __internals = { assertPoint, round };
