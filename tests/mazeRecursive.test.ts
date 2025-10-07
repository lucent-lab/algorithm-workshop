import { describe, expect, it } from 'vitest';

import { generateRecursiveMaze } from '../src/index.js';

describe('generateRecursiveMaze', () => {
  it('produces deterministic mazes for equal seeds', () => {
    const options = { width: 21, height: 21, seed: 123 } as const;
    const a = generateRecursiveMaze(options);
    const b = generateRecursiveMaze(options);
    expect(a.grid).toEqual(b.grid);
    expect(a.start).toEqual(b.start);
    expect(a.end).toEqual(b.end);
  });

  it('creates a traversable grid bounded by walls', () => {
    const { grid } = generateRecursiveMaze({ width: 15, height: 15, seed: 7 });
    expect(grid.length).toBe(15);
    expect(grid.every((row) => row.length === 15)).toBe(true);

    // Outer border should remain walls
    expect(grid[0].every((cell) => cell === 1)).toBe(true);
    expect(grid[grid.length - 1].every((cell) => cell === 1)).toBe(true);
    expect(grid.every((row) => row[0] === 1 && row[row.length - 1] === 1)).toBe(true);

    const walkableTiles = grid.flat().filter((cell) => cell === 0).length;
    expect(walkableTiles).toBeGreaterThan(0);
  });
});
