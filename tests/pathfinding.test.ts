import { describe, it, expect } from 'vitest';
import { astar, gridFromString, manhattanDistance } from '../src/pathfinding/astar.js';
import { dijkstra } from '../src/pathfinding/dijkstra.js';

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
