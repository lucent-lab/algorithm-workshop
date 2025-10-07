import type { Point } from '../types.js';
import { createLinearCongruentialGenerator } from '../util/prng.js';

export interface PoissonDiskOptions {
  width: number;
  height: number;
  radius: number;
  maxAttempts?: number;
  seed?: number;
}

export function poissonDiskSampling({
  width,
  height,
  radius,
  maxAttempts = 30,
  seed = Date.now(),
}: PoissonDiskOptions): Point[] {
  if (width <= 0 || height <= 0) {
    throw new Error('width and height must be positive numbers.');
  }
  if (radius <= 0) {
    throw new Error('radius must be greater than zero.');
  }

  const random = createLinearCongruentialGenerator(seed);
  const cellSize = radius / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid = new Array<number>(gridWidth * gridHeight).fill(-1);

  const points: Point[] = [];
  const active: number[] = [];

  const initialPoint: Point = {
    x: random() * width,
    y: random() * height,
  };
  insertPoint(initialPoint);

  while (active.length > 0) {
    const randomIndex = Math.floor(random() * active.length);
    const pointIndex = active[randomIndex];
    const point = points[pointIndex];
    let accepted = false;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const candidate = generateCandidate(point, radius, random);
      if (
        candidate.x >= 0 &&
        candidate.x < width &&
        candidate.y >= 0 &&
        candidate.y < height &&
        isAcceptable(candidate, radius, cellSize, grid, gridWidth, gridHeight, points)
      ) {
        insertPoint(candidate);
        accepted = true;
        break;
      }
    }

    if (!accepted) {
      active.splice(randomIndex, 1);
    }
  }

  return points;

  function insertPoint(pointToAdd: Point): void {
    const index = points.push(pointToAdd) - 1;
    active.push(index);
    const { gx, gy } = toGrid(pointToAdd, cellSize, gridWidth, gridHeight);
    grid[gy * gridWidth + gx] = index;
  }
}

function generateCandidate(origin: Point, radius: number, random: () => number): Point {
  const angle = random() * Math.PI * 2;
  const distance = radius * (1 + random());
  return {
    x: origin.x + Math.cos(angle) * distance,
    y: origin.y + Math.sin(angle) * distance,
  };
}

function isAcceptable(
  candidate: Point,
  radius: number,
  cellSize: number,
  grid: number[],
  gridWidth: number,
  gridHeight: number,
  points: Point[]
): boolean {
  const { gx, gy } = toGrid(candidate, cellSize, gridWidth, gridHeight);
  const searchRadius = 2;

  for (let y = Math.max(gy - searchRadius, 0); y <= Math.min(gy + searchRadius, gridHeight - 1); y += 1) {
    for (let x = Math.max(gx - searchRadius, 0); x <= Math.min(gx + searchRadius, gridWidth - 1); x += 1) {
      const index = grid[y * gridWidth + x];
      if (index !== -1) {
        const point = points[index];
        const dx = point.x - candidate.x;
        const dy = point.y - candidate.y;
        if (dx * dx + dy * dy < radius * radius) {
          return false;
        }
      }
    }
  }

  return true;
}

function toGrid(point: Point, cellSize: number, gridWidth: number, gridHeight: number): {
  gx: number;
  gy: number;
} {
  const gx = Math.min(Math.floor(point.x / cellSize), gridWidth - 1);
  const gy = Math.min(Math.floor(point.y / cellSize), gridHeight - 1);
  return { gx, gy };
}
