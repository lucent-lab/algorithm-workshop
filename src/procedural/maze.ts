import { createLinearCongruentialGenerator } from '../util/prng.js';
import type { Point } from '../types.js';

export interface MazeOptions {
  width: number;
  height: number;
  seed?: number;
}

export interface MazeResult {
  grid: number[][];
  start: Point;
  end: Point;
}

interface Cell extends Point {}

const WALL = 1;
const PATH = 0;

/**
 * Generates a maze using recursive backtracking (depth-first search).
 * Useful for: grid-based level layouts, puzzle generation, pathfinding tests.
 * Performance: O(width × height).
 */
export function generateRecursiveMaze({
  width,
  height,
  seed = Date.now(),
}: MazeOptions): MazeResult {
  validateDimensions(width, height);

  const grid = Array.from({ length: height }, () => Array<number>(width).fill(WALL));
  const random = createLinearCongruentialGenerator(seed);

  const start: Cell = { x: 1, y: 1 };
  carveCell(grid, start);

  const stack: Cell[] = [start];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbours = shuffledNeighbours(current, grid, random);

    const next = neighbours.find((candidate) => isWall(candidate, grid));
    if (next) {
      const mid = {
        x: current.x + (next.x - current.x) / 2,
        y: current.y + (next.y - current.y) / 2,
      };
      carveCell(grid, mid);
      carveCell(grid, next);
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  const end = findFarthestCell(start, grid);
  carveCell(grid, start);
  carveCell(grid, end);

  return { grid, start, end };
}

/**
 * Generates a maze using randomized Prim's algorithm.
 * Useful for: maze layouts with different structural characteristics than DFS.
 */
export function generatePrimMaze({
  width,
  height,
  seed = Date.now(),
}: MazeOptions): MazeResult {
  validateDimensions(width, height);

  const grid = Array.from({ length: height }, () => Array<number>(width).fill(WALL));
  const random = createLinearCongruentialGenerator(seed);

  const start: Cell = { x: 1, y: 1 };
  carveCell(grid, start);

  const frontier: Cell[] = [];
  addFrontierCells(start, grid, frontier);

  while (frontier.length > 0) {
    const index = Math.floor(random() * frontier.length);
    const [cell] = frontier.splice(index, 1);
    if (!cell) {
      continue;
    }

    const neighbours = shuffledNeighbours(cell, grid, random).filter((candidate) => !isWall(candidate, grid));
    if (neighbours.length === 0) {
      continue;
    }

    const neighbour = neighbours[Math.floor(random() * neighbours.length)];
    if (!neighbour) {
      continue;
    }
    carveCorridorBetween(grid, cell, neighbour);
    carveCell(grid, cell);
    addFrontierCells(cell, grid, frontier);
  }

  const end = findFarthestCell(start, grid);
  carveCell(grid, end);

  return { grid, start, end };
}

function validateDimensions(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error('width and height must be integers.');
  }
  if (width < 5 || height < 5) {
    throw new Error('width and height must be at least 5.');
  }
  if (width % 2 === 0 || height % 2 === 0) {
    throw new Error('width and height should be odd to surround cells with walls.');
  }
}

function shuffledNeighbours(cell: Cell, grid: number[][], random: () => number): Cell[] {
  const offsets: Array<[number, number]> = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0],
  ];
  for (let i = offsets.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
  }

  const neighbours: Cell[] = [];
  const width = grid[0]?.length ?? 0;
  for (const [dx, dy] of offsets) {
    const nx = cell.x + dx;
    const ny = cell.y + dy;
    if (ny > 0 && ny < grid.length && nx > 0 && nx < width) {
      neighbours.push({ x: nx, y: ny });
    }
  }
  return neighbours;
}

function isWall(cell: Cell, grid: number[][]): boolean {
  return grid[cell.y]?.[cell.x] === WALL;
}

function carveCell(grid: number[][], cell: Cell): void {
  if (grid[cell.y] && grid[cell.y][cell.x] !== undefined) {
    grid[cell.y][cell.x] = PATH;
  }
}

function carveCorridorBetween(grid: number[][], from: Cell, to: Cell): void {
  const mid = {
    x: from.x + (to.x - from.x) / 2,
    y: from.y + (to.y - from.y) / 2,
  };
  carveCell(grid, mid);
  carveCell(grid, to);
}

function addFrontierCells(cell: Cell, grid: number[][], frontier: Cell[]): void {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const offsets: Array<[number, number]> = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0],
  ];

  for (const [dx, dy] of offsets) {
    const nx = cell.x + dx;
    const ny = cell.y + dy;
    if (ny > 0 && ny < height && nx > 0 && nx < width && grid[ny][nx] === WALL) {
      const alreadyFrontier = frontier.some((frontierCell) => frontierCell.x === nx && frontierCell.y === ny);
      if (!alreadyFrontier) {
        frontier.push({ x: nx, y: ny });
      }
    }
  }
}

function findFarthestCell(start: Cell, grid: number[][]): Cell {
  let farthest = start;
  let maxDistance = -1;
  const width = grid[0]?.length ?? 0;
  for (let y = 1; y < grid.length; y += 2) {
    for (let x = 1; x < width; x += 2) {
      if (grid[y][x] === PATH) {
        const distance = Math.abs(start.x - x) + Math.abs(start.y - y);
        if (distance > maxDistance) {
          maxDistance = distance;
          farthest = { x, y };
        }
      }
    }
  }
  return farthest;
}
