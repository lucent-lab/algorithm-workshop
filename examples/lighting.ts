import { computeLightingGrid } from '../src/index.js';

const lighting = computeLightingGrid({
  width: 5,
  height: 5,
  tileSize: 16,
  ambient: 0.2,
  lights: [
    { x: 40, y: 40, radius: 64, intensity: 1, color: [1, 0.9, 0.7] },
    { x: 80, y: 16, radius: 48, intensity: 0.8, color: [0.6, 0.8, 1] },
  ],
});

console.log(lighting);
