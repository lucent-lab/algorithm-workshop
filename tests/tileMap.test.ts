import { describe, expect, it } from 'vitest';

import { createTileMapController } from '../src/index.js';

describe('createTileMapController', () => {
  const width = 4;
  const height = 3;
  const layerData = [
    1, 0, 0, 2,
    0, 0, 3, 0,
    4, 0, 0, 0,
  ];

  const controller = createTileMapController({
    width,
    height,
    tileWidth: 16,
    tileHeight: 16,
    chunkWidth: 2,
    chunkHeight: 2,
    layers: [
      {
        name: 'ground',
        data: layerData,
        collision: layerData.map((value) => value === 3),
      },
      {
        name: 'decor',
        data: Array(width * height).fill(0),
      },
    ],
  });

  it('reads and writes tile values', () => {
    expect(controller.getTile('ground', 0, 0)).toBe(1);
    controller.setTile('ground', 1, 1, 5);
    expect(controller.getTile('ground', 1, 1)).toBe(5);
  });

  it('detects collision across layers', () => {
    expect(controller.isCollidable(2, 1)).toBe(true);
    expect(controller.isCollidable(0, 0)).toBe(false);
    expect(controller.isCollidable(-1, 0)).toBe(false);
  });

  it('computes visible tiles within viewport', () => {
    const tiles = controller.getVisibleTiles({ x: 0, y: 0, width: 32, height: 32 });
    const ids = tiles.map((tile) => tile.tileId);
    expect(ids).toEqual([1, 5]);
  });

  it('computes visible chunks overlapping viewport', () => {
    const chunks = controller.getVisibleChunks({ x: 0, y: 0, width: 64, height: 48 });
    expect(chunks).toEqual([
      { cx: 0, cy: 0 },
      { cx: 1, cy: 0 },
      { cx: 0, cy: 1 },
      { cx: 1, cy: 1 },
    ]);
  });
});
