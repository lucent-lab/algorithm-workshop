import { describe, it, expect } from 'vitest';
import { astar, gridFromString, manhattanDistance } from '../src/pathfinding/astar.js';
import { dijkstra } from '../src/pathfinding/dijkstra.js';
import { jumpPointSearch } from '../src/pathfinding/jumpPointSearch.js';

describe('A* pathfinding', () => {
  it('finds a valid path on simple grid', () => {
    const grid = gridFromString(`
      000
      010
      000
    `);
    const path = astar({
      grid,
      start: { x: 0, y: 0 },
      goal: { x: 2, y: 2 },
      allowDiagonal: false,
      heuristic: manhattanDistance,
    });

    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ x: 0, y: 0 });
    expect(path!.at(-1)).toEqual({ x: 2, y: 2 });
  });

  it('returns null when no route exists', () => {
    const grid = gridFromString(`
      010
      111
      010
    `);

    const result = astar({
      grid,
      start: { x: 0, y: 0 },
      goal: { x: 2, y: 2 },
      allowDiagonal: false,
      heuristic: manhattanDistance,
    });

    expect(result).toBeNull();
  });
});

describe('Dijkstra', () => {
  it('returns shortest path and cost', () => {
    const graph = {
      A: [
        { node: 'B', weight: 1 },
        { node: 'C', weight: 4 },
      ],
      B: [
        { node: 'C', weight: 2 },
        { node: 'D', weight: 5 },
      ],
      C: [{ node: 'D', weight: 1 }],
      D: [],
    };

    const result = dijkstra({ graph, start: 'A', goal: 'D' });

    expect(result).not.toBeNull();
    expect(result!.path).toEqual(['A', 'B', 'C', 'D']);
    expect(result!.cost).toBe(4);
  });

  it('returns null when path does not exist', () => {
    const graph = {
      A: [{ node: 'B', weight: 1 }],
      B: [],
      C: [],
    };

    const result = dijkstra({ graph, start: 'A', goal: 'C' });
    expect(result).toBeNull();
  });
});

describe('Jump Point Search', () => {
  const grid = gridFromString(`
    00000
    01110
    00010
    01110
    00000
  `);

  it('finds shortest route matching A*', () => {
    const jpsPath = jumpPointSearch({
      grid,
      start: { x: 0, y: 0 },
      goal: { x: 4, y: 4 },
      allowDiagonal: true,
    });

    const astarPath = astar({
      grid,
      start: { x: 0, y: 0 },
      goal: { x: 4, y: 4 },
      allowDiagonal: true,
    });

    expect(jpsPath).not.toBeNull();
    expect(astarPath).not.toBeNull();
    expect(jpsPath?.at(0)).toEqual({ x: 0, y: 0 });
    expect(jpsPath?.at(-1)).toEqual({ x: 4, y: 4 });
    expect(jpsPath?.length).toBe(astarPath?.length);
  });

  it('returns null when goal unreachable', () => {
    const blocked = gridFromString(`
      000
      111
      000
    `);

    const result = jumpPointSearch({
      grid: blocked,
      start: { x: 0, y: 0 },
      goal: { x: 2, y: 2 },
    });

    expect(result).toBeNull();
  });
});
