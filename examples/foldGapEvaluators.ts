import { computePointTriangleGap, computeEdgeEdgeGap, computePointPlaneGap } from '../src/index.js';

const pointTriangle = computePointTriangleGap(
  { x: 0.1, y: 0.2, z: 0.3 },
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
  ]
);

console.log('point-triangle gap', pointTriangle.gap);

const edgeEdge = computeEdgeEdgeGap(
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
  ]
);

console.log('edge-edge gap', edgeEdge.gap);

const pointPlane = computePointPlaneGap(
  { x: 0, y: 0.5, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 }
);

console.log('point-plane gap', pointPlane.gap);
