import { computeMarchingSquares } from '../src/index.js';

const field = [
  [0, 0, 0, 0],
  [0, 0.8, 0.6, 0],
  [0, 0.4, 0.9, 0],
  [0, 0, 0, 0],
];

const { segments } = computeMarchingSquares({ field, threshold: 0.5 });

console.log('Segments:', segments);
