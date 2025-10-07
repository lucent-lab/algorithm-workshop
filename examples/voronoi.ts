import { computeVoronoiDiagram } from '../src/index.js';

const sites = [
  { id: 'red', x: 2, y: 2 },
  { id: 'blue', x: 8, y: 3 },
  { id: 'green', x: 5, y: 7 },
];

const diagram = computeVoronoiDiagram(sites, {
  boundingBox: { minX: 0, maxX: 10, minY: 0, maxY: 10 },
});

for (const cell of diagram) {
  console.log(`Site ${cell.site.id}:`);
  console.log(cell.polygon.map(({ x, y }) => `(${x.toFixed(2)}, ${y.toFixed(2)})`).join(', '));
}
