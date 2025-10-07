import { convexHull, lineIntersection, pointInPolygon } from '../src/index.js';

const points = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 0 },
  { x: 1, y: -1 },
  { x: 0.5, y: 0.2 },
];

console.log('Convex hull:', convexHull(points));

const a1 = { x: 0, y: 0 };
const a2 = { x: 3, y: 3 };
const b1 = { x: 0, y: 3 };
const b2 = { x: 3, y: 0 };
console.log('Line intersection:', lineIntersection(a1, a2, b1, b2));

const polygon = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];
console.log('Point in polygon (2,1):', pointInPolygon({ x: 2, y: 1 }, polygon));
