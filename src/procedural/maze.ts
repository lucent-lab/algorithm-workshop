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
      carveCorridorBetween(grid, current, next);
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
 * Useful for: mazes with branching corridors differing from DFS results.
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

/**
 * Generates a maze using Kruskal's algorithm with a disjoint-set structure.
 * Useful for: evenly distributed mazes with minimal bias.
 */
export function generateKruskalMaze({
  width,
  height,
  seed = Date.now(),
}: MazeOptions): MazeResult {
  validateDimensions(width, height);

  const grid = Array.from({ length: height }, () => Array<number>(width).fill(WALL));
  const random = createLinearCongruentialGenerator(seed);

  const cells: Cell[] = [];
  const indexMap = new Map<string, number>();
  let idx = 0;
  for (let y = 1; y < height; y += 2) {
    for (let x = 1; x < width; x += 2) {
      cells.push({ x, y });
      indexMap.set(cellKey(x, y), idx);
      idx += 1;
      carveCell(grid, { x, y });
    }
  }

  const dsu = createDisjointSet(cells.length);
  const edges: Array<{ a: Cell; b: Cell }> = [];

  for (const cell of cells) {
    const neighbours: Array<[number, number]> = [
      [2, 0],
      [0, 2],
    ];
    for (const [dx, dy] of neighbours) {
      const nx = cell.x + dx;
      const ny = cell.y + dy;
      if (nx < width && ny < height) {
        edges.push({ a: cell, b: { x: nx, y: ny } });
      }
    }
  }

  shuffle(edges, random);

  for (const edge of edges) {
    const aIndex = indexMap.get(cellKey(edge.a.x, edge.a.y));
    const bIndex = indexMap.get(cellKey(edge.b.x, edge.b.y));
    if (aIndex === undefined || bIndex === undefined) {
      continue;
    }
    if (findSet(dsu, aIndex) !== findSet(dsu, bIndex)) {
      unionSet(dsu, aIndex, bIndex);
      carveCorridorBetween(grid, edge.a, edge.b);
    }
  }

  const start: Cell = { x: 1, y: 1 };
  const end = findFarthestCell(start, grid);
  carveCell(grid, end);

  return { grid, start, end };
}

/**
 * Generates a maze using Wilson's loop-erased random walk algorithm.
 * Useful for: unbiased mazes with uniform spanning tree properties.
 */
export function generateWilsonMaze({
  width,
  height,
  seed = Date.now(),
}: MazeOptions): MazeResult {
  validateDimensions(width, height);

  const grid = Array.from({ length: height }, () => Array<number>(width).fill(WALL));
  const random = createLinearCongruentialGenerator(seed);

  const cells: Cell[] = [];
  const unvisited = new Set<string>();
  for (let y = 1; y < height; y += 2) {
    for (let x = 1; x < width; x += 2) {
      const key = cellKey(x, y);
      unvisited.add(key);
      cells.push({ x, y });
    }
  }

  const start = cells[0] ?? { x: 1, y: 1 };
  carveCell(grid, start);
  const startKey = cellKey(start.x, start.y);
  unvisited.delete(startKey);

  const tree = new Set<string>([startKey]);

  while (unvisited.size > 0) {
    const keys = Array.from(unvisited);
    const initialKey = keys[Math.floor(random() * keys.length)];
    if (!initialKey) {
      continue;
    }
    let current = parseCellKey(initialKey);
    const path: Cell[] = [current];
    const visitedInWalk = new Map<string, number>([[initialKey, 0]]);

    while (!tree.has(cellKey(current.x, current.y))) {
      const next = randomOddNeighbour(current, grid, random);
      const key = cellKey(next.x, next.y);
      const existing = visitedInWalk.get(key);
      if (existing !== undefined) {
        path.length = existing + 1;
      } else {
        path.push(next);
        visitedInWalk.set(key, path.length - 1);
      }
      current = next;
    }

    for (let i = 0; i < path.length; i += 1) {
      const cell = path[i];
      if (!cell) {
        continue;
      }
      const key = cellKey(cell.x, cell.y);
      if (!tree.has(key)) {
        tree.add(key);
        unvisited.delete(key);
        carveCell(grid, cell);
      }
      if (i < path.length - 1) {
        const nextCell = path[i + 1];
        if (nextCell) {
          carveCorridorBetween(grid, cell, nextCell);
        }
      }
    }
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

function cellKey(x: number, y: number): string {
  return `${x}:${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(':').map((value) => Number.parseInt(value, 10));
  return { x, y };
}

function shuffle<T>(items: T[], random: () => number): void {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function randomOddNeighbour(cell: Cell, grid: number[][], random: () => number): Cell {
  const offsets: Array<[number, number]> = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0],
  ];
  const order = offsets.slice();
  shuffle(order, random);
  const width = grid[0]?.length ?? 0;
  const height = grid.length;
  for (const [dx, dy] of order) {
    const nx = cell.x + dx;
    const ny = cell.y + dy;
    if (ny > 0 && ny < height && nx > 0 && nx < width) {
      return { x: nx, y: ny };
    }
  }
  return cell;
}

function createDisjointSet(size: number): Int32Array {
  const parent = new Int32Array(size);
  for (let i = 0; i < size; i += 1) {
    parent[i] = -1;
  }
  return parent;
}

function findSet(parent: Int32Array, index: number): number {
  if (parent[index] < 0) {
    return index;
  }
  parent[index] = findSet(parent, parent[index]);
  return parent[index];
}

function unionSet(parent: Int32Array, a: number, b: number): void {
  const rootA = findSet(parent, a);
  const rootB = findSet(parent, b);
  if (rootA === rootB) {
    return;
  }
  const sizeA = -parent[rootA];
  const sizeB = -parent[rootB];
  if (sizeA >= sizeB) {
    parent[rootA] -= sizeB;
    parent[rootB] = rootA;
  } else {
    parent[rootB] -= sizeA;
    parent[rootA] = rootB;
  }
}
