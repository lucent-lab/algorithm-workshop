import { generateKruskalMaze } from '../src/index.js';

const { grid, start, end } = generateKruskalMaze({
  width: 21,
  height: 21,
  seed: 777,
});

console.log('Start:', start);
console.log('End:', end);
console.log('Sample row:', grid[10]?.join(''));
