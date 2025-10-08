export interface ScalarField {
  data: ReadonlyArray<ReadonlyArray<number>>;
  cellSize?: number;
}

export interface MarchingSquaresOptions {
  field: ScalarField | ReadonlyArray<ReadonlyArray<number>>;
  threshold?: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface LineSegment {
  start: Point2D;
  end: Point2D;
}

export interface MarchingSquaresResult {
  segments: LineSegment[];
}

const CASE_TABLE: ReadonlyArray<ReadonlyArray<[number, number]>> = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[0, 1]],
  [[0, 3], [2, 1]],
  [[0, 2]],
  [[3, 0]],
  [[0, 3]],
  [[0, 2]],
  [[0, 1], [2, 3]],
  [[0, 1]],
  [[3, 1]],
  [[2, 1]],
  [[3, 2]],
  [],
];

export function computeMarchingSquares(options: MarchingSquaresOptions): MarchingSquaresResult {
  const { grid, cellSize } = normalizeField(options.field);
  validateGrid(grid);

  const threshold = options.threshold ?? 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const segments: LineSegment[] = [];

  for (let y = 0; y < rows - 1; y += 1) {
    for (let x = 0; x < cols - 1; x += 1) {
      const tl = grid[y][x];
      const tr = grid[y][x + 1];
      const bl = grid[y + 1][x];
      const br = grid[y + 1][x + 1];

      let caseIndex = 0;
      if (tl >= threshold) {
        caseIndex |= 8;
      }
      if (tr >= threshold) {
        caseIndex |= 4;
      }
      if (br >= threshold) {
        caseIndex |= 2;
      }
      if (bl >= threshold) {
        caseIndex |= 1;
      }

      const configurations = CASE_TABLE[caseIndex];
      if (configurations.length === 0) {
        continue;
      }

      for (const [edgeA, edgeB] of configurations) {
        const start = interpolateEdge(x, y, edgeA, tl, tr, br, bl, threshold, cellSize);
        const end = interpolateEdge(x, y, edgeB, tl, tr, br, bl, threshold, cellSize);
        segments.push({ start, end });
      }
    }
  }

  return { segments };
}

function interpolateEdge(
  cellX: number,
  cellY: number,
  edgeIndex: number,
  tl: number,
  tr: number,
  br: number,
  bl: number,
  threshold: number,
  cellSize: number
): Point2D {
  const x0 = cellX * cellSize;
  const x1 = (cellX + 1) * cellSize;
  const y0 = cellY * cellSize;
  const y1 = (cellY + 1) * cellSize;

  switch (edgeIndex) {
    case 0: {
      const t = interpolate(tl, tr, threshold);
      return { x: lerp(x0, x1, t), y: y0 };
    }
    case 1: {
      const t = interpolate(tr, br, threshold);
      return { x: x1, y: lerp(y0, y1, t) };
    }
    case 2: {
      const t = interpolate(br, bl, threshold);
      return { x: lerp(x1, x0, t), y: y1 };
    }
    case 3: {
      const t = interpolate(bl, tl, threshold);
      return { x: x0, y: lerp(y1, y0, t) };
    }
    default:
      throw new Error(`Unknown edge index: ${edgeIndex}`);
  }
}

function interpolate(v1: number, v2: number, threshold: number): number {
  const denom = v2 - v1;
  if (Math.abs(denom) < 1e-12) {
    return 0.5;
  }
  return clamp((threshold - v1) / denom, 0, 1);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

type Grid = ReadonlyArray<ReadonlyArray<number>>;

function normalizeField(field: ScalarField | Grid): {
  grid: Grid;
  cellSize: number;
} {
  if (isGrid(field)) {
    return { grid: field, cellSize: 1 };
  }
  return { grid: field.data, cellSize: field.cellSize ?? 1 };
}

function isGrid(field: ScalarField | Grid): field is Grid {
  return Array.isArray(field);
}

function validateGrid(grid: Grid): void {
  if (grid.length < 2) {
    throw new Error('field must contain at least two rows.');
  }
  const firstRow = grid[0];
  if (!Array.isArray(firstRow) || firstRow.length < 2) {
    throw new Error('field must contain rows with at least two columns.');
  }
  const width = firstRow.length;
  for (let i = 1; i < grid.length; i += 1) {
    if (grid[i].length !== width) {
      throw new Error('field rows must all have the same length.');
    }
  }
}
