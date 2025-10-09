/**
 * Disjoint Set Union (Union-Find) with path compression and union by size.
 * Useful for: connectivity queries, Kruskal MST, clustering.
 */
export class UnionFind<T = number> {
  private parent = new Map<T, T>();
  private compSize = new Map<T, number>();

  constructor(elements?: Iterable<T>) {
    if (elements) {
      for (const el of elements) {
        this.makeSet(el);
      }
    }
  }

  makeSet(x: T): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.compSize.set(x, 1);
    }
  }

  find(x: T): T {
    if (!this.parent.has(x)) this.makeSet(x);
    const direct = this.parent.get(x);
    let p: T = direct === undefined ? x : (direct as T);
    if (p !== x) {
      p = this.find(p);
      this.parent.set(x, p);
    }
    return p;
  }

  union(a: T, b: T): boolean {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    const sa = this.compSize.get(ra)!;
    const sb = this.compSize.get(rb)!;
    if (sa < sb) {
      const tmp = ra;
      ra = rb;
      rb = tmp;
    }
    // attach rb under ra
    this.parent.set(rb, ra);
    this.compSize.set(ra, sa + sb);
    this.compSize.delete(rb);
    return true;
  }

  connected(a: T, b: T): boolean {
    return this.find(a) === this.find(b);
  }

  size(x: T): number {
    return this.compSize.get(this.find(x)) ?? 1;
  }
}
