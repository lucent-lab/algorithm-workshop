import { describe, expect, it } from 'vitest';

import { cellularAutomataCave } from '../src/index.js';

describe('cellularAutomataCave', () => {
  it('produces deterministic grids for the same seed', () => {
    const options = {
      width: 20,
      height: 15,
      seed: 123,
      iterations: 4,
      fillProbability: 0.45,
    } as const;

    const resultA = cellularAutomataCave(options);
    const resultB = cellularAutomataCave(options);

    expect(resultA.grid).toEqual(resultB.grid);
    expect(resultA.openCells).toEqual(resultB.openCells);
  });

  it('returns walls on the border and tracks open cells', () => {
    const { grid, openCells } = cellularAutomataCave({
      width: 12,
      height: 12,
      seed: 42,
      iterations: 3,
      fillProbability: 0.42,
    });

    expect(grid[0]).toSatisfy((row: number[]) => row.every((cell) => cell === 1));
    expect(grid[grid.length - 1]).toSatisfy((row: number[]) => row.every((cell) => cell === 1));
    expect(grid.every((row) => row[0] === 1 && row[row.length - 1] === 1)).toBe(true);

    const openCount = openCells.length;
    const flatGrid = grid.flat();
    const emptyCount = flatGrid.filter((cell) => cell === 0).length;
    expect(openCount).toBe(emptyCount);
    expect(openCount).toBeGreaterThan(0);
  });
});
