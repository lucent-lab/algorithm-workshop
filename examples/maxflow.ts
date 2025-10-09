import { computeMaximumFlowDinic } from '../src/index.js';

const nodes = ['S', 'A', 'B', 'T'];
const edges = [
  { source: 'S', target: 'A', capacity: 10 },
  { source: 'S', target: 'B', capacity: 5 },
  { source: 'A', target: 'B', capacity: 15 },
  { source: 'A', target: 'T', capacity: 10 },
  { source: 'B', target: 'T', capacity: 10 },
];

const result = computeMaximumFlowDinic({ nodes, edges, source: 'S', sink: 'T' });
console.log('MaxFlow:', result.maxFlow);
console.log('Flows:', result.flows);

