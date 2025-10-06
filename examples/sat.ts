import { satCollision } from '../src/index.js';

const squareA = [
  { x: 0, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 2 },
  { x: 0, y: 2 },
];

const squareB = [
  { x: 1.5, y: 1.5 },
  { x: 3.5, y: 1.5 },
  { x: 3.5, y: 3.5 },
  { x: 1.5, y: 3.5 },
];

const result = satCollision(squareA, squareB);
console.log('Collision result:', result);
