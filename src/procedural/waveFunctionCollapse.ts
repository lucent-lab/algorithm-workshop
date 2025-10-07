import type { Vector2D } from '../types.js';

const EPSILON = 1e-6;

const DIRECTIONS = [
  { key: 'top', opposite: 'bottom', dx: 0, dy: -1 },
  { key: 'right', opposite: 'left', dx: 1, dy: 0 },
  { key: 'bottom', opposite: 'top', dx: 0, dy: 1 },
  { key: 'left', opposite: 'right', dx: -1, dy: 0 },
] as const;

export interface WfcTile {
  id: string;
  weight?: number;
  rules: Partial<Record<'top' | 'right' | 'bottom' | 'left', string[]>>;
}

export interface WaveFunctionCollapseOptions {
  width: number;
  height: number;
  tiles: ReadonlyArray<WfcTile>;
  seed?: number;
  maxRetries?: number;
}

export type WaveFunctionCollapseResult = string[][];

/**
 * Wave Function Collapse (WFC) synthesiser for constraint-based tile grids.
 * Useful for: modular level layouts, texture assembly, decorative tiling.
 *
 * @param options - Configuration containing grid size, tile definitions, and optional seed.
 * @returns A 2D array of tile identifiers respecting adjacency rules.
 *
 * @example
 * import { waveFunctionCollapse } from 'llm-algorithms';
 *
 * const tiles = [
 *   {
 *     id: 'grass',
 *     weight: 3,
 *     rules: {
 *       top: ['grass'],
 *       right: ['grass', 'road'],
 *       bottom: ['grass'],
 *       left: ['grass', 'road'],
 *     },
 *   },
 *   {
 *     id: 'road',
 *     weight: 1,
 *     rules: {
 *       top: ['grass', 'road'],
 *       right: ['grass', 'road'],
 *       bottom: ['grass', 'road'],
 *       left: ['grass', 'road'],
 *     },
 *   },
 * ];
 *
 * const grid = waveFunctionCollapse({ width: 4, height: 4, tiles, seed: 42 });
 * console.log(grid.map((row) => row.join(' ')).join('\n'));
 *
 * @example
 * import { waveFunctionCollapse } from 'llm-algorithms';
 *
 * const tiles = [
 *   { id: 'A', rules: { top: ['A', 'B'], right: ['A'], bottom: ['A', 'B'], left: ['A', 'B'] } },
 *   { id: 'B', rules: { top: ['A', 'B'], right: ['B'], bottom: ['A', 'B'], left: ['A', 'B'] } },
 * ];
 *
 * const pattern = waveFunctionCollapse({ width: 3, height: 3, tiles, seed: 7 });
 * pattern.forEach((row) => console.log(row));
 */
export function waveFunctionCollapse(options: WaveFunctionCollapseOptions): WaveFunctionCollapseResult {
  validateOptions(options);
  const { width, height, tiles, seed = Date.now(), maxRetries = 5 } = options;

  const rng = createRng(seed);
  const compat = buildCompatibility(tiles);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const result = collapse(width, height, tiles, compat, rng.nextUInt32());
    if (result) {
      return result;
    }
  }

  throw new Error('Wave Function Collapse failed to find a solution. Consider relaxing constraints or increasing maxRetries.');
}

function collapse(
  width: number,
  height: number,
  tiles: ReadonlyArray<WfcTile>,
  compat: Compatibility,
  seed: number
): WaveFunctionCollapseResult | null {
  const rng = createRng(seed);
  const cellCount = width * height;
  const allTileIndices = tiles.map((_, index) => index);
  const possibilities: number[][] = Array.from({ length: cellCount }, () => [...allTileIndices]);
  const queue: number[] = [];

  let cellIndex = chooseCellWithLowestEntropy(possibilities, rng);
  while (cellIndex !== null) {
    const collapsed = collapseCell(cellIndex, possibilities, tiles, rng);
    if (!collapsed) {
      return null;
    }

    queue.push(cellIndex);
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) {
        continue;
      }
      const { x, y } = indexToCoord(current, width);
      const currentOptions = possibilities[current];

      for (const dir of DIRECTIONS) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          continue;
        }
        const neighborIndex = coordToIndex(nx, ny, width);
        const neighborOptions = possibilities[neighborIndex];
        const allowed = permittedNeighborTiles(currentOptions, compat, dir.key);
        const filtered = neighborOptions.filter((tileIndex) => allowed.has(tileIndex));
        if (filtered.length === 0) {
          return null;
        }
        if (filtered.length !== neighborOptions.length) {
          possibilities[neighborIndex] = filtered;
          queue.push(neighborIndex);
        }
      }
    }

    cellIndex = chooseCellWithLowestEntropy(possibilities, rng);
  }

  const grid: string[][] = [];
  for (let y = 0; y < height; y += 1) {
    const row: string[] = [];
    for (let x = 0; x < width; x += 1) {
      const options = possibilities[coordToIndex(x, y, width)];
      if (options.length !== 1) {
        return null;
      }
      const tile = tiles[options[0]];
      if (!tile) {
        return null;
      }
      row.push(tile.id);
    }
    grid.push(row);
  }
  return grid;
}

function collapseCell(
  cellIndex: number,
  possibilities: number[][],
  tiles: ReadonlyArray<WfcTile>,
  rng: Rng
): boolean {
  const options = possibilities[cellIndex];
  if (!options) {
    return false;
  }
  if (options.length === 0) {
    return false;
  }
  if (options.length === 1) {
    return true;
  }

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
  const normalizedWeights: number[] = [];
  let totalWeight = 0;
  for (let optIndex = 0; optIndex < options.length; optIndex += 1) {
    const tileIndex = options[optIndex];
    let normalizedWeight = EPSILON;
    if (tileIndex >= 0 && tileIndex < tiles.length) {
      const tile = tiles.at(tileIndex);
      const weight = tile?.weight ?? 1;
      normalizedWeight = weight < EPSILON ? EPSILON : weight;
    }
    normalizedWeights.push(normalizedWeight);
    totalWeight += normalizedWeight;
  }

  let threshold = rng.next() * totalWeight;
  for (let optIndex = 0; optIndex < options.length; optIndex += 1) {
    threshold -= normalizedWeights[optIndex];
    if (threshold <= 0) {
      possibilities[cellIndex] = [options[optIndex]];
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
      return true;
    }
  }

  possibilities[cellIndex] = [options[0]];
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
  return true;
}

function permittedNeighborTiles(currentOptions: number[], compat: Compatibility, direction: DirectionKey): Set<number> {
  const permitted = new Set<number>();
  const neighborSets =
    direction === 'top'
      ? compat.top
      : direction === 'right'
      ? compat.right
      : direction === 'bottom'
      ? compat.bottom
      : compat.left;
  for (const tileIndex of currentOptions) {
    const allowed = neighborSets.at(tileIndex);
    if (!allowed) {
      continue;
    }
    for (const neighborIndex of allowed) {
      permitted.add(neighborIndex);
    }
  }
  return permitted;
}

function chooseCellWithLowestEntropy(possibilities: number[][], rng: Rng): number | null {
  let bestIndex: number | null = null;
  let bestEntropy = Number.POSITIVE_INFINITY;
  let ties: number[] = [];

  for (let index = 0; index < possibilities.length; index += 1) {
    const count = possibilities[index].length;
    if (count <= 1) {
      continue;
    }
    if (count < bestEntropy) {
      bestEntropy = count;
      bestIndex = index;
      ties = [index];
    } else if (count === bestEntropy) {
      ties.push(index);
    }
  }

  if (bestIndex === null) {
    return null;
  }
  if (ties.length > 1) {
    return ties[Math.floor(rng.next() * ties.length)];
  }
  return bestIndex;
}

function buildCompatibility(tiles: ReadonlyArray<WfcTile>): Compatibility {
  const tileCount = tiles.length;
  const allIndices = tiles.map((_, index) => index);
  const allowAll = new Set(allIndices);

  const compat: Compatibility = {
    top: Array.from({ length: tileCount }, () => new Set<number>(allIndices)),
    right: Array.from({ length: tileCount }, () => new Set<number>(allIndices)),
    bottom: Array.from({ length: tileCount }, () => new Set<number>(allIndices)),
    left: Array.from({ length: tileCount }, () => new Set<number>(allIndices)),
  };

  const idToIndex = new Map<string, number>();
  tiles.forEach((tile, index) => {
    idToIndex.set(tile.id, index);
  });

  for (let i = 0; i < tileCount; i += 1) {
    const tile = tiles[i];
    if (!tile) {
      continue;
    }
    for (const dir of DIRECTIONS) {
      const rule = tile.rules?.[dir.key as keyof typeof tile.rules];
      if (!rule) {
        compat[dir.key][i] = new Set(allowAll);
        continue;
      }
      const allowedSet = new Set<number>();
      for (const id of rule) {
        const idx = idToIndex.get(id);
        if (idx !== undefined) {
          allowedSet.add(idx);
        }
      }
      compat[dir.key][i] = allowedSet.size > 0 ? allowedSet : new Set(allowAll);
    }
  }

  return compat;
}

function validateOptions(options: WaveFunctionCollapseOptions): void {
  if (!Number.isInteger(options.width) || options.width <= 0) {
    throw new RangeError('width must be a positive integer');
  }
  if (!Number.isInteger(options.height) || options.height <= 0) {
    throw new RangeError('height must be a positive integer');
  }
  if (!Array.isArray(options.tiles) || options.tiles.length === 0) {
    throw new TypeError('tiles must be a non-empty array');
  }
}

function coordToIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

function indexToCoord(index: number, width: number): Vector2D {
  const x = index % width;
  const y = Math.floor(index / width);
  return { x, y };
}

interface Compatibility {
  top: Array<Set<number>>;
  right: Array<Set<number>>;
  bottom: Array<Set<number>>;
  left: Array<Set<number>>;
}

type DirectionKey = keyof Compatibility;

interface Rng {
  next(): number;
  nextUInt32(): number;
}

function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next(): number {
      return random();
    },
    nextUInt32(): number {
      return Math.floor(random() * 0xffffffff);
    },
  };
}
