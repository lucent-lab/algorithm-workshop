/**
 * Segment tree for range queries with point updates.
 * Default operation is sum; can be customised with an associative combine.
 */
export interface SegmentTreeOptions<T> {
  values: ReadonlyArray<T>;
  combine?: (a: T, b: T) => T;
  identity?: T;
}

export class SegmentTree<T = number> {
  private n: number;
  private tree: T[];
  private combine: (a: T, b: T) => T;
  private identity: T;

  constructor(options: SegmentTreeOptions<T>) {
    const { values, combine, identity } = options;
    this.n = values.length;
    const defaultCombine = ((a: number, b: number) => a + b) as unknown as (a: T, b: T) => T;
    this.combine = combine ?? defaultCombine;
    this.identity = (identity as T) ?? ((0 as unknown as T));
    const size = 1 << (Math.ceil(Math.log2(Math.max(1, this.n))) + 1);
    this.tree = new Array<T>(size).fill(this.identity);
    if (this.n > 0) this.build(values, 1, 0, this.n - 1);
  }

  update(index: number, value: T): void {
    if (index < 0 || index >= this.n) throw new Error('Index out of bounds');
    this.updateRec(1, 0, this.n - 1, index, value);
  }

  query(left: number, right: number): T {
    if (left > right) return this.identity;
    left = Math.max(0, left);
    right = Math.min(this.n - 1, right);
    return this.queryRec(1, 0, this.n - 1, left, right);
  }

  private build(values: ReadonlyArray<T>, node: number, l: number, r: number) {
    if (l === r) {
      this.tree[node] = values[l];
      return;
    }
    const mid = (l + r) >> 1;
    this.build(values, node * 2, l, mid);
    this.build(values, node * 2 + 1, mid + 1, r);
    this.tree[node] = this.combine(this.tree[node * 2], this.tree[node * 2 + 1]);
  }

  private updateRec(node: number, l: number, r: number, idx: number, val: T) {
    if (l === r) { this.tree[node] = val; return; }
    const mid = (l + r) >> 1;
    if (idx <= mid) this.updateRec(node * 2, l, mid, idx, val);
    else this.updateRec(node * 2 + 1, mid + 1, r, idx, val);
    this.tree[node] = this.combine(this.tree[node * 2], this.tree[node * 2 + 1]);
  }

  private queryRec(node: number, l: number, r: number, ql: number, qr: number): T {
    if (ql <= l && r <= qr) return this.tree[node];
    const mid = (l + r) >> 1;
    let res = this.identity;
    if (ql <= mid) res = this.combine(res, this.queryRec(node * 2, l, mid, ql, qr));
    if (qr > mid) res = this.combine(res, this.queryRec(node * 2 + 1, mid + 1, r, ql, qr));
    return res;
  }
}
