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
// 🔦 DISCOVERY AIDS
// ============================================================================

/**
 * Registry of runnable examples bundled with the library.
 * Use for: quickly locating a script that demonstrates an export.
 * Import: index (re-exported constant)
 */
export const examples: {
  readonly pathfinding: {
    readonly astar: 'examples/astar.ts';
    readonly manhattanDistance: 'examples/astar.ts';
    readonly gridFromString: 'examples/astar.ts';
    readonly dijkstra: 'examples/astar.ts';
    readonly jumpPointSearch: 'examples/astar.ts';
    readonly computeFlowField: 'examples/flowField.ts';
    readonly buildNavMesh: 'examples/navMesh.ts';
    readonly findNavMeshPath: 'examples/navMesh.ts';
  };
  readonly procedural: {
    readonly perlin: 'examples/simplex.ts';
    readonly perlin3D: 'examples/simplex.ts';
    readonly simplex2D: 'examples/simplex.ts';
    readonly simplex3D: 'examples/simplex.ts';
    readonly SimplexNoise: 'examples/simplex.ts';
    readonly worley: 'examples/worley.ts';
    readonly worleySample: 'examples/worley.ts';
    readonly waveFunctionCollapse: 'examples/waveFunctionCollapse.ts';
    readonly cellularAutomataCave: 'examples/cellularAutomata.ts';
    readonly poissonDiskSampling: 'examples/poissonDisk.ts';
    readonly computeVoronoiDiagram: 'examples/voronoi.ts';
    readonly diamondSquare: 'examples/diamondSquare.ts';
    readonly generateLSystem: 'examples/lSystem.ts';
    readonly generateBspDungeon: 'examples/dungeonBsp.ts';
    readonly generateRecursiveMaze: 'examples/mazeRecursive.ts';
    readonly generatePrimMaze: 'examples/mazePrim.ts';
    readonly generateKruskalMaze: 'examples/mazeKruskal.ts';
    readonly generateWilsonMaze: 'examples/mazeWilson.ts';
    readonly generateAldousBroderMaze: 'examples/mazeAldous.ts';
    readonly generateRecursiveDivisionMaze: 'examples/mazeDivision.ts';
  };
  readonly spatial: {
    readonly Quadtree: 'examples/sat.ts';
    readonly aabbCollision: 'examples/sat.ts';
    readonly aabbIntersection: 'examples/sat.ts';
    readonly satCollision: 'examples/sat.ts';
    readonly circleRayIntersection: 'examples/sat.ts';
    readonly sweptAABB: 'examples/sweptAabb.ts';
  };
  readonly search: {
    readonly fuzzySearch: 'examples/search.ts';
    readonly fuzzyScore: 'examples/search.ts';
    readonly Trie: 'examples/search.ts';
    readonly binarySearch: 'examples/search.ts';
    readonly levenshteinDistance: 'examples/search.ts';
  };
  readonly data: {
    readonly diff: 'examples/jsonDiff.ts';
    readonly deepClone: 'examples/jsonDiff.ts';
    readonly groupBy: 'examples/jsonDiff.ts';
    readonly diffJson: 'examples/jsonDiff.ts';
    readonly applyJsonDiff: 'examples/jsonDiff.ts';
  };
  readonly performance: {
    readonly debounce: 'examples/requestDedup.ts';
    readonly throttle: 'examples/requestDedup.ts';
    readonly LRUCache: 'examples/requestDedup.ts';
    readonly memoize: 'examples/requestDedup.ts';
    readonly deduplicateRequest: 'examples/requestDedup.ts';
    readonly clearRequestDedup: 'examples/requestDedup.ts';
    readonly calculateVirtualRange: 'examples/virtualScroll.ts';
    readonly createWeightedAliasSampler: 'examples/weightedAlias.ts';
    readonly createObjectPool: 'examples/objectPool.ts';
    readonly fisherYatesShuffle: 'examples/fisherYates.ts';
    readonly createFixedTimestepLoop: 'examples/fixedTimestep.ts';
  };
  readonly ai: {
    readonly seek: 'examples/steering.ts';
    readonly flee: 'examples/steering.ts';
    readonly pursue: 'examples/steering.ts';
    readonly wander: 'examples/steering.ts';
    readonly arrive: 'examples/steering.ts';
    readonly updateBoids: 'examples/boids.ts';
    readonly BehaviorTree: 'examples/behaviorTree.ts';
    readonly rvoStep: 'examples/rvo.ts';
  };
  readonly graph: {
    readonly graphBFS: 'examples/graph.ts';
    readonly graphDFS: 'examples/graph.ts';
    readonly topologicalSort: 'examples/graph.ts';
  };
  readonly geometry: {
    readonly convexHull: 'examples/geometry.ts';
    readonly lineIntersection: 'examples/geometry.ts';
    readonly pointInPolygon: 'examples/geometry.ts';
  };
  readonly visual: {
    readonly easing: 'examples/visual.ts';
    readonly quadraticBezier: 'examples/visual.ts';
    readonly cubicBezier: 'examples/visual.ts';
  };
};

/**
 * Type helper describing the registry shape.
 * Import: index (type alias)
 */
export type ExamplesRegistry = typeof examples;

/**
 * Union of example categories.
 * Import: index (type alias)
 */
export type ExampleCategory = keyof ExamplesRegistry;

/**
 * Helper type for narrowing example keys within a category.
 * Import: index (type alias)
 */
export type ExampleName<C extends ExampleCategory = ExampleCategory> = keyof ExamplesRegistry[C];

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

/**
 * Flow field builder pointing multiple agents toward a goal.
 * Use for: RTS flow maps, crowd steering, dynamic navigation hints.
 * Performance: O(width × height) with uniform costs.
 * Import: pathfinding/flowField.ts
 */
export interface FlowFieldOptions {
  grid: number[][];
  goal: Point;
  allowDiagonal?: boolean;
}
export interface FlowFieldResult {
  cost: number[][];
  flow: Vector2D[][];
}
export function computeFlowField(options: FlowFieldOptions): FlowFieldResult;

/**
 * Defines a convex polygon within a navigation mesh.
 * Use for: modelling walkable regions, linking irregular spaces, navigation authoring.
 * Import: pathfinding/navMesh.ts
 */
export interface NavPolygon {
  id: string;
  vertices: ReadonlyArray<Point>;
}

/**
 * Edge connection between polygons in the navmesh.
 * Use for: debugging adjacency, portal-based smoothing, editor tooling.
 * Import: pathfinding/navMesh.ts
 */
export interface NavNeighbor {
  polygonId: string;
  portal: readonly [Point, Point];
  cost: number;
}

/**
 * Navigation mesh data containing polygons, centroids, and neighbour metadata.
 * Use for: building navmesh editors, serialising runtime meshes, multi-agent steering.
 * Import: pathfinding/navMesh.ts
 */
export interface NavMesh {
  polygons: ReadonlyArray<NavPolygon>;
  neighbors: Record<string, NavNeighbor[]>;
  centroids: Record<string, Point>;
}

/**
 * Result returned by the navmesh pathfinder.
 * Use for: agent routing, waypoint creation, visualising navmesh traversal.
 * Import: pathfinding/navMesh.ts
 */
export interface NavMeshPath {
  polygonPath: string[];
  waypoints: Point[];
  cost: number;
}

/**
 * Optional overrides for navmesh pathfinding behaviour.
 * Use for: heuristic experimentation, weighted navigation, sandboxes.
 * Import: pathfinding/navMesh.ts
 */
export interface FindNavMeshPathOptions {
  heuristic?: (from: Point, to: Point) => number;
}

/**
 * Builds a navigation mesh from convex polygons, establishing adjacency portals.
 * Use for: irregular terrain travel, top-down navigation, runtime navmesh baking.
 * Import: pathfinding/navMesh.ts
 */
export function buildNavMesh(polygons: readonly NavPolygon[]): NavMesh;

/**
 * Computes a waypoint path across a navigation mesh using A*.
 * Use for: agent steering, patrol creation, directing units through navmesh corridors.
 * Import: pathfinding/navMesh.ts
 */
export function findNavMeshPath(
  mesh: NavMesh,
  start: Point,
  goal: Point,
  options?: FindNavMeshPathOptions
): NavMeshPath | null;

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
 * Cellular automata options for cave generation.
 * Use for: cavern layouts, roguelike levels, organic map carving.
 * Import: procedural/cellularAutomata.ts
 */
export interface CellularAutomataOptions {
  width: number;
  height: number;
  fillProbability?: number;
  birthLimit?: number;
  survivalLimit?: number;
  iterations?: number;
  seed?: number;
}

/**
 * Result returned by the cellular automata cave generator.
 * Use for: sampling spawn points, merging with navigation meshes, instantiating tiles.
 * Import: procedural/cellularAutomata.ts
 */
export interface CellularAutomataResult {
  grid: number[][];
  openCells: Point[];
}

/**
 * Cellular automata cave generator for organic 2D layouts.
 * Use for: roguelike maps, cave-like levels, quick prototyping.
 * Performance: O(width × height × iterations).
 * Import: procedural/cellularAutomata.ts
 */
export function cellularAutomataCave(options: CellularAutomataOptions): CellularAutomataResult;

/**
 * Options for Poisson disk sampling in a rectangular domain.
 * Use for: scatter placement, foliage distribution, sampling patterns.
 * Import: procedural/poissonDisk.ts
 */
export interface PoissonDiskOptions {
  width: number;
  height: number;
  radius: number;
  maxAttempts?: number;
  seed?: number;
}

/**
 * Generates Poisson disk distributed points inside a rectangle.
 * Use for: even point distribution, procedural placement, blue-noise sampling.
 * Performance: O(n) expected, where n is the number of samples.
 * Import: procedural/poissonDisk.ts
 */
export function poissonDiskSampling(options: PoissonDiskOptions): Point[];

/**
 * Voronoi site definition.
 * Use for: labelling regions, associating metadata to cells.
 * Import: procedural/voronoi.ts
 */
export interface VoronoiSite extends Point {
  id?: string;
}

/**
 * Bounding box constraining Voronoi cell clipping.
 * Use for: enforcing finite diagram extents, map limits, UI layout boxes.
 * Import: procedural/voronoi.ts
 */
export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Voronoi configuration options.
 * Use for: padding the inferred bounds, providing explicit clipping boxes.
 * Import: procedural/voronoi.ts
 */
export interface VoronoiOptions {
  boundingBox?: BoundingBox;
  padding?: number;
}

/**
 * Resulting Voronoi cell containing the generating site and polygon vertices.
 * Use for: rendering territories, computing adjacency, spawning procedural content.
 * Import: procedural/voronoi.ts
 */
export interface VoronoiCell {
  site: VoronoiSite;
  polygon: Point[];
}

/**
 * Computes a Voronoi diagram via half-plane clipping.
 * Use for: territory partitioning, biome assignment, gameplay regions.
 * Performance: O(n^2 m) where m is retained polygon vertex count.
 * Import: procedural/voronoi.ts
 */
export function computeVoronoiDiagram(
  sites: ReadonlyArray<VoronoiSite>,
  options?: VoronoiOptions
): VoronoiCell[];

/**
 * Options configuring the diamond-square fractal algorithm.
 * Use for: tuning roughness, deterministic height map generation.
 * Import: procedural/diamondSquare.ts
 */
export interface DiamondSquareOptions {
  size: number;
  roughness?: number;
  initialAmplitude?: number;
  seed?: number;
  normalize?: boolean;
}

/**
 * Diamond-square result containing sampled grid values and extrema.
 * Use for: rendering terrain meshes, post-processing passes, biome assignment.
 * Import: procedural/diamondSquare.ts
 */
export interface DiamondSquareResult {
  grid: number[][];
  min: number;
  max: number;
}

/**
 * Generates fractal height maps via the diamond-square algorithm.
 * Use for: terrain synthesis, cloud height fields, noise layering.
 * Performance: O(size^2) where size = 2^n + 1.
 * Import: procedural/diamondSquare.ts
 */
export function diamondSquare(options: DiamondSquareOptions): DiamondSquareResult;

/**
 * Stochastic L-system rule with optional weighting.
 * Use for: probabilistic grammars, varied foliage, randomised growth.
 * Import: procedural/lSystem.ts
 */
export interface StochasticRule {
  successor: string;
  weight?: number;
}

/**
 * Production rule definition for deterministic or stochastic replacements.
 * Import: procedural/lSystem.ts
 */
export type ProductionRule = string | ReadonlyArray<StochasticRule>;

/**
 * Lindenmayer system ruleset.
 * Use for: defining grammar productions.
 * Import: procedural/lSystem.ts
 */
export type LSystemRules = Readonly<Record<string, ProductionRule>>;

/**
 * L-system options controlling iterations and stochastic behaviour.
 * Use for: axiom-driven expansions, deterministic or random sequences.
 * Import: procedural/lSystem.ts
 */
export interface LSystemOptions {
  axiom: string;
  rules: LSystemRules;
  iterations: number;
  seed?: number;
  trackHistory?: boolean;
}

/**
 * L-system generation result containing final string and optional history.
 * Use for: caching iteration states, debugging expansions.
 * Import: procedural/lSystem.ts
 */
export interface LSystemResult {
  result: string;
  history: string[];
}

/**
 * Generates an L-system sequence using deterministic or stochastic rules.
 * Use for: foliage grammars, fractal curves, grammar-based systems.
 * Performance: O(n × iterations) where n is string length per step.
 * Import: procedural/lSystem.ts
 */
export function generateLSystem(options: LSystemOptions): LSystemResult;

/**
 * BSP dungeon generation options.
 * Use for: configuring room sizes, recursion depth, deterministic seeds.
 * Import: procedural/dungeonBsp.ts
 */
export interface DungeonGeneratorOptions {
  width: number;
  height: number;
  minimumRoomSize?: number;
  maximumRoomSize?: number;
  maxDepth?: number;
  corridorWidth?: number;
  seed?: number;
}

/**
 * BSP dungeon room description.
 * Use for: placing furniture, connecting gameplay triggers.
 * Import: procedural/dungeonBsp.ts
 */
export interface DungeonRoom extends Rect {
  id: number;
  center: Point;
}

/**
 * Corridor carved between rooms in a BSP dungeon.
 * Import: procedural/dungeonBsp.ts
 */
export interface DungeonCorridor {
  path: Point[];
}

/**
 * Result returned by the BSP dungeon generator.
 * Use for: rendering tiles, analysing connectivity, gameplay logic.
 * Import: procedural/dungeonBsp.ts
 */
export interface DungeonBspResult {
  grid: number[][];
  rooms: DungeonRoom[];
  corridors: DungeonCorridor[];
}

/**
 * Generates a room-and-corridor dungeon using binary space partitioning.
 * Use for: roguelike maps, procedural dungeons, level blocking.
 * Performance: O(width × height) carving plus O(nodes) splitting.
 * Import: procedural/dungeonBsp.ts
 */
export function generateBspDungeon(options: DungeonGeneratorOptions): DungeonBspResult;

/**
 * Maze generation options for recursive backtracking.
 * Use for: controlling grid dimensions and deterministic seeding.
 * Import: procedural/maze.ts
 */
export interface MazeOptions {
  width: number;
  height: number;
  seed?: number;
}

/**
 * Maze generation result describing walkable grid and terminals.
 * Use for: pathfinding tests, gameplay layout, puzzle generation.
 * Import: procedural/maze.ts
 */
export interface MazeResult {
  grid: number[][];
  start: Point;
  end: Point;
}

/**
 * Generates a maze using recursive backtracking depth-first search.
 * Use for: grid-based dungeon layouts, puzzles, procedural environments.
 * Performance: O(width × height).
 * Import: procedural/maze.ts
 */
export function generateRecursiveMaze(options: MazeOptions): MazeResult;

/**
 * Generates a maze using Prim's algorithm.
 * Use for: compact mazes with branching corridors, alternative structures.
 * Performance: O(width × height).
 * Import: procedural/maze.ts
 */
export function generatePrimMaze(options: MazeOptions): MazeResult;

/**
 * Generates a maze using Kruskal's algorithm with disjoint sets.
 * Use for: evenly distributed corridors with minimal bias.
 * Performance: O(width × height log cells).
 * Import: procedural/maze.ts
 */
export function generateKruskalMaze(options: MazeOptions): MazeResult;

/**
 * Generates a maze using Wilson's loop-erased random walk algorithm.
 * Use for: unbiased mazes matching uniform spanning trees.
 * Performance: O(width × height × random walks).
 * Import: procedural/maze.ts
 */
export function generateWilsonMaze(options: MazeOptions): MazeResult;

/**
 * Generates a maze using the Aldous–Broder algorithm.
 * Use for: unbiased random mazes through random walks.
 * Performance: O(width × height × visits).
 * Import: procedural/maze.ts
 */
export function generateAldousBroderMaze(options: MazeOptions): MazeResult;

/**
 * Generates a maze using recursive division.
 * Use for: structured mazes with nested chambers.
 * Performance: O(width × height).
 * Import: procedural/maze.ts
 */
export function generateRecursiveDivisionMaze(options: MazeOptions): MazeResult;

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
 * Weighted alias sampler entry.
 * Use for: pairing values with weights for alias method.
 * Import: util/weightedAlias.ts
 */
export interface WeightedAliasEntry<T = string> {
  value: T;
  weight: number;
}

/**
 * Alias sampler descriptor.
 * Import: util/weightedAlias.ts
 */
export interface WeightedAliasSampler<T = string> {
  sample(random?: () => number): T;
  probabilities: number[];
  aliases: number[];
  values: T[];
}

/**
 * Creates a weighted sampler using Vose's alias method.
 * Use for: constant-time sampling from discrete weighted distributions.
 * Performance: O(n) preprocessing, O(1) sampling.
 * Import: util/weightedAlias.ts
 */
export function createWeightedAliasSampler<T>(
  entries: ReadonlyArray<WeightedAliasEntry<T>>
): WeightedAliasSampler<T>;

/**
 * Object pool options.
 * Use for: configuring factories, reset functions, and pool sizing.
 * Import: util/objectPool.ts
 */
export interface ObjectPoolOptions<T> {
  factory: () => T;
  reset?: (item: T) => void;
  initialSize?: number;
  maxSize?: number;
}

/**
 * Object pool API exposing acquire/release.
 * Import: util/objectPool.ts
 */
export interface ObjectPool<T> {
  acquire(): T;
  release(item: T): void;
  available(): number;
  size(): number;
}

/**
 * Creates an object pool for reusing allocations.
 * Use for: performance sensitive systems and resource recycling.
 * Performance: O(1) acquire/release with optional reset handling.
 * Import: util/objectPool.ts
 */
export function createObjectPool<T>(options: ObjectPoolOptions<T>): ObjectPool<T>;

/**
 * Delta-time manager configuration.
 * Use for: clamping frame spikes, tuning smoothing windows.
 * Import: util/deltaTime.ts
 */
export interface DeltaTimeOptions {
  maxDelta?: number;
  smoothing?: number;
}

/**
 * Delta-time manager API.
 * Use for: sampling frame durations and resetting loops.
 * Import: util/deltaTime.ts
 */
export interface DeltaTimeManager {
  update(timestamp: number): number;
  getDelta(): number;
  reset(): void;
}

/**
 * Creates a delta-time manager that smooths and clamps frame durations.
 * Use for: game loops, animation systems, interpolation factors.
 * Performance: O(1) per update with small smoothing window maintenance.
 * Import: util/deltaTime.ts
 */
export function createDeltaTimeManager(options?: DeltaTimeOptions): DeltaTimeManager;

/**
 * Shuffles an array in place using Fisher–Yates.
 * Use for: unbiased permutations, testing, random ordering.
 * Import: util/fisherYates.ts
 */
export function fisherYatesShuffle<T>(items: T[], options?: { random?: () => number }): T[];

/**
 * Fixed timestep options for deterministic update loops.
 * Use for: game loops, physics updates, consistent simulations.
 * Import: util/fixedTimestep.ts
 */
export interface FixedTimestepOptions {
  step: number;
  maxDelta?: number;
  update: (context: { alpha: number; accumulator: number; elapsed: number }) => void;
  render?: (context: { alpha: number; accumulator: number; elapsed: number }) => void;
}

/**
 * Fixed timestep loop interface.
 * Import: util/fixedTimestep.ts
 */
export interface FixedTimestepLoop {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

/**
 * Creates a fixed timestep loop for deterministic updates.
 * Use for: gameplay loops, physics, consistent tick simulation.
 * Performance: O(n) updates per frame capped by maxDelta
 * Import: util/fixedTimestep.ts
 */
export function createFixedTimestepLoop(options: FixedTimestepOptions): FixedTimestepLoop;

// ============================================================================
// 🕹️ GAMEPLAY SYSTEMS
// ============================================================================

/**
 * Camera bounds limiting camera travel.
 * Use for: constraining view to world dimensions.
 * Import: gameplay/camera2D.ts
 */
export interface CameraBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Deadzone rectangle keeping targets centred only when they exit the buffer.
 * Use for: platformer cameras, cinematic offsets.
 * Import: gameplay/camera2D.ts
 */
export interface CameraDeadzone {
  width: number;
  height: number;
}

/**
 * Camera shake configuration.
 * Use for: explosions, damage feedback, cinematic moments.
 * Import: gameplay/camera2D.ts
 */
export interface CameraShakeOptions {
  duration?: number;
  magnitude: number;
  frequency?: number;
}

/**
 * 2D camera configuration options.
 * Use for: smooth follow cameras with bounds and dead zones.
 * Import: gameplay/camera2D.ts
 */
export interface Camera2DOptions {
  viewportWidth: number;
  viewportHeight: number;
  position?: Point;
  bounds?: CameraBounds;
  deadzone?: CameraDeadzone;
  smoothing?: number;
  random?: () => number;
}

/**
 * Camera update input.
 * Use for: advancing the camera each frame with delta time and target.
 * Import: gameplay/camera2D.ts
 */
export interface CameraUpdateOptions {
  target: Point;
  delta: number;
}

/**
 * 2D camera runtime API.
 * Use for: retrieving view rects, configuring behaviour, triggering shake.
 * Import: gameplay/camera2D.ts
 */
export interface Camera2D {
  update(options: CameraUpdateOptions): Rect;
  getView(): Rect;
  getPosition(): Point;
  getCenter(): Point;
  setBounds(bounds?: CameraBounds): void;
  setDeadzone(deadzone?: CameraDeadzone): void;
  setSmoothing(value: number): void;
  applyShake(options: CameraShakeOptions): void;
  isShaking(): boolean;
  reset(position?: Point): void;
}

/**
 * Creates a 2D camera with smoothing, dead zones, and screen shake support.
 * Use for: side-scrollers, top-down games, cinematic sequences.
 * Performance: O(1) per update.
 * Import: gameplay/camera2D.ts
 */
export function createCamera2D(options: Camera2DOptions): Camera2D;

/**
 * Particle range descriptor.
 * Use for: defining min/max values for particle properties.
 * Import: gameplay/particleSystem.ts
 */
export interface ParticleRangeOptions {
  min: number;
  max: number;
}

/**
 * Particle emitter configuration.
 * Use for: controlling emission rate, lifetime, speed, angles, and size.
 * Import: gameplay/particleSystem.ts
 */
export interface ParticleEmitterOptions {
  rate?: number;
  position?: Point;
  life: ParticleRangeOptions;
  speed?: ParticleRangeOptions;
  angle?: ParticleRangeOptions;
  size?: ParticleRangeOptions;
  acceleration?: Vector2D;
}

/**
 * Particle system creation options.
 * Use for: configuring emitter and pooling limits.
 * Import: gameplay/particleSystem.ts
 */
export interface ParticleSystemOptions {
  emitter: ParticleEmitterOptions;
  maxParticles?: number;
  random?: () => number;
}

/**
 * Particle state information.
 * Use for: rendering particle positions, velocities, and lifetimes.
 * Import: gameplay/particleSystem.ts
 */
export interface Particle {
  position: Point;
  velocity: Vector2D;
  age: number;
  life: number;
  size: number;
}

/**
 * Particle system runtime API.
 * Use for: stepping simulation, bursts, emitter updates, pooling.
 * Import: gameplay/particleSystem.ts
 */
export interface ParticleSystem {
  update(delta: number): void;
  burst(count: number): void;
  getParticles(): readonly Particle[];
  setEmitter(options: Partial<ParticleEmitterOptions>): void;
  setPosition(position: Point): void;
  reset(): void;
}

/**
 * Creates a configurable particle system with emitter controls and pooling.
 * Use for: explosions, weather, ambient effects.
 * Performance: O(particles) per update.
 * Import: gameplay/particleSystem.ts
 */
export function createParticleSystem(options: ParticleSystemOptions): ParticleSystem;

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
 * Bresenham line rasterisation.
 * Use for: grid traversal, tile picking, pixel plotting.
 * Performance: O(max(|dx|, |dy|)).
 * Import: geometry/bresenham.ts
 */
export function bresenhamLine(start: Point, end: Point): Point[];

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
