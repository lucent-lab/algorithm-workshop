import { computeMarchingCubes } from '../src/index.js';

const size = 6;
const field: number[][][] = [];
const radius = 2.2;
for (let z = 0; z < size; z += 1) {
  const slice: number[][] = [];
  for (let y = 0; y < size; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < size; x += 1) {
      const dx = x - (size - 1) / 2;
      const dy = y - (size - 1) / 2;
      const dz = z - (size - 1) / 2;
      row.push(radius - Math.hypot(dx, dy, dz));
    }
    slice.push(row);
  }
  field.push(slice);
}

const { triangles } = computeMarchingCubes({ field, threshold: 0 });
console.log('Generated triangles:', triangles.length);
console.log('First triangle:', triangles[0]);
