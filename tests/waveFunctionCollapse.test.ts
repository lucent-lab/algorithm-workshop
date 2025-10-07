import { describe, expect, it } from 'vitest';
import { waveFunctionCollapse } from '../src/procedural/waveFunctionCollapse.js';
import type { WfcTile } from '../src/procedural/waveFunctionCollapse.js';

const tiles: ReadonlyArray<WfcTile> = [
  {
    id: 'A',
    weight: 2,
    rules: {
      top: ['A', 'B'],
      right: ['A', 'B'],
      bottom: ['A', 'B'],
      left: ['A', 'B'],
    },
  },
  {
    id: 'B',
    weight: 1,
    rules: {
      top: ['A'],
      right: ['A', 'B'],
      bottom: ['A'],
      left: ['A', 'B'],
    },
  },
] as const satisfies ReadonlyArray<{
  id: string;
  weight?: number;
  rules: { top?: string[]; right?: string[]; bottom?: string[]; left?: string[] };
}>;

describe('waveFunctionCollapse', () => {
  it('generates deterministic layout for identical seeds', () => {
    const first = waveFunctionCollapse({ width: 3, height: 3, tiles, seed: 7 });
    const second = waveFunctionCollapse({ width: 3, height: 3, tiles, seed: 7 });
    expect(second).toEqual(first);
  });

  it('respects adjacency rules', () => {
    const result = waveFunctionCollapse({ width: 3, height: 2, tiles, seed: 13 });
    for (let y = 0; y < result.length; y += 1) {
      const row = result[y];
      if (!row) {
        continue;
      }
      for (let x = 0; x < row.length; x += 1) {
        const current = row[x];
        if (!current) {
          continue;
        }
        const tile = tiles.find((t) => t.id === current);
        if (!tile) {
          continue;
        }
        const right = result[y]?.[x + 1];
        const bottom = result[y + 1]?.[x];
        if (right) {
          const allowedRight = tile.rules.right ?? ['A', 'B'];
          expect(allowedRight).toContain(right);
        }
        if (bottom) {
          const allowedBottom = tile.rules.bottom ?? ['A', 'B'];
          expect(allowedBottom).toContain(bottom);
        }
      }
    }
  });
});
