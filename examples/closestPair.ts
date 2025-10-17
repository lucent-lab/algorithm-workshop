import { closestPair } from '../src/index.js';

const points = [
  { x: 0, y: 0 },
  { x: 5, y: 4 },
  { x: 1.25, y: 1.25 },
  { x: 2, y: 2 },
];

const result = closestPair(points);
console.log(result.distance);
console.log(result.pair);
