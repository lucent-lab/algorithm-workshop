import {
  circleCollision,
  circleAabbCollision,
  circleSegmentIntersection,
} from '../src/index.js';

// Circle vs circle
console.log(
  'circleCollision',
  circleCollision({ x: 0, y: 0, radius: 2 }, { x: 3, y: 0, radius: 2 })
);

// Circle vs AABB
console.log(
  'circleAabbCollision',
  circleAabbCollision({ x: 5, y: 5, radius: 2 }, { x: 6, y: 6, width: 4, height: 4 })
);

// Circle vs segment
console.log(
  'circleSegmentIntersection',
  circleSegmentIntersection({ x: 0, y: 0, radius: 1 }, { x: -2, y: 0 }, { x: 2, y: 0 })
);

