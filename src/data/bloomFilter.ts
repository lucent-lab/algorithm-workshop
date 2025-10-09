/**
 * Bloom filter with double hashing (Kirsch–Mitzenmacher optimisation).
 * Useful for: probabilistic membership checks with no false negatives.
 */
export interface BloomFilterOptions {
  /** Total number of bits in the filter (m). */
  size: number;
  /** Number of hash functions (k). */
  hashes: number;
  /** Optional seed for hashing. */
  seed?: number;
}

export class BloomFilter {
  private bits: Uint8Array;
  private m: number;
  private k: number;
  private seed: number;

  constructor(options: BloomFilterOptions) {
    const { size, hashes, seed = 0x9e3779b1 } = options;
    if (size <= 0 || !Number.isFinite(size)) throw new Error('Invalid bloom size');
    if (hashes <= 0 || !Number.isFinite(hashes)) throw new Error('Invalid hash count');
    this.m = size | 0;
    this.k = hashes | 0;
    this.seed = seed | 0;
    this.bits = new Uint8Array(Math.ceil(this.m / 8));
  }

  /** Adds a value to the filter. */
  add(value: string | number | Uint8Array): void {
    const { h1, h2 } = this.doubleHash(value);
    for (let i = 0; i < this.k; i += 1) {
      const idx = this.indexFor(h1, h2, i);
      this.setBit(idx);
    }
  }

  /** Checks if a value may be in the set (no false negatives). */
  has(value: string | number | Uint8Array): boolean {
    const { h1, h2 } = this.doubleHash(value);
    for (let i = 0; i < this.k; i += 1) {
      const idx = this.indexFor(h1, h2, i);
      if (!this.getBit(idx)) return false;
    }
    return true;
  }

  /** Creates a Bloom filter sized for the given capacity and error rate. */
  static fromCapacity(capacity: number, errorRate = 0.01, seed?: number): BloomFilter {
    if (capacity <= 0) throw new Error('Capacity must be > 0');
    if (!(errorRate > 0 && errorRate < 1)) throw new Error('Error rate must be in (0,1)');
    const ln2 = Math.log(2);
    const m = Math.ceil(-(capacity * Math.log(errorRate)) / (ln2 * ln2));
    const k = Math.max(1, Math.round((m / capacity) * ln2));
    return new BloomFilter({ size: m, hashes: k, seed });
  }

  // ---- internals ----
  private indexFor(h1: number, h2: number, i: number): number {
    // (h1 + i*h2) % m with unsigned wrapping
    const x = (h1 + Math.imul(i, h2)) >>> 0;
    return x % this.m;
  }

  private setBit(idx: number): void {
    const byte = idx >> 3;
    const mask = 1 << (idx & 7);
    this.bits[byte] |= mask;
  }

  private getBit(idx: number): boolean {
    const byte = idx >> 3;
    const mask = 1 << (idx & 7);
    return (this.bits[byte] & mask) !== 0;
  }

  private doubleHash(value: string | number | Uint8Array): { h1: number; h2: number } {
    const bytes = toBytes(value);
    // Two 32-bit hashes derived from FNV-1a mixed with seed
    const h1 = fnv1a(bytes, this.seed);
    const h2 = fnv1a(bytes, h1 ^ 0x85ebca6b);
    // Ensure non-zero step to avoid repeating same position
    return { h1, h2: (h2 | 1) >>> 0 };
  }
}

function toBytes(value: string | number | Uint8Array): Uint8Array {
  if (typeof value === 'string') {
    return new TextEncoder().encode(value);
  }
  if (typeof value === 'number') {
    const v = new DataView(new ArrayBuffer(8));
    v.setFloat64(0, value, true);
    return new Uint8Array(v.buffer);
  }
  return value;
}

// FNV-1a 32-bit
function fnv1a(data: Uint8Array, seed = 0): number {
  let hash = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < data.length; i += 1) {
    hash ^= data[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export const __internals = { fnv1a };
