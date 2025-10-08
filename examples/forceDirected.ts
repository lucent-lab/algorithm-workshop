import { computeForceDirectedLayout } from '../src/index.js';

const nodes = [
  { id: 'A' },
  { id: 'B' },
  { id: 'C' },
  { id: 'D' },
  { id: 'E' },
];

const edges = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' },
  { source: 'D', target: 'E' },
  { source: 'E', target: 'A' },
  { source: 'A', target: 'C' },
];

const layout = computeForceDirectedLayout({
  nodes,
  edges,
  width: 400,
  height: 400,
  iterations: 200,
});

console.log('Computed layout:', layout.nodes);
