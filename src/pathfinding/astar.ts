import type { Point } from '../types.js';

export interface AStarOptions {
  grid: number[][];
  start: Point;
  goal: Point;
  allowDiagonal?: boolean;
  heuristic?: (a: Point, b: Point) => number;
}

interface AStarNode extends Point {
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

interface Neighbor extends Point {
  cost: number;
}

/**
 * A* pathfinding algorithm for grid-based navigation.
 * Useful for: game character movement, robot routing, path planning in mazes.
 */
export function astar({
  grid,
  start,
  goal,
  allowDiagonal = true,
  heuristic = euclideanDistance,
}: AStarOptions): Point[] | null {
  validateGrid(grid, start, goal);

  const openSet = new Map<string, AStarNode>();
  const openList: AStarNode[] = [];
  const closed = new Set<string>();

  const startNode: AStarNode = {
    ...start,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
    parent: null,
  };
  openSet.set(nodeKey(start.x, start.y), startNode);
  openList.push(startNode);

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f || a.h - b.h);
    const current = openList.shift()!;
    const currentKey = nodeKey(current.x, current.y);

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(current);
    }

    openSet.delete(currentKey);
    closed.add(currentKey);

    for (const neighbor of getNeighbors(current, grid, allowDiagonal)) {
      const neighborKey = nodeKey(neighbor.x, neighbor.y);
      if (closed.has(neighborKey)) {
        continue;
      }

      const tentativeG = current.g + neighbor.cost;
      const existing = openSet.get(neighborKey);

      if (!existing || tentativeG < existing.g) {
        const hScore = heuristic(neighbor, goal);
        const updated: AStarNode = {
          x: neighbor.x,
          y: neighbor.y,
          g: tentativeG,
          h: hScore,
          f: tentativeG + hScore,
          parent: current,
        };

        if (!existing) {
          openList.push(updated);
        } else {
          const index = openList.indexOf(existing);
          if (index >= 0) {
            openList.splice(index, 1, updated);
          }
        }

        openSet.set(neighborKey, updated);
      }
    }
  }

  return null;
}

function getNeighbors(node: AStarNode, grid: number[][], allowDiagonal: boolean): Neighbor[] {
  const deltas = allowDiagonal
    ? [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]
    : [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

  const neighbors: Neighbor[] = [];
  for (const [dx, dy] of deltas) {
    const nx = node.x + dx;
    const ny = node.y + dy;
    if (!isWalkable(grid, nx, ny)) {
      continue;
    }
    const cost = dx !== 0 && dy !== 0 ? Math.SQRT2 : 1;
    neighbors.push({ x: nx, y: ny, cost });
  }
  return neighbors;
}

function reconstructPath(node: AStarNode): Point[] {
  const path: Point[] = [];
  let current: AStarNode | null = node;
  while (current) {
    path.push({ x: current.x, y: current.y });
    current = current.parent;
  }
  return path.reverse();
}

function validateGrid(grid: number[][], start: Point, goal: Point): void {
  if (!Array.isArray(grid) || grid.length === 0) {
    throw new Error('Grid must be a non-empty 2D array.');
  }
  const width = grid[0].length;
  if (!grid.every((row) => Array.isArray(row) && row.length === width)) {
    throw new Error('Grid rows must be arrays of equal length.');
  }
  if (!isWalkable(grid, start.x, start.y)) {
    throw new Error('Start position is blocked or outside the grid.');
  }
  if (!isWalkable(grid, goal.x, goal.y)) {
    throw new Error('Goal position is blocked or outside the grid.');
  }
}

function isWalkable(grid: number[][], x: number, y: number): boolean {
  return (
    y >= 0 &&
    y < grid.length &&
    x >= 0 &&
    x < grid[0].length &&
    grid[y][x] === 0
  );
}

function nodeKey(x: number, y: number): string {
  return `${x},${y}`;
}

function euclideanDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function gridFromString(mapString: string): number[][] {
  if (typeof mapString !== 'string') {
    throw new TypeError('mapString must be a string.');
  }

  const rows = mapString
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim());

  const grid = rows
    .filter((line) => line.length > 0)
    .map((line) => {
      return [...line].map((ch) => {
        if (ch !== '0' && ch !== '1') {
          throw new Error('Grid string can only contain 0 or 1 characters.');
        }
        return Number(ch);
      });
    });

  if (grid.length === 0) {
    throw new Error('mapString must contain at least one row.');
  }

  const width = grid[0].length;
  if (!grid.every((row) => row.length === width)) {
    throw new Error('All grid rows must have the same length.');
  }

  return grid;
}

export const __internals = {
  nodeKey,
  euclideanDistance,
  isWalkable,
  reconstructPath,
};
