import type { Point } from '../types.js';
import { createLinearCongruentialGenerator } from '../util/prng.js';

export interface CellularAutomataOptions {
  width: number;
  height: number;
  fillProbability?: number;
  birthLimit?: number;
  survivalLimit?: number;
  iterations?: number;
  seed?: number;
}

export interface CellularAutomataResult {
  grid: number[][];
  /**
   * Points representing empty cells, useful for quick sampling.
   */
  openCells: Point[];
}

const DEFAULT_FILL = 0.45;
const DEFAULT_BIRTH_LIMIT = 4;
const DEFAULT_SURVIVAL_LIMIT = 3;
const DEFAULT_ITERATIONS = 5;

export function cellularAutomataCave({
  width,
  height,
  fillProbability = DEFAULT_FILL,
  birthLimit = DEFAULT_BIRTH_LIMIT,
  survivalLimit = DEFAULT_SURVIVAL_LIMIT,
  iterations = DEFAULT_ITERATIONS,
  seed = Date.now(),
}: CellularAutomataOptions): CellularAutomataResult {
  if (!Number.isInteger(width) || width <= 2) {
    throw new Error('width must be an integer greater than 2');
  }
  if (!Number.isInteger(height) || height <= 2) {
    throw new Error('height must be an integer greater than 2');
  }
  if (fillProbability <= 0 || fillProbability >= 1) {
    throw new Error('fillProbability must be between 0 and 1 (exclusive)');
  }

  const random = createLinearCongruentialGenerator(seed);
  let grid = createInitialGrid(width, height, fillProbability, random);

  for (let i = 0; i < iterations; i += 1) {
    grid = simulateStep(grid, birthLimit, survivalLimit);
  }

  const openCells: Point[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y]?.[x] === 0) {
        openCells.push({ x, y });
      }
    }
  }

  return { grid, openCells };
}

function createInitialGrid(
  width: number,
  height: number,
  fillProbability: number,
  random: () => number
): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < height; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < width; x += 1) {
      const isBorder = y === 0 || x === 0 || y === height - 1 || x === width - 1;
      if (isBorder) {
        row.push(1);
      } else {
        row.push(random() < fillProbability ? 1 : 0);
      }
    }
    grid.push(row);
  }
  return grid;
}

function simulateStep(
  grid: number[][],
  birthLimit: number,
  survivalLimit: number
): number[][] {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const next: number[][] = [];

  for (let y = 0; y < height; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < width; x += 1) {
      const neighbors = countAliveNeighbors(grid, x, y);
      if (grid[y]?.[x] === 1) {
        row.push(neighbors >= survivalLimit ? 1 : 0);
      } else {
        row.push(neighbors > birthLimit ? 1 : 0);
      }
    }
    next.push(row);
  }

  return next;
}

function countAliveNeighbors(grid: number[][], x: number, y: number): number {
  let count = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      const nx = x + dx;
      const ny = y + dy;
      const cell = grid[ny]?.[nx];
      if (cell === undefined) {
        count += 1;
      } else {
        count += cell;
      }
    }
  }
  return count;
}
