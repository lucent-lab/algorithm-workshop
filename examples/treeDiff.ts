import { applyTreeDiff, diffTree } from '../src/index.js';

const previous = [
  {
    id: 'root',
    value: { label: 'Root' },
    children: [
      { id: 'a', value: { label: 'A' }, children: [{ id: 'a-1', value: { label: 'A-1' } }] },
      { id: 'b', value: { label: 'B' } },
    ],
  },
];

const next = [
  {
    id: 'root',
    value: { label: 'Root (updated)' },
    children: [
      { id: 'b', value: { label: 'B' } },
      {
        id: 'wrapper',
        value: { label: 'Wrapper' },
        children: [{ id: 'a', value: { label: 'A', active: true }, children: [] }],
      },
      { id: 'c', value: { label: 'C' } },
    ],
  },
];

const diff = diffTree(previous, next);
console.log('Tree diff operations:', diff);

const patched = applyTreeDiff(previous, diff);
console.log('Patched tree:', JSON.stringify(patched, null, 2));
