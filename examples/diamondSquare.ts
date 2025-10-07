import { diamondSquare } from '../src/index.js';

const { grid, min, max } = diamondSquare({
  size: 9,
  roughness: 0.6,
  seed: 42,
});

console.log('Min height:', min.toFixed(3));
console.log('Max height:', max.toFixed(3));
console.log('Sample row:', grid[4]?.map((value) => value.toFixed(3)).join(', '));
