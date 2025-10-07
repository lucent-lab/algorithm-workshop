import { describe, expect, it } from 'vitest';

import { generateAldousBroderMaze } from '../src/index.js';

describe('generateAldousBroderMaze', () => {
  it('returns deterministic mazes for identical seeds', () => {
    const options = { width: 21, height: 21, seed: 888 } as const;
    const a = generateAldousBroderMaze(options);
    const b = generateAldousBroderMaze(options);

    expect(a.grid).toEqual(b.grid);
    expect(a.start).toEqual(b.start);
    expect(a.end).toEqual(b.end);
  });

  it('produces walkable paths in a walled grid', () => {
    const { grid } = generateAldousBroderMaze({ width: 17, height: 17, seed: 42 });
    expect(grid.length).toBe(17);
    expect(grid.every((row) => row.length === 17)).toBe(true);
    expect(grid[0].every((cell) => cell === 1)).toBe(true);
    expect(grid[grid.length - 1].every((cell) => cell === 1)).toBe(true);
    expect(grid.every((row) => row[0] === 1 && row[row.length - 1] === 1)).toBe(true);
    expect(grid.flat().some((cell) => cell === 0)).toBe(true);
  });
});
