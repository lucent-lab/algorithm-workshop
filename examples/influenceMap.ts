import { computeInfluenceMap } from '../src/index.js';

const map = computeInfluenceMap({
  width: 5,
  height: 5,
  cellSize: 1,
  sources: [
    { position: { x: 1, y: 1 }, strength: 10, radius: 3, falloff: 'linear' },
    { position: { x: 4, y: 4 }, strength: -5, radius: 2, falloff: 'inverse' },
  ],
  decay: 0.2,
});

for (let y = 0; y < map.height; y += 1) {
  const row: string[] = [];
  for (let x = 0; x < map.width; x += 1) {
    row.push(map.values[y * map.width + x].toFixed(2));
  }
  console.log(row.join(' '));
}
