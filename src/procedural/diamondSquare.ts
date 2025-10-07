import { createLinearCongruentialGenerator } from '../util/prng.js';

export interface DiamondSquareOptions {
  /**
   * Grid size must be 2^n + 1 (e.g. 5, 9, 17).
   */
  size: number;
  /**
   * Controls how quickly perturbations shrink each iteration.
   */
  roughness?: number;
  /**
   * Starting amplitude for corner offsets.
   */
  initialAmplitude?: number;
  /**
   * Seed for deterministic noise generation.
   */
  seed?: number;
  /**
   * Clamp height map to [0, 1] after generation.
   */
  normalize?: boolean;
}

export interface DiamondSquareResult {
  grid: number[][];
  min: number;
  max: number;
}

const DEFAULT_ROUGHNESS = 0.55;
const DEFAULT_AMPLITUDE = 1;

/**
 * Generates a height map using the diamond-square fractal algorithm.
 * Useful for: terrain synthesis, cloud layers, noise-based textures.
 * Performance: O(size^2) where size = (2^n + 1).
 */
export function diamondSquare({
  size,
  roughness = DEFAULT_ROUGHNESS,
  initialAmplitude = DEFAULT_AMPLITUDE,
  seed = Date.now(),
  normalize = true,
}: DiamondSquareOptions): DiamondSquareResult {
  validateSize(size);
  if (roughness <= 0 || roughness >= 1) {
    throw new Error('roughness must be between 0 and 1 (exclusive).');
  }
  if (initialAmplitude <= 0) {
    throw new Error('initialAmplitude must be greater than zero.');
  }

  const grid = Array.from({ length: size }, () => new Array<number>(size).fill(0));
  const random = createLinearCongruentialGenerator(seed);
  const last = size - 1;

  setCorner(grid, 0, 0, randomAmplitude(random, initialAmplitude));
  setCorner(grid, last, 0, randomAmplitude(random, initialAmplitude));
  setCorner(grid, 0, last, randomAmplitude(random, initialAmplitude));
  setCorner(grid, last, last, randomAmplitude(random, initialAmplitude));

  let step = last;
  let amplitude = initialAmplitude;

  while (step > 1) {
    const half = step / 2;

    // Diamond step
    for (let y = 0; y < last; y += step) {
      for (let x = 0; x < last; x += step) {
        const average =
          (grid[y][x] + grid[y][x + step] + grid[y + step][x] + grid[y + step][x + step]) / 4;
        grid[y + half][x + half] = average + randomAmplitude(random, amplitude);
      }
    }

    // Square step
    for (let y = 0; y <= last; y += half) {
      for (let x = (y + half) % step; x <= last; x += step) {
        let sum = 0;
        let count = 0;

        if (x - half >= 0) {
          sum += grid[y][x - half];
          count += 1;
        }
        if (x + half <= last) {
          sum += grid[y][x + half];
          count += 1;
        }
        if (y - half >= 0) {
          sum += grid[y - half][x];
          count += 1;
        }
        if (y + half <= last) {
          sum += grid[y + half][x];
          count += 1;
        }

        const average = sum / count;
        grid[y][x] = average + randomAmplitude(random, amplitude);
      }
    }

    amplitude *= roughness;
    step = half;
  }

  let min = Infinity;
  let max = -Infinity;
  for (const row of grid) {
    for (const value of row) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }

  if (normalize) {
    const range = max - min || 1;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        grid[y][x] = (grid[y][x] - min) / range;
      }
    }
    min = 0;
    max = 1;
  }

  return { grid, min, max };
}

function validateSize(size: number): void {
  if (!Number.isInteger(size) || size < 3) {
    throw new Error('size must be an integer >= 3.');
  }
  const exponent = Math.log2(size - 1);
  if (!Number.isInteger(exponent)) {
    throw new Error('size must satisfy size = 2^n + 1 (e.g. 5, 9, 17).');
  }
}

function randomAmplitude(random: () => number, amplitude: number): number {
  return (random() * 2 - 1) * amplitude;
}

function setCorner(grid: number[][], x: number, y: number, value: number): void {
  grid[y][x] = value;
}
