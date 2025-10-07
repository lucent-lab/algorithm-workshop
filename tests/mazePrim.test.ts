import { describe, expect, it } from 'vitest';

import { generatePrimMaze } from '../src/index.js';

describe('generatePrimMaze', () => {
  it('is deterministic for identical seeds', () => {
    const options = { width: 21, height: 21, seed: 333 } as const;
    const a = generatePrimMaze(options);
    const b = generatePrimMaze(options);

    expect(a.grid).toEqual(b.grid);
    expect(a.start).toEqual(b.start);
    expect(a.end).toEqual(b.end);
  });

  it('carves corridors bounded by walls', () => {
    const { grid } = generatePrimMaze({ width: 15, height: 15, seed: 99 });
    expect(grid.length).toBe(15);
    expect(grid.every((row) => row.length === 15)).toBe(true);

    const borderTop = grid[0].every((cell) => cell === 1);
    const borderBottom = grid[grid.length - 1].every((cell) => cell === 1);
    const borderSides = grid.every((row) => row[0] === 1 && row[row.length - 1] === 1);
    expect(borderTop && borderBottom && borderSides).toBe(true);

    const walkableTiles = grid.flat().filter((cell) => cell === 0).length;
    expect(walkableTiles).toBeGreaterThan(0);
  });
});
