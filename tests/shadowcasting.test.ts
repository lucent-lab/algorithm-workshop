import { describe, expect, it } from 'vitest';

import { computeFieldOfView, transparentFromGrid, transparentFromTileMap } from '../src/index.js';
import { createTileMapController } from '../src/index.js';

describe('shadowcasting field of view', () => {
  it('reveals tiles within radius considering obstacles', () => {
    const grid: Parameters<typeof transparentFromGrid>[0] = {
      width: 5,
      height: 5,
      tiles: [
        true, true, true, true, true,
        true, false, false, false, true,
        true, false, true, false, true,
        true, false, false, false, true,
        true, true, true, true, true,
      ],
    };

    const transparent = transparentFromGrid(grid);
    const seen: Array<{ x: number; y: number }> = [];
    const fov = computeFieldOfView(2, 2, {
      radius: 2,
      transparent,
      reveal: (x, y) => {
        seen.push({ x, y });
      },
    });

    expect(fov.isVisible(2, 2)).toBe(true);
    expect(fov.isVisible(0, 0)).toBe(false);
    expect(seen.some((tile) => tile.x === 3 && tile.y === 2)).toBe(true);
    expect(seen.some((tile) => tile.x === 2 && tile.y === 4)).toBe(false);
  });

  it('supports tile map integration', () => {
    const controller = createTileMapController({
      width: 3,
      height: 3,
      tileWidth: 1,
      tileHeight: 1,
      layers: [
        {
          name: 'ground',
          data: [
            1, 1, 1,
            1, 0, 1,
            1, 1, 1,
          ],
        },
      ],
    });

    const transparent = transparentFromTileMap(controller, 'ground', (tileId) => tileId !== 0);
    const fov = computeFieldOfView(1, 1, { radius: 1, transparent });

    expect(fov.isVisible(1, 1)).toBe(true);
    expect(fov.isVisible(1, 0)).toBe(true);
    expect(fov.isVisible(1, 2)).toBe(true);
    expect(fov.isVisible(0, 1)).toBe(true);
    expect(fov.isVisible(2, 1)).toBe(true);
    expect(fov.isVisible(0, 0)).toBe(false);
  });
});
