import { describe, expect, it } from 'vitest';

import { generateRecursiveDivisionMaze } from '../src/index.js';

describe('generateRecursiveDivisionMaze', () => {
  it('is deterministic for identical seeds', () => {
    const options = { width: 21, height: 21, seed: 555 } as const;
    const a = generateRecursiveDivisionMaze(options);
    const b = generateRecursiveDivisionMaze(options);

    expect(a.grid).toEqual(b.grid);
    expect(a.start).toEqual(b.start);
    expect(a.end).toEqual(b.end);
  });

  it('produces nested chambers bounded by walls', () => {
    const { grid } = generateRecursiveDivisionMaze({ width: 17, height: 17, seed: 73 });
    expect(grid.length).toBe(17);
    expect(grid.every((row) => row.length === 17)).toBe(true);
    expect(grid[0].every((cell) => cell === 1)).toBe(true);
    expect(grid[grid.length - 1].every((cell) => cell === 1)).toBe(true);
    expect(grid.every((row) => row[0] === 1 && row[row.length - 1] === 1)).toBe(true);
  });
});
