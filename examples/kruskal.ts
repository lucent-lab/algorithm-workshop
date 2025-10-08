import { computeMinimumSpanningTree } from '../src/index.js';

const nodes = ['A', 'B', 'C', 'D', 'E'];
const edges = [
  { source: 'A', target: 'B', weight: 2 },
  { source: 'A', target: 'C', weight: 3 },
  { source: 'B', target: 'C', weight: 1 },
  { source: 'B', target: 'D', weight: 4 },
  { source: 'C', target: 'D', weight: 5 },
  { source: 'C', target: 'E', weight: 6 },
  { source: 'D', target: 'E', weight: 7 },
];

const mst = computeMinimumSpanningTree({ nodes, edges });
console.log('MST weight:', mst.totalWeight);
console.log('Edges:', mst.edges);
