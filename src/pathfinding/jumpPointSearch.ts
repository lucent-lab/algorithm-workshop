import type { Point } from '../types.js';

export interface JumpPointSearchOptions {
  grid: number[][];
  start: Point;
  goal: Point;
  allowDiagonal?: boolean;
  heuristic?: (a: Point, b: Point) => number;
}

interface Node extends Point {
  g: number;
  f: number;
  parent: Node | null;
}

/**
 * Jump Point Search optimisation for uniform-cost grids.
 * Useful for: large grid pathfinding, RTS unit movement, navigation meshes baked to grids.
 */
export function jumpPointSearch(options: JumpPointSearchOptions): Point[] | null {
  const { grid, start, goal, allowDiagonal = true, heuristic = manhattan } = options;
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const open: Node[] = [];
  const startNode: Node = { ...start, g: 0, f: heuristic(start, goal), parent: null };
  open.push(startNode);
  const closed = new Set<string>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const key = nodeKey(current);

    if (current.x === goal.x && current.y === goal.y) {
      return reconstruct(current);
    }
    closed.add(key);

    const neighbors = identifySuccessors(current, grid, goal, allowDiagonal, heuristic, closed);
    for (const neighbor of neighbors) {
      open.push(neighbor);
    }
  }

  return null;
}

function identifySuccessors(
  node: Node,
  grid: number[][],
  goal: Point,
  allowDiagonal: boolean,
  heuristic: (a: Point, b: Point) => number,
  closed: Set<string>
): Node[] {
  const successors: Node[] = [];
  const neighbors = pruneNeighbors(node, grid, allowDiagonal);

  for (const dir of neighbors) {
    const jumpPoint = jump(node, dir, grid, goal, allowDiagonal);
    if (!jumpPoint) {
      continue;
    }

    const key = nodeKey(jumpPoint);
    if (closed.has(key)) {
      continue;
    }

    const g = node.g + distance(node, jumpPoint);
    const f = g + heuristic(jumpPoint, goal);
    successors.push({ ...jumpPoint, g, f, parent: node });
  }

  return successors;
}

function jump(
  node: Node,
  direction: Point,
  grid: number[][],
  goal: Point,
  allowDiagonal: boolean
): Node | null {
  const next = { x: node.x + direction.x, y: node.y + direction.y };
  if (!isWalkable(grid, next.x, next.y)) {
    return null;
  }
  if (next.x === goal.x && next.y === goal.y) {
    return { ...next, g: 0, f: 0, parent: null };
  }

  const dx = direction.x;
  const dy = direction.y;

  if (dx !== 0 && dy !== 0) {
    if (
      (isWalkable(grid, next.x - dx, next.y + dy) && !isWalkable(grid, next.x - dx, next.y)) ||
      (isWalkable(grid, next.x + dx, next.y - dy) && !isWalkable(grid, next.x, next.y - dy))
    ) {
      return { ...next, g: 0, f: 0, parent: null };
    }
  } else {
    if (dx !== 0) {
      if (
        (isWalkable(grid, next.x + dx, next.y + 1) && !isWalkable(grid, next.x, next.y + 1)) ||
        (isWalkable(grid, next.x + dx, next.y - 1) && !isWalkable(grid, next.x, next.y - 1))
      ) {
        return { ...next, g: 0, f: 0, parent: null };
      }
    } else if (dy !== 0) {
      if (
        (isWalkable(grid, next.x + 1, next.y + dy) && !isWalkable(grid, next.x + 1, next.y)) ||
        (isWalkable(grid, next.x - 1, next.y + dy) && !isWalkable(grid, next.x - 1, next.y))
      ) {
        return { ...next, g: 0, f: 0, parent: null };
      }
    }
  }

  if (allowDiagonal && dx !== 0 && dy !== 0) {
    const horiz = jump({ ...next, g: 0, f: 0, parent: null }, { x: dx, y: 0 }, grid, goal, allowDiagonal);
    const vert = jump({ ...next, g: 0, f: 0, parent: null }, { x: 0, y: dy }, grid, goal, allowDiagonal);
    if (horiz || vert) {
      return { ...next, g: 0, f: 0, parent: null };
    }
  }

  return jump({ ...next, g: 0, f: 0, parent: null }, direction, grid, goal, allowDiagonal);
}

function pruneNeighbors(node: Node, grid: number[][], allowDiagonal: boolean): Point[] {
  const successors: Point[] = [];
  if (!node.parent) {
    return getNeighbors(node, grid, allowDiagonal);
  }

  const dx = clamp(node.x - node.parent.x);
  const dy = clamp(node.y - node.parent.y);

  if (dx !== 0 && dy !== 0) {
    if (isWalkable(grid, node.x, node.y + dy)) {
      successors.push({ x: 0, y: dy });
    }
    if (isWalkable(grid, node.x + dx, node.y)) {
      successors.push({ x: dx, y: 0 });
    }
    if (
      isWalkable(grid, node.x + dx, node.y + dy) &&
      isWalkable(grid, node.x + dx, node.y) &&
      isWalkable(grid, node.x, node.y + dy)
    ) {
      successors.push({ x: dx, y: dy });
    }
    if (!isWalkable(grid, node.x - dx, node.y)) {
      successors.push({ x: -dx, y: dy });
    }
    if (!isWalkable(grid, node.x, node.y - dy)) {
      successors.push({ x: dx, y: -dy });
    }
  } else {
    if (dx === 0) {
      if (isWalkable(grid, node.x, node.y + dy)) {
        successors.push({ x: 0, y: dy });
        if (!allowDiagonal) {
          if (!isWalkable(grid, node.x + 1, node.y)) {
            successors.push({ x: 1, y: dy });
          }
          if (!isWalkable(grid, node.x - 1, node.y)) {
            successors.push({ x: -1, y: dy });
          }
        }
      }
      if (allowDiagonal) {
        if (!isWalkable(grid, node.x + 1, node.y)) {
          successors.push({ x: 1, y: dy });
        }
        if (!isWalkable(grid, node.x - 1, node.y)) {
          successors.push({ x: -1, y: dy });
        }
      }
    } else {
      if (isWalkable(grid, node.x + dx, node.y)) {
        successors.push({ x: dx, y: 0 });
        if (!allowDiagonal) {
          if (!isWalkable(grid, node.x, node.y + 1)) {
            successors.push({ x: dx, y: 1 });
          }
          if (!isWalkable(grid, node.x, node.y - 1)) {
            successors.push({ x: dx, y: -1 });
          }
        }
      }
      if (allowDiagonal) {
        if (!isWalkable(grid, node.x, node.y + 1)) {
          successors.push({ x: dx, y: 1 });
        }
        if (!isWalkable(grid, node.x, node.y - 1)) {
          successors.push({ x: dx, y: -1 });
        }
      }
    }
  }

  return successors;
}

function getNeighbors(node: Point, grid: number[][], allowDiagonal: boolean): Point[] {
  const neighbors: Point[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      if (!allowDiagonal && dx !== 0 && dy !== 0) {
        continue;
      }
      const nx = node.x + dx;
      const ny = node.y + dy;
      if (!isWalkable(grid, nx, ny)) {
        continue;
      }
      if (dx !== 0 && dy !== 0) {
        if (!isWalkable(grid, node.x + dx, node.y) || !isWalkable(grid, node.x, node.y + dy)) {
          continue;
        }
      }
      neighbors.push({ x: dx, y: dy });
    }
  }
  return neighbors;
}

function isWalkable(grid: number[][], x: number, y: number): boolean {
  return grid[y]?.[x] === 0;
}

function nodeKey(node: Point): string {
  return `${node.x}:${node.y}`;
}

function reconstruct(node: Node | null): Point[] {
  const raw: Point[] = [];
  let current: Node | null = node;
  while (current) {
    raw.push({ x: current.x, y: current.y });
    current = current.parent;
  }
  raw.reverse();
  if (raw.length <= 1) {
    return raw;
  }

  const expanded: Point[] = [];
  for (let i = 0; i < raw.length - 1; i += 1) {
    const start = raw[i];
    const end = raw[i + 1];
    if (i === 0) {
      expanded.push({ ...start });
    }
    const stepX = clamp(end.x - start.x);
    const stepY = clamp(end.y - start.y);
    let cx = start.x;
    let cy = start.y;
    while (cx !== end.x || cy !== end.y) {
      cx += stepX;
      cy += stepY;
      expanded.push({ x: cx, y: cy });
    }
  }

  return expanded;
}

function distance(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx && dy ? Math.sqrt(dx * dx + dy * dy) : dx + dy;
}

function clamp(value: number): number {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}

function manhattan(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
