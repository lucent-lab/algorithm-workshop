import { generateAldousBroderMaze } from '../src/index.js';

const { grid, start, end } = generateAldousBroderMaze({
  width: 21,
  height: 21,
  seed: 2048,
});

console.log('Start:', start);
console.log('End:', end);
console.log('Middle row:', grid[10]?.join(''));
