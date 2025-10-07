import { buildNavMesh, findNavMeshPath } from '../src/index.js';

const polygons = [
  {
    id: 'atrium',
    vertices: [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
    ],
  },
  {
    id: 'hallway',
    vertices: [
      { x: 3, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: 3 },
      { x: 3, y: 3 },
    ],
  },
  {
    id: 'laboratory',
    vertices: [
      { x: 6, y: 0 },
      { x: 9, y: 0 },
      { x: 9, y: 3 },
      { x: 6, y: 3 },
    ],
  },
];

const mesh = buildNavMesh(polygons);
const path = findNavMeshPath(mesh, { x: 1, y: 1 }, { x: 7, y: 1.5 });

console.log('Polygon path:', path?.polygonPath);
console.log('Waypoints:', path?.waypoints);
console.log('Total cost:', path?.cost);
