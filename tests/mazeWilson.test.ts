import { describe, expect, it } from 'vitest';

import { generateWilsonMaze } from '../src/index.js';

describe('generateWilsonMaze', () => {
  it('is deterministic per seed', () => {
    const options = { width: 21, height: 21, seed: 512 } as const;
    const a = generateWilsonMaze(options);
    const b = generateWilsonMaze(options);

    expect(a.grid).toEqual(b.grid);
    expect(a.start).toEqual(b.start);
    expect(a.end).toEqual(b.end);
  });

  it('ensures maze remains bounded by walls', () => {
    const { grid } = generateWilsonMaze({ width: 17, height: 17, seed: 11 });
    expect(grid[0].every((cell) => cell === 1)).toBe(true);
    expect(grid[grid.length - 1].every((cell) => cell === 1)).toBe(true);
    expect(grid.every((row) => row[0] === 1 && row[row.length - 1] === 1)).toBe(true);
  });
});
