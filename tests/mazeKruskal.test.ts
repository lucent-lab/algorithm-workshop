import { describe, expect, it } from 'vitest';

import { generateKruskalMaze } from '../src/index.js';

describe('generateKruskalMaze', () => {
  it('is deterministic for identical seeds', () => {
    const options = { width: 21, height: 21, seed: 404 } as const;
    const a = generateKruskalMaze(options);
    const b = generateKruskalMaze(options);

    expect(a.grid).toEqual(b.grid);
    expect(a.start).toEqual(b.start);
    expect(a.end).toEqual(b.end);
  });

  it('produces a maze fully enclosed by walls', () => {
    const { grid } = generateKruskalMaze({ width: 17, height: 17, seed: 99 });
    expect(grid[0].every((cell) => cell === 1)).toBe(true);
    expect(grid[grid.length - 1].every((cell) => cell === 1)).toBe(true);
    expect(grid.every((row) => row[0] === 1 && row[row.length - 1] === 1)).toBe(true);
    const walkable = grid.flat().filter((cell) => cell === 0).length;
    expect(walkable).toBeGreaterThan(0);
  });
});
