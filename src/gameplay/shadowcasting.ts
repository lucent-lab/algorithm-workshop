import type { TileMapController } from './tileMap.js';

export interface FovGrid {
  width: number;
  height: number;
  tiles: ReadonlyArray<boolean>;
}

export interface FovResult {
  visible: Set<string>;
  isVisible(x: number, y: number): boolean;
}

export interface ShadowcastOptions {
  radius: number;
  transparent: (x: number, y: number) => boolean;
  reveal?: (x: number, y: number) => void;
}

interface OctantTransform {
  xx: number;
  xy: number;
  yx: number;
  yy: number;
}

const OCTANTS: OctantTransform[] = [
  { xx: 1, xy: 0, yx: 0, yy: 1 },
  { xx: 0, xy: 1, yx: 1, yy: 0 },
  { xx: 0, xy: -1, yx: 1, yy: 0 },
  { xx: -1, xy: 0, yx: 0, yy: 1 },
  { xx: -1, xy: 0, yx: 0, yy: -1 },
  { xx: 0, xy: -1, yx: -1, yy: 0 },
  { xx: 0, xy: 1, yx: -1, yy: 0 },
  { xx: 1, xy: 0, yx: 0, yy: -1 },
];

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function encodeCoord(x: number, y: number): string {
  return `${x},${y}`;
}

function castLight(
  cx: number,
  cy: number,
  row: number,
  start: number,
  end: number,
  radius: number,
  octant: OctantTransform,
  transparent: (x: number, y: number) => boolean,
  reveal: (x: number, y: number) => void,
  visible: Set<string>
): void {
  if (start < end) {
    return;
  }

  const radiusSquared = radius * radius;
  let currentStart = start;

  for (let distance = row; distance <= radius; distance += 1) {
    let blocked = false;
    let newStart = currentStart;

    let deltaX = -distance - 1;
    const deltaY = -distance;

    while (deltaX <= 0) {
      deltaX += 1;
      const currentX = deltaX;
      const currentY = deltaY;

      const mapX = cx + currentX * octant.xx + currentY * octant.xy;
      const mapY = cy + currentX * octant.yx + currentY * octant.yy;

      const leftSlope = (currentX - 0.5) / (currentY + 0.5);
      const rightSlope = (currentX + 0.5) / (currentY - 0.5);

      if (rightSlope > currentStart) {
        continue;
      }
      if (leftSlope < end) {
        break;
      }

      if (currentX * currentX + currentY * currentY <= radiusSquared) {
        reveal(mapX, mapY);
        visible.add(encodeCoord(mapX, mapY));
      }

      const isOpaque = !transparent(mapX, mapY);
      if (blocked) {
        if (isOpaque) {
          newStart = rightSlope;
        } else {
          blocked = false;
          currentStart = newStart;
        }
      } else if (isOpaque && distance < radius) {
        blocked = true;
        castLight(
          cx,
          cy,
          distance + 1,
          newStart,
          leftSlope,
          radius,
          octant,
          transparent,
          reveal,
          visible
        );
        newStart = rightSlope;
      }
    }

    if (blocked) {
      break;
    }
  }
}

/**
 * Computes visible tiles using recursive shadowcasting.
 * Useful for: roguelike visibility, fog-of-war, and lighting probes.
 */
export function computeFieldOfView(
  originX: number,
  originY: number,
  options: ShadowcastOptions
): FovResult {
  assertFinite(originX, 'originX');
  assertFinite(originY, 'originY');
  assertFinite(options.radius, 'radius');
  if (options.radius <= 0) {
    throw new Error('radius must be greater than zero.');
  }
  if (typeof options.transparent !== 'function') {
    throw new Error('transparent must be a function.');
  }

  const radius = Math.floor(options.radius);
  const reveal = options.reveal ?? (() => {});
  const visible = new Set<string>();

  reveal(originX, originY);
  visible.add(encodeCoord(originX, originY));

  for (const octant of OCTANTS) {
    castLight(
      originX,
      originY,
      1,
      1,
      0,
      radius,
      octant,
      options.transparent,
      reveal,
      visible
    );
  }

  return {
    visible,
    isVisible(x: number, y: number) {
      return visible.has(encodeCoord(x, y));
    },
  };
}

/**
 * Helper to build a transparency callback from a boolean grid.
 */
export function transparentFromGrid(grid: FovGrid): (x: number, y: number) => boolean {
  assertPositiveDimensions(grid.width, grid.height);
  if (grid.tiles.length !== grid.width * grid.height) {
    throw new Error('grid tiles length must be width * height.');
  }
  return (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
      return false;
    }
    return Boolean(grid.tiles[y * grid.width + x]);
  };
}

function assertPositiveDimensions(width: number, height: number): void {
  assertPositiveInt(width, 'width');
  assertPositiveInt(height, 'height');
}

function assertPositiveInt(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

/**
 * Helper to build a transparency callback that defers to a tile map controller.
 */
export function transparentFromTileMap(
  map: TileMapController,
  layerName: string,
  passable: (tileId: number) => boolean
): (x: number, y: number) => boolean {
  if (!map) {
    throw new Error('tile map controller is required.');
  }
  if (typeof passable !== 'function') {
    throw new Error('passable must be a function.');
  }
  return (x: number, y: number) => {
    if (x < 0 || y < 0) {
      return false;
    }
    const tile = map.getTile(layerName, x, y);
    return passable(tile);
  };
}
