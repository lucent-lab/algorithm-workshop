import { generatePrimMaze } from '../src/index.js';

const { grid, start, end } = generatePrimMaze({
  width: 21,
  height: 21,
  seed: 512,
});

console.log('Start:', start);
console.log('End:', end);
console.log('Middle row preview:', grid[10]?.join(''));
