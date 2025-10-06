import { astar, gridFromString, manhattanDistance } from '../src/index.js';

const grid = gridFromString(`
  00000
  01110
  00010
  01110
  00000
`);

const path = astar({
  grid,
  start: { x: 0, y: 0 },
  goal: { x: 4, y: 4 },
  allowDiagonal: false,
  heuristic: manhattanDistance,
});

console.log('Path length:', path?.length ?? 'no path');
console.log('Path:', path);
