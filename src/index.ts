export { astar, manhattanDistance, gridFromString } from './pathfinding/astar.js';
export { dijkstra } from './pathfinding/dijkstra.js';

export { perlin, perlin3D } from './procedural/perlin.js';
export { worley, worleySample } from './procedural/worley.js';
export { SimplexNoise, simplex2D, simplex3D } from './procedural/simplex.js';
export { waveFunctionCollapse } from './procedural/waveFunctionCollapse.js';

export { Quadtree } from './spatial/quadtree.js';
export { aabbCollision, aabbIntersection } from './spatial/aabb.js';
export { satCollision } from './spatial/sat.js';
export { circleRayIntersection } from './spatial/circleRay.js';
export { sweptAABB } from './spatial/sweptAabb.js';

export { debounce } from './util/debounce.js';
export { throttle } from './util/throttle.js';
export { LRUCache } from './util/lruCache.js';
export { memoize } from './util/memoize.js';
export { deduplicateRequest, clearRequestDedup } from './util/requestDedup.js';
export { calculateVirtualRange } from './util/virtualScroll.js';
export type {
  VirtualRange,
  VirtualItem,
  VirtualScrollOptions,
} from './util/virtualScroll.js';

export { fuzzySearch, fuzzyScore } from './search/fuzzy.js';
export { Trie } from './search/trie.js';
export { binarySearch } from './search/binarySearch.js';
export { levenshteinDistance } from './search/levenshtein.js';

export { diff } from './data/diff.js';
export { deepClone } from './data/deepClone.js';
export { groupBy } from './data/groupBy.js';
export { diffJson, applyJsonDiff } from './data/jsonDiff.js';
export type {
  JsonDiffOperation,
  JsonPathSegment,
  JsonPrimitive,
  JsonValue,
} from './data/jsonDiff.js';

export { graphBFS, graphDFS, topologicalSort } from './graph/traversal.js';

export { convexHull } from './geometry/convexHull.js';
export { lineIntersection } from './geometry/lineIntersection.js';
export { pointInPolygon } from './geometry/pointInPolygon.js';

export { easing } from './visual/easing.js';
export { quadraticBezier, cubicBezier } from './visual/bezier.js';

export { seek, flee, pursue, wander, arrive } from './ai/steering.js';
export { updateBoids } from './ai/boids.js';
export { rvoStep } from './ai/rvo.js';
export {
  BehaviorTree,
  type BehaviorStatus,
  type BehaviorNode,
  type BehaviorAction,
  type BehaviorCondition,
  sequence,
  selector,
  action,
  condition,
} from './ai/behaviorTree.js';

export type * from './types.js';
