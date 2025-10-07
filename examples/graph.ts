import { graphBFS, graphDFS, topologicalSort } from '../src/index.js';

const graph = {
  A: [{ node: 'B' }, { node: 'C' }],
  B: [{ node: 'D' }],
  C: [{ node: 'D' }, { node: 'E' }],
  D: [{ node: 'F' }],
  E: [{ node: 'F' }],
  F: [],
};

const distances = Object.fromEntries(graphBFS(graph, 'A'));
console.log('BFS distances from A:', distances);

const dfsOrder: string[] = [];
graphDFS(graph, 'A', (node) => dfsOrder.push(node));
console.log('DFS order from A:', dfsOrder);

const dag = {
  clean: [{ node: 'build' }],
  build: [{ node: 'deploy' }],
  deploy: [],
};
console.log('Topological order:', topologicalSort(dag));
