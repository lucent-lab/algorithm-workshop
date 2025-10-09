/**
 * Minimal binary heap (priority queue) with custom comparator.
 * Useful for: A* / Dijkstra open sets, schedulers, simulation queues.
 */
export class BinaryHeap<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number, items?: Iterable<T>) {
    if (items) {
      for (const it of items) this.data.push(it);
      this.heapify();
    }
  }

  get size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(value: T): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {
    const n = this.data.length;
    if (n === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop() as T;
    if (n > 1) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  private heapify(): void {
    for (let i = Math.floor(this.data.length / 2) - 1; i >= 0; i -= 1) {
      this.bubbleDown(i);
    }
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[p]) < 0) {
        this.swap(i, p);
        i = p;
      } else {
        break;
      }
    }
  }

  private bubbleDown(i: number): void {
    const n = this.data.length;
    let idx = i;
    let moved = true;
    while (moved) {
      moved = false;
      const l = idx * 2 + 1;
      const r = l + 1;
      let smallest = idx;
      if (l < n && this.compare(this.data[l], this.data[smallest]) < 0) smallest = l;
      if (r < n && this.compare(this.data[r], this.data[smallest]) < 0) smallest = r;
      if (smallest !== idx) {
        this.swap(idx, smallest);
        idx = smallest;
        moved = true;
      }
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = tmp;
  }
}
