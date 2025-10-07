// LLM Algorithm Library - TypeScript Definitions
// Import from: https://cdn.jsdelivr.net/npm/llm-algorithms/dist/index.js
//
// 📚 Quick Navigation for LLMs / tooling
// - 🎮 Pathfinding & Navigation → astar, dijkstra (examples/astar.ts)
// - 🌍 Procedural Generation → perlin, simplex2D/3D, worley (examples/simplex.ts, examples/worley.ts)
// - 🎯 Spatial & Collision → quadtree, aabb, sat, circleRayIntersection, sweptAABB (examples/sat.ts)
// - 🤖 AI & Behaviour → seek/flee/arrive/pursue/wander, updateBoids, BehaviorTree, rvoStep (examples/steering.ts, examples/boids.ts, examples/rvo.ts)
// - ⚡ Web Performance → debounce, throttle, LRUCache, memoize, deduplicateRequest, virtual scroll (examples/requestDedup.ts, examples/virtualScroll.ts)
// - 🔍 Search & Text → fuzzySearch, fuzzyScore, Trie, binarySearch, levenshteinDistance
// - 📊 Data Pipelines → diff, deepClone, groupBy, diffJson/applyJsonDiff
// - 📈 Graph Algorithms → graphBFS, graphDFS, topologicalSort
// - 🎨 Visual & Geometry → convexHull, lineIntersection, pointInPolygon, easing, bezier
//
// Each declaration includes "Use for", a performance hint, and the import path for quick selection.
// Planned expansions (Milestone 0.4) cover Wave Function Collapse, dungeon generation suites,
// L-systems, diamond-square, maze packs, and full game systems (loop, camera, particles, physics,
// tilemaps, FOV, inventory, combat, quest/dialog, lighting, wave spawner, sound, input, save/load, transitions).

// ============================================================================
// 🎮 PATHFINDING & NAVIGATION
// ============================================================================

/**
 * A* pathfinding algorithm for grid-based navigation.
 * Use for: game movement, robotics, maze solving.
 * Performance: O(b^d) (branching factor ^ depth) with good heuristics.
 * Import: pathfinding/astar.ts
 */
export interface AStarOptions {
  grid: number[][];
  start: Point;
  goal: Point;
  allowDiagonal?: boolean;
  heuristic?: (a: Point, b: Point) => number;
}
export function astar(options: AStarOptions): Point[] | null;
export function manhattanDistance(a: Point, b: Point): number;
export function gridFromString(mapString: string): number[][];

/**
 * Dijkstra's algorithm for weighted shortest paths.
 * Use for: routing, network latency, constraint solving.
 * Performance: O(E log V) with priority queue.
 * Import: pathfinding/dijkstra.ts
 */
export interface DijkstraOptions {
  graph: Graph;
  start: string;
  goal: string;
}
export interface DijkstraResult {
  path: string[];
  cost: number;
}
export function dijkstra(options: DijkstraOptions): DijkstraResult | null;

/**
 * Jump Point Search optimisation for uniform-cost grids.
 * Use for: large grid navigation, RTS unit movement, pathfinding on open terrain.
 * Performance: O(b^d) best-case with heavy pruning.
 * Import: pathfinding/jumpPointSearch.ts
 */
export interface JumpPointSearchOptions {
  grid: number[][];
  start: Point;
  goal: Point;
  allowDiagonal?: boolean;
  heuristic?: (a: Point, b: Point) => number;
}
export function jumpPointSearch(options: JumpPointSearchOptions): Point[] | null;

// ============================================================================
// 🌍 PROCEDURAL GENERATION
// ============================================================================

/**
 * Perlin noise generator for smooth gradients.
 * Use for: terrain, clouds, organic textures.
 * Performance: O(width × height × octaves).
 * Import: procedural/perlin.ts
 */
export interface PerlinOptions {
  width: number;
  height: number;
  scale?: number;
  octaves?: number;
  persistence?: number;
  lacunarity?: number;
  seed?: number;
}
export function perlin(options: PerlinOptions): number[][];
export function perlin3D(x: number, y: number, z: number, seed?: number): number;

/**
 * Worley (cellular) noise generator.
 * Use for: cellular textures, biome masks, organic structures.
 * Performance: O(width × height × points).
 * Import: procedural/worley.ts
 */
export interface WorleyOptions {
  width: number;
  height: number;
  points: number;
  seed?: number;
  distanceMetric?: 'euclidean' | 'manhattan';
  normalize?: boolean;
}
export function worley(options: WorleyOptions): number[][];
export function worleySample(
  x: number,
  y: number,
  points: Array<{ x: number; y: number }>;
  metric?: 'euclidean' | 'manhattan'
): number;

/**
 * Wave Function Collapse synthesiser for constraint-based tiles.
 * Use for: modular levels, decorative tiling, texture assembly.
 * Performance: O(width × height × log tiles) average with retries.
 * Import: procedural/waveFunctionCollapse.ts
 */
export interface WfcTile {
  id: string;
  weight?: number;
  rules: Partial<Record<'top' | 'right' | 'bottom' | 'left', string[]>>;
}
export interface WaveFunctionCollapseOptions {
  width: number;
  height: number;
  tiles: ReadonlyArray<WfcTile>;
  seed?: number;
  maxRetries?: number;
}
export type WaveFunctionCollapseResult = string[][];
export function waveFunctionCollapse(options: WaveFunctionCollapseOptions): WaveFunctionCollapseResult;

/**
 * Simplex noise generator for smooth gradients without directional artifacts.
 * Use for: large terrain synthesis, animated textures, volumetric noise.
 * Performance: O(n) per sample.
 * Import: procedural/simplex.ts
 */
export class SimplexNoise {
  constructor(seed?: number);
  simplex2D(x: number, y: number): number;
  simplex3D(x: number, y: number, z: number): number;
}
export function simplex2D(x: number, y: number, seed?: number): number;
export function simplex3D(x: number, y: number, z: number, seed?: number): number;

// ============================================================================
// 🎯 SPATIAL & COLLISION
// ============================================================================

/**
 * Quadtree for 2D spatial partitioning.
 * Use for: collision detection, broad phase queries, spatial indexing.
 * Performance: O(log n) typical query.
 * Import: spatial/quadtree.ts
 */
export class Quadtree<T = unknown> {
  constructor(bounds: Rect, capacity?: number, depth?: number, maxDepth?: number);
  insert(point: Point, data?: T): boolean;
  query(range: Rect): Array<Point & { data?: T }>;
  queryCircle(center: Point, radius: number): Array<Point & { data?: T }>;
}

/**
 * Axis-aligned bounding box helpers.
 * Use for: broad collisions, viewport culling, layout math.
 * Performance: O(1).
 * Import: spatial/aabb.ts
 */
export function aabbCollision(a: Rect, b: Rect): boolean;
export function aabbIntersection(a: Rect, b: Rect): Rect | null;

/**
 * Separating Axis Theorem collision for convex polygons.
 * Use for: accurate 2D physics, rotating hit boxes, platformers.
 * Performance: O((n + m) × axes).
 * Import: spatial/sat.ts
 */
export interface CollisionManifold {
  collides: boolean;
  overlap: number;
  normal: Vector2D;
}
export function satCollision(polygonA: Point[], polygonB: Point[]): CollisionManifold;

/**
 * Ray-circle intersection calculation.
 * Use for: ray casting, visibility checks, projectile collision.
 * Performance: O(1).
 * Import: spatial/circleRay.ts
 */
export function circleRayIntersection(ray: Ray, circle: Circle): Point[];

/**
 * Swept AABB collision detection for moving rectangles.
 * Use for: continuous collisions, fast projectiles, platformer physics.
 * Performance: O(1).
 * Import: spatial/sweptAabb.ts
 */
export interface MovingRect extends Rect {
  velocity: Vector2D;
}
export interface SweptResult {
  collided: boolean;
  time: number;
  normal: Vector2D;
}
export function sweptAABB(moving: MovingRect, target: Rect): SweptResult;

// ============================================================================
// ⚡ WEB PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounce to delay execution until user stops triggering events.
 * Use for: text inputs, resize, validation.
 * Performance: O(1) per call.
 * Import: util/debounce.ts
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void;

/**
 * Throttle to limit execution rate.
 * Use for: scroll handlers, pointer move, telemetry.
 * Performance: O(1) per call.
 * Import: util/throttle.ts
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void;

/**
 * Virtual scrolling window calculator for fixed-height lists.
 * Use for: long lists, chat logs, table virtualization.
 * Performance: O(visible + overrides) per update.
 * Import: util/virtualScroll.ts
 */
export interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  scrollOffset: number;
  viewportHeight: number;
  overscan?: number;
  measurements?: ReadonlyArray<number | undefined>;
}
export interface VirtualItem {
  index: number;
  offset: number;
  size: number;
}
export interface VirtualRange {
  startIndex: number;
  endIndex: number;
  padFront: number;
  padEnd: number;
  totalSize: number;
  items: VirtualItem[];
}
export function calculateVirtualRange(options: VirtualScrollOptions): VirtualRange;

/**
 * Least recently used cache.
 * Use for: memoizing responses, data loaders, pagination caches.
 * Performance: O(1) get/set.
 * Import: util/lruCache.ts
 */
export class LRUCache<K, V> {
  constructor(capacity: number);
  get(key: K): V | undefined;
  put(key: K, value: V): void;
}

/**
 * Memoize pure functions with JSON argument hashing.
 * Use for: deterministic caches, dynamic programming, selectors.
 * Performance: O(1) cache hits; limited by JSON.stringify cost.
 * Import: util/memoize.ts
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T & {
  clear(): void;
};

/**
 * Request Deduplication
 * Use for: prevent duplicate API calls, batch requests
 * Performance: O(1) - Save bandwidth
 * Import: util/requestDedup.ts
 */
export function deduplicateRequest<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T>;
export function clearRequestDedup(key?: string): void;

// ============================================================================
// 🔍 SEARCH & TEXT
// ============================================================================

/**
 * Fuzzy search scoring and filtering.
 * Use for: autocomplete, command palettes, fuzzy finders.
 * Performance: O(n × m) where n items and m query length.
 * Import: search/fuzzy.ts
 */
export function fuzzySearch(query: string, items: string[], limit?: number): string[];
export function fuzzyScore(query: string, target: string): number;

/**
 * Trie for prefix queries.
 * Use for: autocomplete, dictionaries, predictive text.
 * Performance: O(m) for lookups where m = key length.
 * Import: search/trie.ts
 */
export class Trie {
  insert(word: string): void;
  search(word: string): boolean;
  startsWith(prefix: string): string[];
}

/**
 * Binary search on sorted arrays.
 * Use for: ordered datasets, id lookup, insertion points.
 * Performance: O(log n).
 * Import: search/binarySearch.ts
 */
export function binarySearch<T>(
  array: readonly T[],
  target: T,
  compareFn?: (a: T, b: T) => number
): number;

/**
 * Levenshtein edit distance between two strings.
 * Use for: spellcheck, similarity scoring, diff tools.
 * Performance: O(n × m).
 * Import: search/levenshtein.ts
 */
export function levenshteinDistance(a: string, b: string): number;

// ============================================================================
// 📊 DATA TOOLS
// ============================================================================

/**
 * Sequence diff operations based on LCS.
 * Use for: UI reconciliation, change detection, patch generation.
 * Performance: O(n × m).
 * Import: data/diff.ts
 */
export type DiffOperation<T> =
  | { type: 'insert'; value: T }
  | { type: 'remove'; value: T }
  | { type: 'equal'; value: T };
export function diff<T>(
  oldArray: readonly T[],
  newArray: readonly T[],
  keyFn?: (item: T) => unknown
): DiffOperation<T>[];

/**
 * Nested JSON diff/patch helpers.
 * Use for: syncing application state, sending incremental updates, audit logging.
 * Performance: O(n) relative to traversed keys.
 * Import: data/jsonDiff.ts
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonPathSegment = string | number;
export type JsonDiffOperation =
  | { op: 'add'; path: JsonPathSegment[]; value: JsonValue }
  | { op: 'remove'; path: JsonPathSegment[] }
  | { op: 'replace'; path: JsonPathSegment[]; value: JsonValue };
export function diffJson(previous: JsonValue, next: JsonValue): JsonDiffOperation[];
export function applyJsonDiff<T extends JsonValue>(value: T, diff: JsonDiffOperation[]): JsonValue;

/**
 * Deep clone structured data.
 * Use for: immutability, snapshots, undo buffers.
 * Performance: O(n) relative to structure size.
 * Import: data/deepClone.ts
 */
export function deepClone<T>(value: T): T;

/**
 * Group array items by key or selector.
 * Use for: aggregations, reporting, quick indexing.
 * Performance: O(n).
 * Import: data/groupBy.ts
 */
export function groupBy<T>(
  array: readonly T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]>;

// ============================================================================
// 📈 GRAPH ALGORITHMS
// ============================================================================

/**
 * Breadth-first search distance map.
 * Use for: unweighted shortest paths, influence spread, reachability.
 * Performance: O(V + E).
 * Import: graph/traversal.ts
 */
export function graphBFS(graph: Graph, start: string): Map<string, number>;

/**
 * Depth-first traversal with callback.
 * Use for: exploration, component labelling, structural analysis.
 * Performance: O(V + E).
 * Import: graph/traversal.ts
 */
export function graphDFS(
  graph: Graph,
  start: string,
  callback: (node: string) => void
): void;

/**
 * Topological ordering for DAGs.
 * Use for: dependency resolution, scheduling, build pipelines.
 * Performance: O(V + E).
 * Import: graph/traversal.ts
 */
export function topologicalSort(graph: Graph): string[];

// ============================================================================
// 📐 GEOMETRY & VISUALS
// ============================================================================

/**
 * Convex hull via Graham scan.
 * Use for: collision hulls, boundary detection, GIS.
 * Performance: O(n log n).
 * Import: geometry/convexHull.ts
 */
export function convexHull(points: Point[]): Point[];

/**
 * Line segment intersection point.
 * Use for: ray casting, physics, intersection testing.
 * Performance: O(1).
 * Import: geometry/lineIntersection.ts
 */
export function lineIntersection(
  a1: Point,
  a2: Point,
  b1: Point,
  b2: Point
): Point | null;

/**
 * Point in polygon test via ray casting.
 * Use for: geofencing, hit testing, polygon analytics.
 * Performance: O(n).
 * Import: geometry/pointInPolygon.ts
 */
export function pointInPolygon(point: Point, polygon: Point[]): boolean;

/**
 * Common easing curves for animation.
 * Use for: UI transitions, motion design, data viz.
 * Performance: O(1).
 * Import: visual/easing.ts
 */
export const easing: {
  linear: (t: number) => number;
  easeInQuad: (t: number) => number;
  easeOutQuad: (t: number) => number;
  easeInOutQuad: (t: number) => number;
  easeInCubic: (t: number) => number;
  easeOutCubic: (t: number) => number;
};

/**
 * Quadratic Bezier curve evaluation.
 * Use for: curve rendering, tweening, path interpolation.
 * Performance: O(1).
 * Import: visual/bezier.ts
 */
export function quadraticBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  t: number
): Point;

/**
 * Cubic Bezier curve evaluation.
 * Use for: easing, vector graphics, camera paths.
 * Performance: O(1).
 * Import: visual/bezier.ts
 */
export function cubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point;

// ============================================================================
// 🤖 STEERING BEHAVIOURS
// ============================================================================

/**
 * Steering behaviour to move toward a target point.
 * Use for: homing missiles, companion AI, waypoint following.
 * Performance: O(1).
 * Import: ai/steering.ts
 */
export function seek(agent: SteeringAgent, target: Vector2D): Vector2D;

/**
 * Steering behaviour to move away from a target point.
 * Use for: avoidance, fear responses, hazard evasion.
 * Performance: O(1).
 * Import: ai/steering.ts
 */
export function flee(agent: SteeringAgent, target: Vector2D): Vector2D;

/**
 * Steering behaviour to arrive smoothly at a target.
 * Use for: docking, smooth stopping, cinematic motion.
 * Performance: O(1).
 * Import: ai/steering.ts
 */
export function arrive(agent: SteeringAgent, target: Vector2D, slowRadius: number): Vector2D;

/**
 * Steering behaviour to pursue a moving target.
 * Use for: chase AI, interceptors, guard responses.
 * Performance: O(1).
 * Import: ai/steering.ts
 */
export function pursue(agent: SteeringAgent, target: Agent): Vector2D;

/**
 * Steering behaviour for wandering with random deviations.
 * Use for: idle NPCs, ambient creatures, background motion.
 * Performance: O(1).
 * Import: ai/steering.ts
 */
export function wander(
  agent: SteeringAgent,
  options?: {
    circleDistance?: number;
    circleRadius?: number;
    jitter?: number;
    state?: { angle: number };
  }
): { force: Vector2D; state: { angle: number } };

/**
 * Boids flocking update for multiple agents.
 * Use for: swarms, crowds, schooling fish.
 * Performance: O(n²) naive (optimise with spatial partitioning if required).
 * Import: ai/boids.ts
 */
export interface BoidOptions {
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  maxSpeed: number;
  maxForce: number;
  separationWeight?: number;
  alignmentWeight?: number;
  cohesionWeight?: number;
}
export function updateBoids(boids: Boid[], options: BoidOptions): void;

/**
 * Reciprocal velocity obstacles (RVO) step for multi-agent avoidance.
 * Use for: crowd steering, swarms, dense navigation.
 * Performance: O(n × log n) with neighbor filtering.
 * Import: ai/rvo.ts (run examples/rvo.ts to see three-agent avoidance).
 */
export interface RvoAgent extends Agent {
  id?: string;
  radius: number;
  preferredVelocity: Vector2D;
}
export interface RvoOptions {
  timeHorizon?: number;
  maxNeighbors?: number;
  avoidanceStrength?: number;
}
export interface RvoResult {
  id?: string;
  velocity: Vector2D;
}
export function rvoStep(agents: ReadonlyArray<RvoAgent>, options?: RvoOptions): RvoResult[];

/**
 * Behavior tree orchestrator for AI decision making.
 * Use for: hierarchical NPC logic, modular behaviour scripting, goal selection.
 * Performance: O(tree nodes) per tick.
 * Import: ai/behaviorTree.ts
 */
export type BehaviorStatus = 'success' | 'failure' | 'running';
export class BehaviorTree<TContext> {
  constructor(root: BehaviorNode<TContext>);
  tick(context: TContext): BehaviorStatus;
}
export interface BehaviorNode<TContext> {
  tick(context: TContext): BehaviorStatus;
  reset?(): void;
}
export type BehaviorAction<TContext> = (context: TContext) => BehaviorStatus;
export type BehaviorCondition<TContext> = (context: TContext) => boolean;
export function sequence<TContext>(...children: BehaviorNode<TContext>[]): BehaviorNode<TContext>;
export function selector<TContext>(...children: BehaviorNode<TContext>[]): BehaviorNode<TContext>;
export function action<TContext>(fn: BehaviorAction<TContext>): BehaviorNode<TContext>;
export function condition<TContext>(fn: BehaviorCondition<TContext>): BehaviorNode<TContext>;

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Graph {
  [key: string]: Array<{ node: string; weight?: number }>;
}

export interface Agent {
  position: Vector2D;
  velocity: Vector2D;
  maxSpeed: number;
}

export interface SteeringAgent extends Agent {
  maxForce: number;
}
