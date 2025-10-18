import type { Matrix3x3 } from '../../types.js';

export interface ContactBlock {
  constraintId: string;
  matrix: Matrix3x3;
}

export interface ContactAssemblyInput {
  contactId: string;
  blocks: ReadonlyArray<ContactBlock>;
}

export interface CachedAssembly {
  readonly contactId: string;
  readonly baseIndices: number[];
}

export interface MatrixAssemblyOptions {
  size?: number;
  symmetry?: boolean;
}

export interface MatrixAssemblyResult {
  matrix: number[][];
  cache: CachedAssembly[];
}

export function assembleContactMatrix(
  entries: ReadonlyArray<ContactAssemblyInput>,
  options: MatrixAssemblyOptions = {}
): MatrixAssemblyResult {
  const allocator = new IndexAllocator(options.size);
  const symmetry = options.symmetry ?? true;
  const cache: CachedAssembly[] = [];

  for (const entry of entries) {
    if (!entry || typeof entry.contactId !== 'string') {
      continue;
    }

    const baseIndices: number[] = [];
    for (const block of entry.blocks ?? []) {
      const baseIndex = allocator.allocate(block);
      baseIndices.push(baseIndex);
      insertBlock(allocator.matrix, block.matrix, baseIndex, symmetry);
    }

    cache.push({ contactId: entry.contactId, baseIndices });
  }

  const matrix = allocator.finalise();
  return { matrix, cache };
}

class IndexAllocator {
  public readonly matrix: number[][];
  private readonly assignments = new Map<string, { index: number; size: number }>();
  private cursor = 0;
  private readonly size: number;

  constructor(sizeOverride?: number) {
    this.size = sizeOverride ?? 0;
    this.matrix = createZeroMatrix(this.size);
  }

  allocate(block: ContactBlock): number {
    if (!block || typeof block.constraintId !== 'string') {
      throw new TypeError('Each block must have a constraintId.');
    }
    const existing = this.assignments.get(block.constraintId);
    const blockSize = block.matrix.length;

    if (existing) {
      if (existing.size !== blockSize) {
        throw new Error(`Mismatched block size for constraint ${block.constraintId}.`);
      }
      return existing.index;
    }

    this.ensureCapacity(this.cursor + blockSize);
    const index = this.cursor;
    this.assignments.set(block.constraintId, { index, size: blockSize });
    this.cursor += blockSize;
    return index;
  }

  private ensureCapacity(required: number): void {
    if (required <= this.matrix.length) {
      return;
    }
    const newSize = Math.max(required, this.matrix.length * 2 || required);
    resizeMatrix(this.matrix, newSize);
  }

  finalise(): number[][] {
    const targetSize = this.size || this.cursor;
    const finalSize = Math.max(targetSize, this.cursor);
    resizeMatrix(this.matrix, finalSize);
    return this.matrix.slice(0, finalSize).map((row) => row.slice(0, finalSize));
  }
}

function insertBlock(matrix: number[][], block: Matrix3x3, baseIndex: number, symmetry: boolean): void {
  for (let i = 0; i < block.length; i += 1) {
    const row = block[i];
    if (!row) continue;
    const rowIndex = baseIndex + i;
    const targetRow = matrix[rowIndex];
    if (!targetRow) continue;

    for (let j = 0; j < row.length; j += 1) {
      const value = row[j] ?? 0;
      if (value === 0) continue;
      const colIndex = baseIndex + j;
      const targetColRow = matrix[colIndex];
      targetRow[colIndex] = (targetRow[colIndex] ?? 0) + value;
      if (symmetry && rowIndex !== colIndex && targetColRow) {
        targetColRow[rowIndex] = (targetColRow[rowIndex] ?? 0) + value;
      }
    }
  }
}

function createZeroMatrix(size: number): number[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

function resizeMatrix(matrix: number[][], newSize: number): void {
  const current = matrix.length;
  for (let i = 0; i < current; i += 1) {
    const row = matrix[i];
    row.length = newSize;
    for (let j = current; j < newSize; j += 1) {
      row[j] = 0;
    }
  }
  for (let i = current; i < newSize; i += 1) {
    matrix.push(Array.from({ length: newSize }, () => 0));
  }
}
