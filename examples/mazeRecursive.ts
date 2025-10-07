import { generateRecursiveMaze } from '../src/index.js';

const { grid, start, end } = generateRecursiveMaze({
  width: 21,
  height: 21,
  seed: 314,
});

console.log('Start:', start);
console.log('End:', end);
console.log('Row preview:', grid[10]?.join(''));
