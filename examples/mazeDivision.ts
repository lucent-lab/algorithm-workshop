import { generateRecursiveDivisionMaze } from '../src/index.js';

const { grid, start, end } = generateRecursiveDivisionMaze({
  width: 21,
  height: 21,
  seed: 2025,
});

console.log('Start:', start);
console.log('End:', end);
console.log('Sample row:', grid[10]?.join(''));
