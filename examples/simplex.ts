import { simplex2D } from '../src/index.js';

const width = 3;
const height = 3;
const seed = 123;

const values: number[][] = [];
for (let y = 0; y < height; y += 1) {
  const row: number[] = [];
  for (let x = 0; x < width; x += 1) {
    row.push(Number(simplex2D(x / 10, y / 10, seed).toFixed(4)));
  }
  values.push(row);
}

console.log('Simplex noise sample:', values);
