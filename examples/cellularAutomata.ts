import { cellularAutomataCave } from '../src/index.js';

const { grid, openCells } = cellularAutomataCave({
  width: 30,
  height: 18,
  seed: 2024,
  iterations: 5,
});

const rendered = grid
  .map((row) =>
    row
      .map((cell) => (cell === 1 ? '#' : '.'))
      .join('')
  )
  .join('\n');

console.log(rendered);
console.log('Open cells:', openCells.length);
