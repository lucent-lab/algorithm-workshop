import { computeFlowField } from '../src/index.js';

const grid = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const { flow, cost } = computeFlowField({ grid, goal: { x: 3, y: 3 } });
console.log('Integration cost map:');
console.log(cost.map((row) => row.map((value) => value.toFixed(1)).join(' ')).join('\n'));
console.log('\nFlow vectors:');
console.log(flow.map((row) => row.map(({ x, y }) => `(${x.toFixed(2)},${y.toFixed(2)})`).join(' ')).join('\n'));
