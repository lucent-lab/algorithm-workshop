export interface SkipListOptions<T> {
  compare?: (a: T, b: T) => number;
  p?: number; // probability to raise level
  maxLevel?: number;
  seed?: number;
}

class SLNode<T> {
  value: T | null;
  next: Array<SLNode<T> | null>;
  constructor(level: number, value: T | null) {
    this.value = value;
    this.next = new Array<SLNode<T> | null>(level + 1).fill(null);
  }
}

/**
 * Deterministic skip list with seeded RNG (Xorshift32).
 * Supports insert, has, and remove in expected O(log n).
 */
export class SkipList<T> {
  private head: SLNode<T>;
  private level = 0;
  private compare: (a: T, b: T) => number;
  private p: number;
  private maxLevel: number;
  private state: number;

  constructor(options: SkipListOptions<T> = {}) {
    const defaultCompare = ((a: T, b: T) => {
      const av = a as unknown as number | string;
      const bv = b as unknown as number | string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      return av < bv ? -1 : av > bv ? 1 : 0;
    }) as (a: T, b: T) => number;
    this.compare = options.compare ?? defaultCompare;
    this.p = options.p ?? 0.5;
    this.maxLevel = options.maxLevel ?? 16;
    this.state = options.seed ?? 0x12345678;
    this.head = new SLNode<T>(this.maxLevel, null);
  }

  has(value: T): boolean {
    let x = this.head;
    for (let i = this.level; i >= 0; i -= 1) {
      let nxt = x.next[i];
      while (nxt && this.compare(nxt.value as T, value) < 0) { x = nxt; nxt = x.next[i]; }
    }
    const y = x.next[0];
    return !!(y && this.compare(y.value as T, value) === 0);
  }

  insert(value: T): void {
    const update = new Array<SLNode<T>>(this.maxLevel + 1);
    let x = this.head;
    for (let i = this.level; i >= 0; i -= 1) {
      let nxt = x.next[i];
      while (nxt && this.compare(nxt.value as T, value) < 0) { x = nxt; nxt = x.next[i]; }
      update[i] = x;
    }
    const y = x.next[0];
    if (y && this.compare(y.value as T, value) === 0) {
      // replace value
      y.value = value;
      return;
    }
    const lvl = this.randomLevel();
    if (lvl > this.level) {
      for (let i = this.level + 1; i <= lvl; i += 1) update[i] = this.head;
      this.level = lvl;
    }
    const node = new SLNode<T>(lvl, value);
    for (let i = 0; i <= lvl; i += 1) {
      node.next[i] = update[i].next[i];
      update[i].next[i] = node;
    }
  }

  remove(value: T): boolean {
    const update = new Array<SLNode<T>>(this.maxLevel + 1);
    let x = this.head;
    for (let i = this.level; i >= 0; i -= 1) {
      let nxt = x.next[i];
      while (nxt && this.compare(nxt.value as T, value) < 0) { x = nxt; nxt = x.next[i]; }
      update[i] = x;
    }
    const y = x.next[0];
    if (!y || this.compare(y.value as T, value) !== 0) return false;
    for (let i = 0; i <= this.level; i += 1) {
      if (update[i].next[i] !== y) break;
      update[i].next[i] = y.next[i];
    }
    while (this.level > 0 && !this.head.next[this.level]) this.level -= 1;
    return true;
  }

  // Iterate in-order
  *values(): IterableIterator<T> {
    let x = this.head.next[0];
    while (x) { yield x.value as T; x = x.next[0]; }
  }

  private randomLevel(): number {
    let lvl = 0;
    while (lvl < this.maxLevel && this.random() < this.p) lvl += 1;
    return lvl;
  }

  private random(): number {
    // Xorshift32
    let x = this.state | 0;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.state = x | 0;
    // map to [0,1)
    return ((x >>> 0) / 0xffffffff);
  }
}
