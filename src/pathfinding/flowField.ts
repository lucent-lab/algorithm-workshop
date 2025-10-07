import type { Point, Vector2D } from '../types.js';

export interface FlowFieldOptions {
  grid: number[][];
  goal: Point;
  allowDiagonal?: boolean;
}

export interface FlowFieldResult {
  cost: number[][];
  flow: Vector2D[][];
}

const ORTHOGONAL_NEIGHBORS: ReadonlyArray<Point> = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const DIAGONAL_NEIGHBORS: ReadonlyArray<Point> = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
];

/**
 * Builds a flow field pointing toward the goal cell using uniform-cost integration.
 * Useful for: multi-unit steering, crowd navigation, RTS flow maps.
 */
export function computeFlowField(options: FlowFieldOptions): FlowFieldResult {
  const { grid, goal, allowDiagonal = true } = options;
  validateGrid(grid, goal);

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const cost: number[][] = Array.from({ length: height }, () => Array<number>(width).fill(Number.POSITIVE_INFINITY));
  const flow: Vector2D[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ x: 0, y: 0 } as Vector2D))
  );

  const queue: Array<{ point: Point; priority: number }> = [];
  if (isWalkable(grid, goal.x, goal.y)) {
    cost[goal.y][goal.x] = 0;
    queue.push({ point: goal, priority: 0 });
  }

  while (queue.length > 0) {
    queue.sort((a, b) => a.priority - b.priority);
    const current = queue.shift()!;
    const currentCost = cost[current.point.y][current.point.x];

    const neighbors = allowDiagonal
      ? [...ORTHOGONAL_NEIGHBORS, ...DIAGONAL_NEIGHBORS]
      : ORTHOGONAL_NEIGHBORS;

    for (const dir of neighbors) {
      const nx = current.point.x + dir.x;
      const ny = current.point.y + dir.y;
      if (!isWalkable(grid, nx, ny)) {
        continue;
      }
      const stepCost = dir.x !== 0 && dir.y !== 0 ? Math.SQRT2 : 1;
      const tentative = currentCost + stepCost;
      if (tentative < cost[ny][nx]) {
        cost[ny][nx] = tentative;
        queue.push({ point: { x: nx, y: ny }, priority: tentative });
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!isWalkable(grid, x, y) || !Number.isFinite(cost[y][x])) {
        flow[y][x] = { x: 0, y: 0 };
        continue;
      }
      if (x === goal.x && y === goal.y) {
        flow[y][x] = { x: 0, y: 0 };
        continue;
      }
      let bestNeighbor: Point | null = null;
      let bestCost = cost[y][x];

      const neighbors = allowDiagonal
        ? [...ORTHOGONAL_NEIGHBORS, ...DIAGONAL_NEIGHBORS]
        : ORTHOGONAL_NEIGHBORS;

      for (const dir of neighbors) {
        const nx = x + dir.x;
        const ny = y + dir.y;
        if (nx < 0 || ny < 0 || ny >= height || nx >= width) {
          continue;
        }
        const neighborCost = cost[ny][nx];
        if (neighborCost < bestCost) {
          bestCost = neighborCost;
          bestNeighbor = { x: nx, y: ny };
        }
      }

      if (!bestNeighbor) {
        flow[y][x] = { x: 0, y: 0 };
        continue;
      }

      const dx = bestNeighbor.x - x;
      const dy = bestNeighbor.y - y;
      const magnitude = Math.hypot(dx, dy) || 1;
      flow[y][x] = { x: dx / magnitude, y: dy / magnitude };
    }
  }

  return { cost, flow };
}

function isWalkable(grid: number[][], x: number, y: number): boolean {
  return grid[y]?.[x] === 0;
}

function validateGrid(grid: number[][], goal: Point): void {
  if (!Array.isArray(grid) || grid.length === 0) {
    throw new TypeError('grid must be a non-empty 2D array');
  }
  const width = grid[0]?.length;
  if (!grid.every((row) => Array.isArray(row) && row.length === width)) {
    throw new TypeError('grid rows must be arrays of equal length');
  }
  if (!isWithin(grid, goal.x, goal.y)) {
    throw new RangeError('goal must be inside the grid bounds');
  }
}

function isWithin(grid: number[][], x: number, y: number): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < (grid[0]?.length ?? 0);
}
