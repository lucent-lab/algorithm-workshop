import { SegmentTree } from '../src/index.js';

// Range sum segment tree
const st = new SegmentTree<number>({ values: [1, 3, 5, 7, 9, 11] });
console.log('sum(0..2)=', st.query(0, 2));
st.update(3, 10);
console.log('sum(2..5)=', st.query(2, 5));

// Range min tree
const minTree = new SegmentTree<number>({
  values: [5, 2, 7, 3, 9],
  combine: (a, b) => Math.min(a, b),
  identity: Number.POSITIVE_INFINITY,
});
console.log('min(1..3)=', minTree.query(1, 3));

