import { buildCondensationGraph, computeStronglyConnectedComponents } from '../src/index.js';

const graph = {
  A: [{ node: 'B' }],
  B: [{ node: 'C' }, { node: 'E' }],
  C: [{ node: 'A' }, { node: 'D' }],
  D: [{ node: 'E' }],
  E: [{ node: 'F' }],
  F: [{ node: 'D' }],
};

const { components } = computeStronglyConnectedComponents(graph);
console.log('SCCs:', components);

const dag = buildCondensationGraph(graph, components);
console.log('Condensation DAG:', dag);

