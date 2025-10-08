import { computeFieldOfView, transparentFromGrid } from '../src/index.js';

const grid = {
  width: 7,
  height: 7,
  tiles: [
    true, true, true, true, true, true, true,
    true, true, true, true, true, true, true,
    true, true, false, false, false, true, true,
    true, true, false, true, false, true, true,
    true, true, false, false, false, true, true,
    true, true, true, true, true, true, true,
    true, true, true, true, true, true, true,
  ],
};

const transparent = transparentFromGrid(grid);
const result = computeFieldOfView(3, 3, { radius: 3, transparent });

console.log('visible tiles:', Array.from(result.visible));
