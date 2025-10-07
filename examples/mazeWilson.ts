import { generateWilsonMaze } from '../src/index.js';

const { grid, start, end } = generateWilsonMaze({
  width: 21,
  height: 21,
  seed: 1024,
});

console.log('Start:', start);
console.log('End:', end);
console.log('Row preview:', grid[10]?.join(''));
