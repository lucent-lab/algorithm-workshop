import { createTileMapController } from '../src/index.js';

const width = 8;
const height = 6;
const tiles = Array(width * height).fill(0);
tiles[0] = 1;
tiles[7] = 2;
tiles[width * 2 + 3] = 3;

const tileMap = createTileMapController({
  width,
  height,
  tileWidth: 32,
  tileHeight: 32,
  chunkWidth: 4,
  chunkHeight: 3,
  layers: [
    {
      name: 'ground',
      data: tiles,
    },
  ],
});

const viewport = { x: 0, y: 0, width: 128, height: 96 };
const visible = tileMap.getVisibleTiles(viewport);
console.log('visible tiles:', visible);

const chunks = tileMap.getVisibleChunks(viewport);
console.log('visible chunks:', chunks);
