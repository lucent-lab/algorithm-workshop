import { worley } from '../src/index.js';

const field = worley({ width: 10, height: 10, points: 12, seed: 23 });

console.table(
  field.map((row) => row.map((value) => Number(value.toFixed(2))))
);
