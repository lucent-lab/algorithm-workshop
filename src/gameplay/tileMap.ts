import type { Vector2D } from '../types.js';

export interface TileMapLayer {
  name: string;
  data: ReadonlyArray<number>;
  collision?: ReadonlyArray<boolean>;
}

export interface TileMapOptions {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  layers: ReadonlyArray<TileMapLayer>;
  chunkWidth?: number;
  chunkHeight?: number;
}

export interface TileMapViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChunkCoordinate {
  cx: number;
  cy: number;
}

export interface VisibleTile {
  layer: string;
  tileIndex: number;
  tileId: number;
  mapX: number;
  mapY: number;
  worldX: number;
  worldY: number;
}

export interface TileMapController {
  getTile(layerName: string, x: number, y: number): number;
  setTile(layerName: string, x: number, y: number, tileId: number): void;
  isCollidable(x: number, y: number): boolean;
  getVisibleTiles(viewport: TileMapViewport): VisibleTile[];
  getVisibleChunks(viewport: TileMapViewport): ChunkCoordinate[];
  getChunkSize(): Vector2D;
}

interface NormalizedLayer {
  name: string;
  data: Uint32Array;
  collision?: boolean[];
}

interface InternalOptions {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  chunkWidth: number;
  chunkHeight: number;
  layers: NormalizedLayer[];
}

function assertPositiveInt(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function normalizeLayer(layer: TileMapLayer, width: number, height: number): NormalizedLayer {
  if (!layer || typeof layer.name !== 'string' || layer.name.length === 0) {
    throw new Error('layer.name must be a non-empty string.');
  }
  if (!Array.isArray(layer.data)) {
    throw new Error(`layer "${layer.name}" data must be an array.`);
  }
  if (layer.data.length !== width * height) {
    throw new Error(`layer "${layer.name}" data length must equal width * height.`);
  }

  const sourceData: ReadonlyArray<number> = layer.data;
  const data = new Uint32Array(width * height);
  for (let i = 0; i < sourceData.length; i += 1) {
    const value = sourceData[i];
    if (value === undefined || !Number.isInteger(value)) {
      throw new Error(`layer "${layer.name}" tile at index ${i} must be an integer.`);
    }
    data[i] = value;
  }

  let collision: boolean[] | undefined;
  if (layer.collision) {
    if (!Array.isArray(layer.collision) || layer.collision.length !== width * height) {
      throw new Error(`layer "${layer.name}" collision array must match map size.`);
    }
    collision = layer.collision.map((value) => Boolean(value));
  }

  return { name: layer.name, data, collision };
}

function normalizeOptions(options: TileMapOptions): InternalOptions {
  assertPositiveInt(options.width, 'width');
  assertPositiveInt(options.height, 'height');
  assertPositiveInt(options.tileWidth, 'tileWidth');
  assertPositiveInt(options.tileHeight, 'tileHeight');

  const chunkWidth = options.chunkWidth ?? 16;
  const chunkHeight = options.chunkHeight ?? 16;
  assertPositiveInt(chunkWidth, 'chunkWidth');
  assertPositiveInt(chunkHeight, 'chunkHeight');

  if (!Array.isArray(options.layers) || options.layers.length === 0) {
    throw new Error('layers must contain at least one layer.');
  }

  const layers: NormalizedLayer[] = options.layers.map((layer: TileMapLayer) =>
    normalizeLayer(layer, options.width, options.height)
  );

  return {
    width: options.width,
    height: options.height,
    tileWidth: options.tileWidth,
    tileHeight: options.tileHeight,
    chunkWidth,
    chunkHeight,
    layers,
  };
}

function toIndex(width: number, x: number, y: number): number {
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('tile coordinates must be integers.');
  }
  return y * width + x;
}

function clampToBounds(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function floorDivide(a: number, b: number): number {
  return Math.floor(a / b);
}

/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * Creates helpers for rendering tile maps in chunks with collision querying.
 */
export function createTileMapController(options: TileMapOptions): TileMapController {
  const config = normalizeOptions(options);

  const layerLookup: Record<string, NormalizedLayer> = {};
  for (const layer of config.layers) {
    if (layerLookup[layer.name]) {
      throw new Error(`Duplicate layer name: ${layer.name}`);
    }
    layerLookup[layer.name] = layer;
  }

  function assertInBounds(x: number, y: number): void {
    if (x < 0 || y < 0 || x >= config.width || y >= config.height) {
      throw new Error(`Tile coordinate (${x}, ${y}) out of bounds.`);
    }
  }

  function getLayer(name: string): NormalizedLayer {
    const layer = layerLookup[name];
    if (!layer) {
      throw new Error(`Unknown layer: ${name}`);
    }
    return layer;
  }

  function getTile(layerName: string, x: number, y: number): number {
    assertInBounds(x, y);
    const layer = getLayer(layerName);
    const index = toIndex(config.width, x, y);
    const tileId = Number(layer.data[index]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- tile data coerced to number.
    return tileId;
  }

  function setTile(layerName: string, x: number, y: number, tileId: number): void {
    assertInBounds(x, y);
    if (!Number.isInteger(tileId)) {
      throw new Error('tileId must be an integer.');
    }
    const layer = getLayer(layerName);
    layer.data[toIndex(config.width, x, y)] = tileId;
  }

  function isCollidable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= config.width || y >= config.height) {
      return false;
    }
    const index = toIndex(config.width, x, y);
    return config.layers.some((layer) => layer.collision?.[index]);
  }

  function getVisibleTiles(viewport: TileMapViewport): VisibleTile[] {
    assertFinite(viewport.x, 'viewport.x');
    assertFinite(viewport.y, 'viewport.y');
    assertFinite(viewport.width, 'viewport.width');
    assertFinite(viewport.height, 'viewport.height');
    if (viewport.width <= 0 || viewport.height <= 0) {
      throw new Error('viewport width/height must be positive.');
    }

    const startX = clampToBounds(Math.floor(viewport.x / config.tileWidth), 0, config.width - 1);
    const startY = clampToBounds(Math.floor(viewport.y / config.tileHeight), 0, config.height - 1);
    const endX = clampToBounds(Math.ceil((viewport.x + viewport.width) / config.tileWidth), 0, config.width);
    const endY = clampToBounds(Math.ceil((viewport.y + viewport.height) / config.tileHeight), 0, config.height);

    const visible: VisibleTile[] = [];

    for (const layer of config.layers) {
      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const index = toIndex(config.width, x, y);
          const tileId = layer.data[index];
          if (tileId === 0) {
            continue;
          }
          visible.push({
            layer: layer.name,
            tileIndex: index,
            tileId,
            mapX: x,
            mapY: y,
            worldX: x * config.tileWidth,
            worldY: y * config.tileHeight,
          });
        }
      }
    }

    return visible;
  }

  function getVisibleChunks(viewport: TileMapViewport): ChunkCoordinate[] {
    assertFinite(viewport.x, 'viewport.x');
    assertFinite(viewport.y, 'viewport.y');
    assertFinite(viewport.width, 'viewport.width');
    assertFinite(viewport.height, 'viewport.height');
    if (viewport.width <= 0 || viewport.height <= 0) {
      throw new Error('viewport width/height must be positive.');
    }

    const tileStartX = clampToBounds(Math.floor(viewport.x / config.tileWidth), 0, config.width - 1);
    const tileStartY = clampToBounds(Math.floor(viewport.y / config.tileHeight), 0, config.height - 1);
    const tileEndX = clampToBounds(Math.ceil((viewport.x + viewport.width) / config.tileWidth), 0, config.width);
    const tileEndY = clampToBounds(Math.ceil((viewport.y + viewport.height) / config.tileHeight), 0, config.height);

    const chunkStartX = floorDivide(tileStartX, config.chunkWidth);
    const chunkStartY = floorDivide(tileStartY, config.chunkHeight);
    const chunkEndX = floorDivide(Math.max(tileEndX - 1, tileStartX), config.chunkWidth);
    const chunkEndY = floorDivide(Math.max(tileEndY - 1, tileStartY), config.chunkHeight);

    const result: ChunkCoordinate[] = [];
    for (let cy = chunkStartY; cy <= chunkEndY; cy += 1) {
      for (let cx = chunkStartX; cx <= chunkEndX; cx += 1) {
        result.push({ cx, cy });
      }
    }
    return result;
  }

  function getChunkSize(): Vector2D {
    return { x: config.chunkWidth, y: config.chunkHeight };
  }

  return {
    getTile,
    setTile,
    isCollidable,
    getVisibleTiles,
    getVisibleChunks,
    getChunkSize,
  };
}

/* eslint-enable @typescript-eslint/no-unsafe-return */

/** @internal */
export const __internals = {
  normalizeOptions,
  normalizeLayer,
  toIndex,
};
