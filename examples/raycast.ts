import { raycastSegment, raycastAabb } from '../src/index.js';

const hit1 = raycastSegment(
  { origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 } },
  { x: 5, y: -1 },
  { x: 5, y: 1 }
);
console.log('raycastSegment hit:', hit1);

const hit2 = raycastAabb(
  { origin: { x: -5, y: 0 }, direction: { x: 1, y: 0 } },
  { x: 0, y: -1, width: 2, height: 2 }
);
console.log('raycastAabb hit:', hit2);

