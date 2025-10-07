/**
 * LLM Algorithms – curated algorithms and utilities optimised for large language models and rapid prototyping.
 *
 * @remarks
 * The entry point mirrors the structure documented in `docs/index.d.ts` and includes direct links to runnable
 * examples so that agents can quickly discover usage patterns. Every export features JSDoc with a short summary,
 * performance notes where relevant, and example references that survive in the generated declaration file.
 *
 * @example
 * ```ts
 * import { astar, gridFromString } from 'llm-algorithms';
 *
 * const grid = gridFromString(`
 *   0110
 *   0000
 * `);
 *
 * const path = astar({
 *   grid,
 *   start: { x: 0, y: 0 },
 *   goal: { x: 3, y: 1 },
 * });
 * ```
 */
export const examples = {
  pathfinding: {
    astar: 'examples/astar.ts',
    manhattanDistance: 'examples/astar.ts',
    gridFromString: 'examples/astar.ts',
    dijkstra: 'examples/astar.ts',
    jumpPointSearch: 'examples/astar.ts',
    computeFlowField: 'examples/flowField.ts',
    buildNavMesh: 'examples/navMesh.ts',
    findNavMeshPath: 'examples/navMesh.ts',
  },
  procedural: {
    perlin: 'examples/simplex.ts',
    perlin3D: 'examples/simplex.ts',
    simplex2D: 'examples/simplex.ts',
    simplex3D: 'examples/simplex.ts',
    SimplexNoise: 'examples/simplex.ts',
    worley: 'examples/worley.ts',
    worleySample: 'examples/worley.ts',
    waveFunctionCollapse: 'examples/waveFunctionCollapse.ts',
    cellularAutomataCave: 'examples/cellularAutomata.ts',
    poissonDiskSampling: 'examples/poissonDisk.ts',
    computeVoronoiDiagram: 'examples/voronoi.ts',
    diamondSquare: 'examples/diamondSquare.ts',
    generateLSystem: 'examples/lSystem.ts',
    generateBspDungeon: 'examples/dungeonBsp.ts',
    generateRecursiveMaze: 'examples/mazeRecursive.ts',
    generatePrimMaze: 'examples/mazePrim.ts',
    generateKruskalMaze: 'examples/mazeKruskal.ts',
    generateWilsonMaze: 'examples/mazeWilson.ts',
    generateAldousBroderMaze: 'examples/mazeAldous.ts',
  },
  spatial: {
    Quadtree: 'examples/sat.ts',
    aabbCollision: 'examples/sat.ts',
    aabbIntersection: 'examples/sat.ts',
    satCollision: 'examples/sat.ts',
    circleRayIntersection: 'examples/sat.ts',
    sweptAABB: 'examples/sweptAabb.ts',
  },
  search: {
    fuzzySearch: 'examples/search.ts',
    fuzzyScore: 'examples/search.ts',
    Trie: 'examples/search.ts',
    binarySearch: 'examples/search.ts',
    levenshteinDistance: 'examples/search.ts',
  },
  data: {
    diff: 'examples/jsonDiff.ts',
    deepClone: 'examples/jsonDiff.ts',
    groupBy: 'examples/jsonDiff.ts',
    diffJson: 'examples/jsonDiff.ts',
    applyJsonDiff: 'examples/jsonDiff.ts',
  },
  performance: {
    debounce: 'examples/requestDedup.ts',
    throttle: 'examples/requestDedup.ts',
    LRUCache: 'examples/requestDedup.ts',
    memoize: 'examples/requestDedup.ts',
    deduplicateRequest: 'examples/requestDedup.ts',
    clearRequestDedup: 'examples/requestDedup.ts',
    calculateVirtualRange: 'examples/virtualScroll.ts',
  },
  ai: {
    seek: 'examples/steering.ts',
    flee: 'examples/steering.ts',
    pursue: 'examples/steering.ts',
    wander: 'examples/steering.ts',
    arrive: 'examples/steering.ts',
    updateBoids: 'examples/boids.ts',
    BehaviorTree: 'examples/behaviorTree.ts',
    rvoStep: 'examples/rvo.ts',
  },
  graph: {
    graphBFS: 'examples/graph.ts',
    graphDFS: 'examples/graph.ts',
    topologicalSort: 'examples/graph.ts',
  },
  geometry: {
    convexHull: 'examples/geometry.ts',
    lineIntersection: 'examples/geometry.ts',
    pointInPolygon: 'examples/geometry.ts',
  },
  visual: {
    easing: 'examples/visual.ts',
    quadraticBezier: 'examples/visual.ts',
    cubicBezier: 'examples/visual.ts',
  },
} as const;

/**
 * Type helper describing the example registry object.
 */
export type ExamplesRegistry = typeof examples;

/**
 * Union of available example categories.
 */
export type ExampleCategory = keyof ExamplesRegistry;

/**
 * Helper for narrowing example names within a category.
 */
export type ExampleName<C extends ExampleCategory = ExampleCategory> = keyof ExamplesRegistry[C];

// ============================================================================
// 🎮 PATHFINDING & NAVIGATION
// ============================================================================

/**
 * A* pathfinding algorithm for grid-based navigation.
 *
 * @example
 * ```ts
 * import { astar } from 'llm-algorithms';
 * ```
 * Example file: examples/astar.ts
 */
export { astar } from './pathfinding/astar.js';

/**
 * Manhattan distance heuristic for grid-based A* use.
 *
 * Example file: examples/astar.ts
 */
export { manhattanDistance } from './pathfinding/astar.js';

/**
 * Helper for turning ASCII maps into grid arrays for pathfinding demos.
 *
 * Example file: examples/astar.ts
 */
export { gridFromString } from './pathfinding/astar.js';

/**
 * Dijkstra's algorithm for weighted shortest-path problems.
 *
 * Example file: examples/astar.ts
 */
export { dijkstra } from './pathfinding/dijkstra.js';

/**
 * Jump Point Search acceleration for uniform-cost grids.
 *
 * Example file: examples/astar.ts
 */
export { jumpPointSearch } from './pathfinding/jumpPointSearch.js';

/**
 * Flow field construction that drives crowds toward a shared destination.
 *
 * Example file: examples/flowField.ts
 */
export { computeFlowField } from './pathfinding/flowField.js';

/**
 * Navigation mesh builder for irregular walkable regions.
 *
 * Example file: examples/navMesh.ts
 */
export { buildNavMesh } from './pathfinding/navMesh.js';

/**
 * Pathfinding helper operating on navigation meshes.
 *
 * Example file: examples/navMesh.ts
 */
export { findNavMeshPath } from './pathfinding/navMesh.js';

// ============================================================================
// 🌍 PROCEDURAL GENERATION
// ============================================================================

/**
 * 2D Perlin noise generator for smooth gradient textures.
 *
 * Example file: examples/simplex.ts
 */
export { perlin } from './procedural/perlin.js';

/**
 * 3D Perlin noise sampler for volumetric effects.
 *
 * Example file: examples/simplex.ts
 */
export { perlin3D } from './procedural/perlin.js';

/**
 * Worley (cellular) noise generator for organic patterns.
 *
 * Example file: examples/worley.ts
 */
export { worley } from './procedural/worley.js';

/**
 * Single Worley sample helper for shader-style lookups.
 *
 * Example file: examples/worley.ts
 */
export { worleySample } from './procedural/worley.js';

/**
 * Simplex noise utilities including the convenience class and 2D/3D helpers.
 *
 * Example file: examples/simplex.ts
 */
export { SimplexNoise, simplex2D, simplex3D } from './procedural/simplex.js';

/**
 * Tile-based Wave Function Collapse solver.
 *
 * Example file: examples/waveFunctionCollapse.ts
 */
export { waveFunctionCollapse } from './procedural/waveFunctionCollapse.js';

/**
 * Cellular automata cave generator for organic 2D layouts.
 *
 * Example file: examples/cellularAutomata.ts
 */
export { cellularAutomataCave } from './procedural/cellularAutomata.js';

/**
 * Poisson disk sampling for evenly spaced point sets.
 *
 * Example file: examples/poissonDisk.ts
 */
export { poissonDiskSampling } from './procedural/poissonDisk.js';

/**
 * Voronoi diagram helper returning polygonal cells for each site.
 *
 * Example file: examples/voronoi.ts
 */
export { computeVoronoiDiagram } from './procedural/voronoi.js';

/**
 * Diamond-square fractal terrain generator.
 *
 * Example file: examples/diamondSquare.ts
 */
export { diamondSquare } from './procedural/diamondSquare.js';

/**
 * Lindenmayer system generator for procedural grammars.
 *
 * Example file: examples/lSystem.ts
 */
export { generateLSystem } from './procedural/lSystem.js';

/**
 * Binary space partition dungeon generator.
 *
 * Example file: examples/dungeonBsp.ts
 */
export { generateBspDungeon } from './procedural/dungeonBsp.js';

/**
 * Recursive backtracking maze generator for grid layouts.
 *
 * Example file: examples/mazeRecursive.ts
 */
export { generateRecursiveMaze } from './procedural/maze.js';

/**
 * Prim's maze generator for alternative maze structures.
 *
 * Example file: examples/mazePrim.ts
 */
export { generatePrimMaze } from './procedural/maze.js';

/**
 * Kruskal's maze generator for evenly distributed layouts.
 *
 * Example file: examples/mazeKruskal.ts
 */
export { generateKruskalMaze } from './procedural/maze.js';

/**
 * Wilson's maze generator using loop-erased random walks.
 *
 * Example file: examples/mazeWilson.ts
 */
export { generateWilsonMaze } from './procedural/maze.js';

/**
 * Aldous–Broder maze generator using random walks.
 *
 * Example file: examples/mazeAldous.ts
 */
export { generateAldousBroderMaze } from './procedural/maze.js';

// ============================================================================
// 🎯 SPATIAL & COLLISION
// ============================================================================

/**
 * 2D quadtree spatial partitioning structure.
 *
 * Example file: examples/sat.ts
 */
export { Quadtree } from './spatial/quadtree.js';

/**
 * Axis-aligned bounding box collision detection helpers.
 *
 * Example file: examples/sat.ts
 */
export { aabbCollision, aabbIntersection } from './spatial/aabb.js';

/**
 * Separating Axis Theorem collision checks for convex polygons.
 *
 * Example file: examples/sat.ts
 */
export { satCollision } from './spatial/sat.js';

/**
 * Fast circle-ray intersection helper for line-of-sight checks.
 *
 * Example file: examples/sat.ts
 */
export { circleRayIntersection } from './spatial/circleRay.js';

/**
 * Continuous swept AABB collision detection for moving boxes.
 *
 * Example file: examples/sweptAabb.ts
 */
export { sweptAABB } from './spatial/sweptAabb.js';

// ============================================================================
// ⚡ UTILITIES & PERFORMANCE
// ============================================================================

/**
 * Debounce helper for deferring execution until a function stops being called.
 *
 * Example file: examples/requestDedup.ts
 */
export { debounce } from './util/debounce.js';

/**
 * Throttle helper for limiting execution frequency.
 *
 * Example file: examples/requestDedup.ts
 */
export { throttle } from './util/throttle.js';

/**
 * Least Recently Used (LRU) cache implementation.
 *
 * Example file: examples/requestDedup.ts
 */
export { LRUCache } from './util/lruCache.js';

/**
 * Memoization helper for deterministic functions.
 *
 * Example file: examples/requestDedup.ts
 */
export { memoize } from './util/memoize.js';

/**
 * Request deduplication helper to avoid redundant concurrent fetches.
 *
 * Example file: examples/requestDedup.ts
 */
export { deduplicateRequest, clearRequestDedup } from './util/requestDedup.js';

/**
 * Virtual scrolling calculation helpers for large lists.
 *
 * Example file: examples/virtualScroll.ts
 */
export { calculateVirtualRange } from './util/virtualScroll.js';

/**
 * Virtual scroll type exports to help define rendering contracts.
 */
export type {
  VirtualRange,
  VirtualItem,
  VirtualScrollOptions,
} from './util/virtualScroll.js';

// ============================================================================
// 🔍 SEARCH & STRING UTILITIES
// ============================================================================

/**
 * Fuzzy search scoring and matcher utilities.
 */
export { fuzzySearch, fuzzyScore } from './search/fuzzy.js';

/**
 * Trie (prefix tree) data structure implementation.
 */
export { Trie } from './search/trie.js';

/**
 * Binary search helper for sorted arrays.
 */
export { binarySearch } from './search/binarySearch.js';

/**
 * Levenshtein distance computation for strings.
 */
export { levenshteinDistance } from './search/levenshtein.js';

// ============================================================================
// 📊 DATA PROCESSING
// ============================================================================

/**
 * Array diff helper for change detection.
 */
export { diff } from './data/diff.js';

/**
 * Deep clone helper for structured data.
 */
export { deepClone } from './data/deepClone.js';

/**
 * Group-by helper for aggregating records.
 */
export { groupBy } from './data/groupBy.js';

/**
 * JSON diff and patch helpers for nested structures.
 */
export { diffJson, applyJsonDiff } from './data/jsonDiff.js';

/**
 * JSON diff related type exports.
 */
export type {
  JsonDiffOperation,
  JsonPathSegment,
  JsonPrimitive,
  JsonValue,
} from './data/jsonDiff.js';

// ============================================================================
// 📈 GRAPH ALGORITHMS
// ============================================================================

/**
 * Breadth-first and depth-first traversal helpers plus topological sort.
 */
export { graphBFS, graphDFS, topologicalSort } from './graph/traversal.js';

// ============================================================================
// 📐 GEOMETRY UTILITIES
// ============================================================================

/**
 * Convex hull computation via Graham scan.
 */
export { convexHull } from './geometry/convexHull.js';

/**
 * Line intersection helper returning intersection details.
 */
export { lineIntersection } from './geometry/lineIntersection.js';

/**
 * Point-in-polygon test for convex and simple polygons.
 */
export { pointInPolygon } from './geometry/pointInPolygon.js';

// ============================================================================
// 🎨 VISUAL & ANIMATION
// ============================================================================

/**
 * Collection of easing curves for animation timing.
 */
export { easing } from './visual/easing.js';

/**
 * Quadratic and cubic Bézier helpers for animation curves.
 */
export { quadraticBezier, cubicBezier } from './visual/bezier.js';

// ============================================================================
// 🤖 AI & BEHAVIOUR
// ============================================================================

/**
 * Steering behaviours for goal-directed movement.
 */
export { seek, flee, pursue, wander, arrive } from './ai/steering.js';

/**
 * Boids flocking simulation update helper.
 */
export { updateBoids } from './ai/boids.js';

/**
 * Reciprocal velocity obstacles step for crowd simulation.
 */
export { rvoStep } from './ai/rvo.js';

/**
 * Behaviour tree toolkit with helper constructors.
 */
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

/**
 * Shared toolkit-wide types.
 */
export type * from './types.js';
