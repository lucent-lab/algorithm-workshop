// LLM Algorithm Library - TypeScript Definitions
// Import from: https://cdn.jsdelivr.net/npm/llm-algorithms/dist/index.js
//
// 📚 Quick Navigation for LLMs / tooling
// - 🎮 Pathfinding & Navigation → astar, dijkstra (examples/astar.ts)
// - 🌍 Procedural Generation → perlin, simplex2D/3D, worley (examples/simplex.ts, examples/worley.ts)
// - 🎯 Spatial & Collision → quadtree, aabb, sat, circleRayIntersection, sweptAABB (examples/sat.ts)
//   plus circleCollision, circleAabbCollision, circleSegmentIntersection (examples/circle.ts), raycastSegment/Aabb (examples/raycast.ts)
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
    readonly Octree: 'examples/octree.ts';
    readonly aabbCollision: 'examples/sat.ts';
    readonly aabbIntersection: 'examples/sat.ts';
    readonly satCollision: 'examples/sat.ts';
    readonly circleRayIntersection: 'examples/sat.ts';
    readonly circleCollision: 'examples/circle.ts';
    readonly circleAabbCollision: 'examples/circle.ts';
    readonly circleSegmentIntersection: 'examples/circle.ts';
    readonly sweptAABB: 'examples/sweptAabb.ts';
    readonly buildBvh: 'examples/bvh.ts';
    readonly queryBvh: 'examples/bvh.ts';
    readonly raycastBvh: 'examples/bvh.ts';
  };
  readonly search: {
    readonly fuzzySearch: 'examples/search.ts';
    readonly fuzzyScore: 'examples/search.ts';
    readonly Trie: 'examples/search.ts';
    readonly binarySearch: 'examples/search.ts';
    readonly levenshteinDistance: 'examples/search.ts';
    readonly kmpSearch: 'examples/search.ts';
    readonly rabinKarp: 'examples/search.ts';
    readonly boyerMooreSearch: 'examples/search.ts';
    readonly buildSuffixArray: 'examples/search.ts';
    readonly longestCommonSubsequence: 'examples/search.ts';
    readonly diffStrings: 'examples/search.ts';
    readonly createAhoCorasick: 'examples/search.ts';
  };
  readonly data: {
    readonly diff: 'examples/jsonDiff.ts';
    readonly deepClone: 'examples/jsonDiff.ts';
    readonly groupBy: 'examples/jsonDiff.ts';
    readonly diffJson: 'examples/jsonDiff.ts';
    readonly applyJsonDiff: 'examples/jsonDiff.ts';
    readonly flatten: 'examples/jsonDiff.ts';
    readonly unflatten: 'examples/jsonDiff.ts';
    readonly paginate: 'examples/pagination.ts';
    readonly diffTree: 'examples/treeDiff.ts';
    readonly applyTreeDiff: 'examples/treeDiff.ts';
    readonly UnionFind: 'examples/graph.ts';
    readonly BinaryHeap: 'examples/binaryHeap.ts';
    readonly BloomFilter: 'examples/bloomFilter.ts';
    readonly SegmentTree: 'examples/segmentTree.ts';
    readonly SkipList: 'examples/skipList.ts';
    readonly runLengthEncode: 'examples/rle.ts';
    readonly runLengthDecode: 'examples/rle.ts';
    readonly base64Encode: 'examples/base64.ts';
    readonly base64Decode: 'examples/base64.ts';
    readonly createHuffmanTable: 'examples/huffman.ts';
    readonly huffmanEncode: 'examples/huffman.ts';
    readonly huffmanDecode: 'examples/huffman.ts';
    readonly lz77Compress: 'examples/lz77.ts';
    readonly lz77Decompress: 'examples/lz77.ts';
  };
  readonly physics: {
    readonly createFoldConstraintRegistry: 'examples/foldSetup.ts';
    readonly createCubicBarrier: 'examples/foldCubicBarrier.ts';
    readonly computeFrozenStiffness: 'examples/foldStiffness.ts';
    readonly createContactBarrier: 'examples/foldContactBarrier.ts';
    readonly createPinBarrier: 'examples/foldPinBarrier.ts';
    readonly createWallBarrier: 'examples/foldWallBarrier.ts';
    readonly createStrainBarrier: 'examples/foldStrainBarrier.ts';
    readonly createFrictionPotential: 'examples/foldFriction.ts';
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
  };
  readonly gameplay: {
    readonly createDeltaTimeManager: 'examples/deltaTime.ts';
    readonly createFixedTimestepLoop: 'examples/fixedTimestep.ts';
    readonly createCamera2D: 'examples/camera2D.ts';
    readonly createParticleSystem: 'examples/particleSystem.ts';
    readonly createSpriteAnimation: 'examples/spriteAnimation.ts';
    readonly createTweenSystem: 'examples/tween.ts';
    readonly createPlatformerController: 'examples/platformerPhysics.ts';
    readonly createTopDownController: 'examples/topDownMovement.ts';
    readonly createTileMapController: 'examples/tileMap.ts';
    readonly computeFieldOfView: 'examples/shadowcasting.ts';
    readonly createInventory: 'examples/inventory.ts';
    readonly calculateDamage: 'examples/combat.ts';
    readonly createCooldownController: 'examples/combat.ts';
    readonly createQuestMachine: 'examples/quest.ts';
    readonly computeLightingGrid: 'examples/lighting.ts';
    readonly createWaveSpawner: 'examples/waveSpawner.ts';
    readonly createSoundManager: 'examples/soundManager.ts';
    readonly createInputManager: 'examples/inputManager.ts';
    readonly createSaveManager: 'examples/saveManager.ts';
    readonly createScreenTransition: 'examples/screenTransitions.ts';
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
    readonly createFSM: 'examples/fsm.ts';
    readonly createGeneticAlgorithm: 'examples/genetic.ts';
    readonly computeInfluenceMap: 'examples/influenceMap.ts';
  };
  readonly graph: {
    readonly graphBFS: 'examples/graph.ts';
    readonly graphDFS: 'examples/graph.ts';
    readonly topologicalSort: 'examples/graph.ts';
    readonly computeMinimumSpanningTree: 'examples/kruskal.ts';
    readonly computeStronglyConnectedComponents: 'examples/scc.ts';
    readonly computeMaximumFlowDinic: 'examples/maxflow.ts';
  };
  readonly geometry: {
    readonly convexHull: 'examples/geometry.ts';
    readonly lineIntersection: 'examples/geometry.ts';
    readonly pointInPolygon: 'examples/geometry.ts';
    readonly bresenhamLine: 'examples/bresenham.ts';
    readonly closestPair: 'examples/closestPair.ts';
  };
  readonly visual: {
    readonly easing: 'examples/visual.ts';
    readonly quadraticBezier: 'examples/visual.ts';
    readonly cubicBezier: 'examples/visual.ts';
    readonly hexToRgb: 'examples/color.ts';
    readonly rgbToHex: 'examples/color.ts';
    readonly rgbToHsl: 'examples/color.ts';
    readonly hslToRgb: 'examples/color.ts';
    readonly mixRgbColors: 'examples/color.ts';
    readonly computeForceDirectedLayout: 'examples/forceDirected.ts';
    readonly computeMarchingSquares: 'examples/marchingSquares.ts';
    readonly computeMarchingCubes: 'examples/marchingCubes.ts';
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

// ============================================================================
// 🎯 SPATIAL & COLLISION – Circle Helpers
// ============================================================================

/**
 * Circle vs circle overlap test.
 * Use for: simple collision checks, proximity triggers.
 * Performance: O(1).
 * Import: spatial/circleCollision.ts
 */
export function circleCollision(a: Circle, b: Circle): boolean;

/**
 * Circle vs axis-aligned rectangle (AABB) intersection.
 * Use for: tile collisions, UI hit-tests, broad-phase pruning.
 * Performance: O(1).
 * Import: spatial/circleCollision.ts
 */
export function circleAabbCollision(circle: Circle, rect: Rect): boolean;

/**
 * Circle vs line segment intersection test.
 * Use for: ray/segment hits, visibility checks, bullet tests.
 * Performance: O(1).
 * Import: spatial/circleCollision.ts
 */
export function circleSegmentIntersection(circle: Circle, a: Point, b: Point): boolean;

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
 * Octree for 3D spatial partitioning.
 * Use for: broad-phase culling, proximity queries, volumetric indexing.
 * Performance: O(log n) typical query.
 * Import: spatial/octree.ts
 */
export class Octree<T = unknown> {
  constructor(bounds: Box3, capacity?: number, depth?: number, maxDepth?: number);
  insert(point: Point3D, data?: T): boolean;
  query(range: Box3): Array<Point3D & { data?: T }>;
  querySphere(center: Point3D, radius: number): Array<Point3D & { data?: T }>;
}

/**
 * Bounding volume hierarchy for accelerating 3D spatial queries.
 * Use for: ray picking, collision broad-phase, visibility culling.
 * Performance: O(log n) traversal for balanced trees.
 * Import: spatial/bvh.ts
 */
export type BvhAxis = 'x' | 'y' | 'z';
export interface BvhEntry<T> { item: T; bounds: Box3 }
export interface BvhLeaf<T> { type: 'leaf'; bounds: Box3; entries: ReadonlyArray<BvhEntry<T>> }
export interface BvhBranch<T> {
  type: 'branch';
  bounds: Box3;
  axis: BvhAxis;
  left: BvhNode<T>;
  right: BvhNode<T>;
}
export type BvhNode<T> = BvhLeaf<T> | BvhBranch<T>;
export interface BuildBvhOptions<T> {
  getBounds(item: T): Box3;
  maxLeafSize?: number;
  maxDepth?: number;
}
export interface BvhRaycastHit<T> { entry: BvhEntry<T>; distance: number }
export function buildBvh<T>(items: ReadonlyArray<T>, options: BuildBvhOptions<T>): BvhNode<T> | null;
export function queryBvh<T>(
  node: BvhNode<T> | null,
  query: Box3,
  results?: Array<BvhEntry<T>>
): Array<BvhEntry<T>>;
export function raycastBvh<T>(
  node: BvhNode<T> | null,
  ray: Ray3D,
  intersect: (entry: BvhEntry<T>, ray: Ray3D) => number | null,
  maxDistance?: number
): BvhRaycastHit<T> | null;

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
 * Circle vs circle overlap test.
 * Use for: simple collision checks, proximity triggers.
 * Performance: O(1).
 * Import: spatial/circleCollision.ts
 */
export function circleCollision(a: Circle, b: Circle): boolean;

/**
 * Circle vs axis-aligned rectangle (AABB) intersection.
 * Use for: tile collisions, UI hit-tests, broad-phase pruning.
 * Performance: O(1).
 * Import: spatial/circleCollision.ts
 */
export function circleAabbCollision(circle: Circle, rect: Rect): boolean;

/**
 * Circle vs line segment intersection test.
 * Use for: ray/segment hits, visibility checks, bullet tests.
 * Performance: O(1).
 * Import: spatial/circleCollision.ts
 */
export function circleSegmentIntersection(circle: Circle, a: Point, b: Point): boolean;

/**
 * Ray vs segment intersection returning closest hit.
 * Use for: visibility checks, line-of-sight, editor picking.
 * Performance: O(1).
 * Import: spatial/raycast.ts
 */
export interface RaycastHit {
  point: Point;
  distance: number;
}
export function raycastSegment(ray: Ray, a: Point, b: Point): RaycastHit | null;

/**
 * Ray vs AABB intersection using slabs method.
 * Use for: fast occlusion tests, spatial queries, physics sweeps.
 * Performance: O(1).
 * Import: spatial/raycast.ts
 */
export function raycastAabb(ray: Ray, rect: Rect): RaycastHit | null;

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
 * Sprite animation playback mode.
 * Use for: switching between looping, single-shot, and ping-pong playback.
 * Import: gameplay/spriteAnimation.ts
 */
export type SpritePlaybackMode = 'loop' | 'once' | 'ping-pong';

/**
 * Sprite frame definition.
 * Use for: associating timing, payload, and events with each sprite frame.
 * Import: gameplay/spriteAnimation.ts
 */
export interface SpriteFrame<T = number> {
  frame: T;
  duration: number;
  events?: ReadonlyArray<string>;
}

/**
 * Sprite animation configuration options.
 * Use for: configuring playback mode, speed, and starting state.
 * Import: gameplay/spriteAnimation.ts
 */
export interface SpriteAnimationOptions<T = number> {
  frames: ReadonlyArray<SpriteFrame<T>>;
  mode?: SpritePlaybackMode;
  speed?: number;
  playOnStart?: boolean;
  startFrame?: number;
}

/**
 * Sprite animation event payload.
 * Use for: reacting to frame enter, loop, complete, or custom events.
 * Import: gameplay/spriteAnimation.ts
 */
export interface SpriteAnimationEvent<T = number> {
  type: string;
  frame: SpriteFrame<T>;
  frameIndex: number;
  loopCount: number;
}

/**
 * Sprite animation controller runtime API.
 * Use for: updating time, subscribing to events, changing speed/mode.
 * Import: gameplay/spriteAnimation.ts
 */
export interface SpriteAnimationController<T = number> {
  update(delta: number): void;
  getFrame(): SpriteFrame<T>;
  getFrameIndex(): number;
  getFrameTime(): number;
  getProgress(): number;
  getLoopCount(): number;
  isPlaying(): boolean;
  isFinished(): boolean;
  play(): void;
  pause(): void;
  reset(frameIndex?: number): void;
  setSpeed(speed: number): void;
  setMode(mode: SpritePlaybackMode): void;
  on(event: string, handler: (event: SpriteAnimationEvent<T>) => void): () => void;
}

/**
 * Creates a sprite animation controller with frame timing and events.
 * Use for: sprite sheets, UI timelines, icon animations.
 * Performance: O(k) per update where k is frames advanced.
 * Import: gameplay/spriteAnimation.ts
 */
export function createSpriteAnimation<T>(options: SpriteAnimationOptions<T>): SpriteAnimationController<T>;

/**
 * Tween status lifecycle.
 * Use for: checking if a tween is idle, running, or completed.
 * Import: gameplay/tween.ts
 */
export type TweenStatus = 'idle' | 'running' | 'completed';

/**
 * Tween configuration options.
 * Use for: defining interpolation ranges, delay, repeats, and callbacks.
 * Import: gameplay/tween.ts
 */
export interface TweenOptions {
  duration: number;
  delay?: number;
  from: number;
  to: number;
  easing?: (t: number) => number;
  onUpdate?: (value: number, progress: number) => void;
  onComplete?: () => void;
  repeat?: number;
  yoyo?: boolean;
}

/**
 * Tween controller API.
 * Use for: updating individual tweens, pausing, resetting, and inspecting progress.
 * Import: gameplay/tween.ts
 */
export interface TweenController {
  update(delta: number): void;
  getValue(): number;
  getProgress(): number;
  getStatus(): TweenStatus;
  getElapsed(): number;
  play(): void;
  pause(): void;
  reset(): void;
  setSpeed(multiplier: number): void;
  isPlaying(): boolean;
}

/**
 * Tween system configuration options.
 * Use for: setting a global speed multiplier.
 * Import: gameplay/tween.ts
 */
export interface TweenSystemOptions {
  speed?: number;
}

/**
 * Tween system interface.
 * Use for: creating tweens, updating all active tweens, and adjusting global speed.
 * Import: gameplay/tween.ts
 */
export interface TweenSystem {
  create(options: TweenOptions): TweenController;
  update(delta: number): void;
  setGlobalSpeed(multiplier: number): void;
  getGlobalSpeed(): number;
  clear(): void;
}

/**
 * Creates a tween system with optional global speed control.
 * Use for: coordinating UI transitions and gameplay feedback animations.
 * Performance: O(active tweens) per update.
 * Import: gameplay/tween.ts
 */
export function createTweenSystem(options?: TweenSystemOptions): TweenSystem;

/**
 * Platformer physics configuration options.
 * Use for: tuning acceleration, gravity, and jump responsiveness.
 * Import: gameplay/platformerPhysics.ts
 */
export interface PlatformerPhysicsOptions {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  gravity: number;
  jumpVelocity: number;
  maxFallSpeed?: number;
  airControl?: number;
  coyoteTime?: number;
  jumpBufferTime?: number;
  jumpCutMultiplier?: number;
}

/**
 * Platformer character state snapshot.
 * Use for: feeding into collision systems and rendering.
 * Import: gameplay/platformerPhysics.ts
 */
export interface PlatformerCharacterState {
  position: Vector2D;
  velocity: Vector2D;
  onGround: boolean;
}

/**
 * Platformer player input.
 * Use for: representing movement axis and jump presses.
 * Import: gameplay/platformerPhysics.ts
 */
export interface PlatformerInput {
  move: number;
  jump: boolean;
}

/**
 * Platformer update payload.
 * Use for: advancing physics with delta time and collision info.
 * Import: gameplay/platformerPhysics.ts
 */
export interface PlatformerUpdateOptions {
  delta: number;
  input: PlatformerInput;
  onGround: boolean;
}

/**
 * Platformer physics controller API.
 * Use for: updating motion, resetting state, and retuning options.
 * Import: gameplay/platformerPhysics.ts
 */
export interface PlatformerController {
  update(options: PlatformerUpdateOptions): PlatformerCharacterState;
  getState(): PlatformerCharacterState;
  reset(state?: Partial<PlatformerCharacterState>): void;
  setOptions(options: Partial<PlatformerPhysicsOptions>): void;
}

/**
 * Creates a platformer physics controller with coyote time and jump buffering.
 * Use for: responsive side-scroller movement and jump handling.
 * Performance: O(1) per update.
 * Import: gameplay/platformerPhysics.ts
 */
export function createPlatformerController(
  options: PlatformerPhysicsOptions,
  initialState?: PlatformerCharacterState
): PlatformerController;

/**
 * Top-down movement options.
 * Use for: configuring acceleration, deceleration, and max speed for 2D characters.
 * Import: gameplay/topDownMovement.ts
 */
export interface TopDownMovementOptions {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  drag?: number;
  normalizeDiagonal?: boolean;
}

/**
 * Top-down movement state snapshot.
 * Use for: rendering and collision updates.
 * Import: gameplay/topDownMovement.ts
 */
export interface TopDownState {
  position: Vector2D;
  velocity: Vector2D;
  facing: Vector2D;
}

/**
 * Top-down movement input axes.
 * Use for: feeding directional input (-1..1).
 * Import: gameplay/topDownMovement.ts
 */
export interface TopDownInput {
  x: number;
  y: number;
}

/**
 * Top-down movement update payload.
 * Use for: advancing the controller with delta time and current input.
 * Import: gameplay/topDownMovement.ts
 */
export interface TopDownUpdateOptions {
  delta: number;
  input: TopDownInput;
}

/**
 * Top-down movement controller API.
 * Use for: updating state, resetting, and retuning movement parameters.
 * Import: gameplay/topDownMovement.ts
 */
export interface TopDownController {
  update(options: TopDownUpdateOptions): TopDownState;
  getState(): TopDownState;
  reset(state?: Partial<TopDownState>): void;
  setOptions(options: Partial<TopDownMovementOptions>): void;
}

/**
 * Creates a top-down movement controller with acceleration and damping.
 * Use for: eight-direction movement in action or RPG games.
 * Performance: O(1) per update.
 * Import: gameplay/topDownMovement.ts
 */
export function createTopDownController(
  options: TopDownMovementOptions,
  initialState?: TopDownState
): TopDownController;

/**
 * Tile map layer definition.
 * Use for: storing tile ids per layer with optional collision mask.
 * Import: gameplay/tileMap.ts
 */
export interface TileMapLayer {
  name: string;
  data: ReadonlyArray<number>;
  collision?: ReadonlyArray<boolean>;
}

/**
 * Tile map configuration.
 * Use for: describing map dimensions, tile size, layers, and chunking.
 * Import: gameplay/tileMap.ts
 */
export interface TileMapOptions {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  layers: ReadonlyArray<TileMapLayer>;
  chunkWidth?: number;
  chunkHeight?: number;
}

/**
 * Tile map viewport in world coordinates.
 * Use for: determining visible tiles/chunks.
 * Import: gameplay/tileMap.ts
 */
export interface TileMapViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Tile chunk coordinate.
 * Use for: referencing chunks during rendering or streaming.
 * Import: gameplay/tileMap.ts
 */
export interface ChunkCoordinate {
  cx: number;
  cy: number;
}

/**
 * Visible tile description.
 * Use for: rendering visible tiles with layer and world coordinates.
 * Import: gameplay/tileMap.ts
 */
export interface VisibleTile {
  layer: string;
  tileIndex: number;
  tileId: number;
  mapX: number;
  mapY: number;
  worldX: number;
  worldY: number;
}

/**
 * Tile map controller API.
 * Use for: querying tiles, collisions, visible tiles/chunks.
 * Import: gameplay/tileMap.ts
 */
export interface TileMapController {
  getTile(layerName: string, x: number, y: number): number;
  setTile(layerName: string, x: number, y: number, tileId: number): void;
  isCollidable(x: number, y: number): boolean;
  getVisibleTiles(viewport: TileMapViewport): VisibleTile[];
  getVisibleChunks(viewport: TileMapViewport): ChunkCoordinate[];
  getChunkSize(): Vector2D;
}

/**
 * Creates a tile map controller for chunked rendering and collision checks.
 * Use for: tile map streaming, layering, and collision tagging.
 * Performance: O(visible tiles) per query.
 * Import: gameplay/tileMap.ts
 */
export function createTileMapController(options: TileMapOptions): TileMapController;

/**
 * Shadowcasting options for field-of-view calculation.
 * Use for: tuning radius, transparency, and callbacks during FOV computation.
 * Import: gameplay/shadowcasting.ts
 */
export interface ShadowcastOptions {
  radius: number;
  transparent: (x: number, y: number) => boolean;
  reveal?: (x: number, y: number) => void;
}

/**
 * Field-of-view computation result.
 * Use for: checking visibility of tiles.
 * Import: gameplay/shadowcasting.ts
 */
export interface FovResult {
  visible: Set<string>;
  isVisible(x: number, y: number): boolean;
}

/**
 * Boolean grid describing transparency.
 * Use for: building transparency callbacks for shadowcasting.
 * Import: gameplay/shadowcasting.ts
 */
export interface FovGrid {
  width: number;
  height: number;
  tiles: ReadonlyArray<boolean>;
}

/**
 * Computes field of view using recursive shadowcasting.
 * Use for: roguelike FOV, fog-of-war, and lighting probes.
 * Performance: O(radius^2) in practice.
 * Import: gameplay/shadowcasting.ts
 */
export function computeFieldOfView(
  originX: number,
  originY: number,
  options: ShadowcastOptions
): FovResult;

/**
 * Creates a transparency function from a boolean grid.
 * Use for: quick FOV prototypes.
 * Import: gameplay/shadowcasting.ts
 */
export function transparentFromGrid(grid: FovGrid): (x: number, y: number) => boolean;

/**
 * Creates a transparency function backed by a tile map controller.
 * Use for: integrating tile maps with shadowcasting FOV.
 * Import: gameplay/shadowcasting.ts
 */
export function transparentFromTileMap(
  map: TileMapController,
  layerName: string,
  passable: (tileId: number) => boolean
): (x: number, y: number) => boolean;

/**
 * Inventory item representation.
 * Use for: describing stackable items and metadata.
 * Import: gameplay/inventory.ts
 */
export interface InventoryItem<TMeta = unknown> {
  id: string;
  quantity: number;
  metadata?: TMeta;
}

/**
 * Inventory slot container.
 * Use for: iterating over slots and applying UI bindings.
 * Import: gameplay/inventory.ts
 */
export interface InventorySlot<TMeta = unknown> {
  item: InventoryItem<TMeta> | null;
}

/**
 * Inventory configuration options.
 * Use for: defining slot capacity, max stack size, and item filters.
 * Import: gameplay/inventory.ts
 */
export interface InventoryOptions<TMeta = unknown> {
  slots: number;
  maxStack?: number;
  filter?: (item: InventoryItem<TMeta>) => boolean;
}

/**
 * Inventory snapshot serialisation.
 * Use for: saving/loading inventory state.
 * Import: gameplay/inventory.ts
 */
export interface InventorySnapshot<TMeta = unknown> {
  slots: Array<InventoryItem<TMeta> | null>;
}

/**
 * Inventory controller API.
 * Use for: adding/removing items, filtering, and serialising state.
 * Import: gameplay/inventory.ts
 */
export interface InventoryController<TMeta = unknown> {
  addItem(item: AddItemOptions<TMeta>): number;
  removeItem(id: string, quantity: number): number;
  getTotalQuantity(id: string): number;
  getSlots(): ReadonlyArray<InventorySlot<TMeta>>;
  clear(): void;
  filter(predicate: (item: InventoryItem<TMeta>) => boolean): InventoryItem<TMeta>[];
  toJSON(): InventorySnapshot<TMeta>;
  load(snapshot: InventorySnapshot<TMeta>): void;
}

/**
 * Creates a stack-based inventory.
 * Use for: RPG inventories, loot systems, crafting requirements.
 * Import: gameplay/inventory.ts
 */
export function createInventory<TMeta>(options: InventoryOptions<TMeta>): InventoryController<TMeta>;

/**
 * Combatant statistics used for damage calculations.
 * Use for: providing combat state to helpers.
 * Import: gameplay/combat.ts
 */
export interface CombatantStats {
  health: number;
  attack: number;
  defense: number;
  resistance: number;
  critChance?: number;
  critMultiplier?: number;
}

/**
 * Supported damage types.
 * Use for: distinguishing mitigation paths.
 * Import: gameplay/combat.ts
 */
export type DamageType = 'physical' | 'magical' | 'true';

/**
 * Damage modifier options.
 * Use for: tweaking flat bonuses, multipliers, or damage type.
 * Import: gameplay/combat.ts
 */
export interface DamageModifiers {
  flat?: number;
  multiplier?: number;
  type?: DamageType;
  random?: () => number;
}

/**
 * Damage result payload.
 * Use for: applying damage to targets and reporting crits.
 * Import: gameplay/combat.ts
 */
export interface DamageResult {
  damage: number;
  type: DamageType;
  isCrit: boolean;
}

/**
 * Calculates combat damage with optional modifiers.
 * Use for: resolving attacks in RPG systems.
 * Import: gameplay/combat.ts
 */
export function calculateDamage(
  attacker: CombatantStats,
  defender: CombatantStats,
  modifiers?: DamageModifiers
): DamageResult;

/**
 * Applies damage result to a target.
 * Use for: clamping health and producing new combat state.
 * Import: gameplay/combat.ts
 */
export function applyDamage(target: CombatantStats, result: DamageResult): CombatantStats;

/**
 * Cooldown controller API for abilities.
 * Use for: tracking per-ability cooldown timers.
 * Import: gameplay/combat.ts
 */
export interface CooldownController {
  trigger(id: string, cooldown: number): boolean;
  update(delta: number): void;
  reset(): void;
  getRemaining(id: string): number;
}

/**
 * Creates a cooldown controller.
 * Use for: enforcing ability cooldowns.
 * Import: gameplay/combat.ts
 */
export function createCooldownController(): CooldownController;

/**
 * Status effect definition.
 * Use for: describing duration-based effects.
 * Import: gameplay/combat.ts
 */
export interface StatusEffect {
  id: string;
  duration: number;
  tickInterval?: number;
  onApply?: (target: CombatantStats) => void;
  onTick?: (target: CombatantStats) => void;
  onExpire?: (target: CombatantStats) => void;
}

/**
 * Active status effect with runtime timers.
 * Use for: advancing effects over time.
 * Import: gameplay/combat.ts
 */
export interface ActiveStatusEffect extends StatusEffect {
  remaining: number;
  tickTimer?: number;
}

/**
 * Creates an active status effect instance with timers.
 * Use for: instantiating status effects in controllers.
 * Import: gameplay/combat.ts
 */
export function createStatusEffect(effect: StatusEffect): ActiveStatusEffect;

/**
 * Updates active status effects and invokes lifecycle callbacks.
 * Use for: applying dots, buffs, and expiry hooks.
 * Import: gameplay/combat.ts
 */
export function updateStatusEffects(
  target: CombatantStats,
  effects: ActiveStatusEffect[],
  delta: number
): ActiveStatusEffect[];

/**
 * Quest state node definition.
 * Use for: describing quest/dialog states with hooks.
 * Import: gameplay/questMachine.ts
 */
export interface QuestStateNode<TContext extends Record<string, unknown>> {
  id: string;
  terminal?: boolean;
  onEnter?: (context: TContext, payload?: unknown) => void;
  onExit?: (context: TContext, payload?: unknown) => void;
}

/**
 * Quest transition definition.
 * Use for: wiring events to state transitions in quests/dialogs.
 * Import: gameplay/questMachine.ts
 */
export interface QuestTransition<
  TContext extends Record<string, unknown>,
  TEvent = unknown
> {
  from: string;
  to: string;
  event: string;
  condition?: (context: TContext, event: TEvent) => boolean;
  action?: (context: TContext, event: TEvent) => void;
}

/**
 * Quest machine configuration options.
 * Use for: instantiating a quest/dialog state machine.
 * Import: gameplay/questMachine.ts
 */
export interface QuestMachineOptions<
  TContext extends Record<string, unknown>,
  TEvent = unknown
> {
  states: ReadonlyArray<QuestStateNode<TContext>>;
  transitions: ReadonlyArray<QuestTransition<TContext, TEvent>>;
  initial: string;
  context: TContext;
}

/**
 * Quest machine snapshot payload.
 * Use for: serialising quest progress.
 * Import: gameplay/questMachine.ts
 */
export interface QuestMachineSnapshot<TContext extends Record<string, unknown>> {
  state: string;
  context: TContext;
}

/**
 * Quest machine controller API.
 * Use for: driving quest/dialog progression.
 * Import: gameplay/questMachine.ts
 */
export interface QuestMachine<
  TContext extends Record<string, unknown>,
  TEvent = unknown
> {
  send(event: string, payload?: TEvent): boolean;
  getState(): string;
  getContext(): TContext;
  isCompleted(): boolean;
  reset(snapshot?: QuestMachineSnapshot<TContext>): void;
  toJSON(): QuestMachineSnapshot<TContext>;
}

/**
 * Creates a quest/dialog state machine.
 * Use for: branching dialogue, quest progression, narrative scripting.
 * Import: gameplay/questMachine.ts
 */
export function createQuestMachine<
  TContext extends Record<string, unknown>,
  TEvent = unknown
>(options: QuestMachineOptions<TContext, TEvent>): QuestMachine<TContext, TEvent>;

/**
 * Lighting falloff mode identifiers.
 * Use for: controlling light intensity attenuation.
 * Import: gameplay/lighting.ts
 */
export type FalloffMode = 'linear' | 'quadratic' | 'smoothstep';

/**
 * Point light definition for lighting grids.
 * Use for: positioning lights with radius and color.
 * Import: gameplay/lighting.ts
 */
export interface PointLight {
  x: number;
  y: number;
  radius: number;
  intensity?: number;
  falloff?: FalloffMode;
  color?: [number, number, number];
}

/**
 * Lighting grid configuration.
 * Use for: computing lightmaps for tile-based scenes.
 * Import: gameplay/lighting.ts
 */
export interface LightingGridOptions {
  width: number;
  height: number;
  tileSize: number;
  ambient?: number;
  lights: ReadonlyArray<PointLight>;
  obstacles?: (x: number, y: number) => boolean;
}

/**
 * Lighting cell output containing intensity and blended color.
 * Import: gameplay/lighting.ts
 */
export interface LightingCell {
  light: number;
  color: [number, number, number];
}

/**
 * Lighting grid computation result.
 * Import: gameplay/lighting.ts
 */
export interface LightingGridResult {
  width: number;
  height: number;
  cells: LightingCell[];
}

/**
 * Computes a lighting grid with point lights and ambient light.
 * Use for: tile map lighting, fog-of-war, and shading overlays.
 * Performance: O(width × height × lights).
 * Import: gameplay/lighting.ts
 */
export function computeLightingGrid(options: LightingGridOptions): LightingGridResult;

/**
 * Wave definition describing spawn count and timing.
 * Use for: scheduling enemy or event waves.
 * Import: gameplay/waveSpawner.ts
 */
export interface WaveDefinition<T> {
  delay: number;
  count: number;
  template: T;
  interval?: number;
}

/**
 * Wave spawner configuration options.
 * Use for: configuring waves and looping behaviour.
 * Import: gameplay/waveSpawner.ts
 */
export interface WaveSpawnerOptions<T> {
  waves: ReadonlyArray<WaveDefinition<T>>;
  loop?: boolean;
}

/**
 * Spawn payload emitted by wave spawner updates.
 * Import: gameplay/waveSpawner.ts
 */
export interface SpawnPayload<T> {
  waveIndex: number;
  entityIndex: number;
  template: T;
}

/**
 * Wave spawner snapshot for serialization.
 * Import: gameplay/waveSpawner.ts
 */
export interface WaveSpawnerSnapshot {
  waveIndex: number;
  timeUntilNextSpawn: number;
  spawnedInWave: number;
  looped: number;
}

/**
 * Wave spawner controller API.
 * Use for: advancing time and retrieving spawn payloads.
 * Import: gameplay/waveSpawner.ts
 */
export interface WaveSpawner<T> {
  update(delta: number): SpawnPayload<T>[];
  isFinished(): boolean;
  reset(snapshot?: WaveSpawnerSnapshot): void;
  toJSON(): WaveSpawnerSnapshot;
}

/**
 * Creates a wave spawner for timed encounters.
 * Use for: spawning enemies or events in waves.
 * Import: gameplay/waveSpawner.ts
 */
export function createWaveSpawner<T>(options: WaveSpawnerOptions<T>): WaveSpawner<T>;

/**
 * Sound manager configuration options.
 * Use for: budgeting audio channels and optional per-channel limits.
 * Import: gameplay/soundManager.ts
 */
export interface SoundManagerOptions {
  maxChannels: number;
  channelLimits?: Record<string, number>;
  getTime?: () => number;
}

/**
 * Options to request playback of a sound.
 * Use for: requesting sounds with priority, duration, and metadata.
 * Import: gameplay/soundManager.ts
 */
export interface PlaySoundOptions<TMetadata = unknown> {
  soundId: string;
  duration: number;
  priority?: number;
  channel?: string;
  metadata?: TMetadata;
  time?: number;
}

/**
 * Handle representing an active sound.
 * Use for: tracking playing sounds, metadata, and expiry.
 * Import: gameplay/soundManager.ts
 */
export interface SoundHandle<TMetadata = unknown> {
  handleId: number;
  soundId: string;
  channel: string;
  priority: number;
  startedAt: number;
  endsAt: number;
  metadata?: TMetadata;
}

/**
 * Result of attempting to play a sound.
 * Use for: determining whether playback was accepted or preempted another.
 * Import: gameplay/soundManager.ts
 */
export interface PlaySoundResult<TMetadata = unknown> {
  accepted: boolean;
  handle?: SoundHandle<TMetadata>;
  evicted?: SoundHandle<TMetadata>;
  reason?: 'channel-limit';
}

/**
 * Sound manager API.
 * Use for: coordinating channel usage and expiring sounds.
 * Import: gameplay/soundManager.ts
 */
export interface SoundManager<TMetadata = unknown> {
  play(options: PlaySoundOptions<TMetadata>): PlaySoundResult<TMetadata>;
  stop(handleId: number): SoundHandle<TMetadata> | null;
  update(time?: number): SoundHandle<TMetadata>[];
  getActive(): ReadonlyArray<SoundHandle<TMetadata>>;
  setMaxChannels(count: number): void;
  getMaxChannels(): number;
  reset(): SoundHandle<TMetadata>[];
}

/**
 * Creates a sound manager with channel limiting and priority controls.
 * Use for: orchestrating audio playback requests in games.
 * Import: gameplay/soundManager.ts
 */
export function createSoundManager<TMetadata = unknown>(
  options: SoundManagerOptions
): SoundManager<TMetadata>;

/**
 * Enumerates input action signal types.
 * Use for: distinguishing between digital toggles and analog axes.
 * Import: gameplay/inputManager.ts
 */
export type InputActionType = 'digital' | 'analog';

/**
 * Keyboard binding descriptor.
 * Use for: mapping keys (with optional modifiers) to actions.
 * Import: gameplay/inputManager.ts
 */
export interface KeyboardBinding {
  device: 'keyboard';
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

/**
 * Mouse binding descriptor.
 * Use for: connecting pointer buttons to actions.
 * Import: gameplay/inputManager.ts
 */
export interface MouseBinding {
  device: 'mouse';
  button: number;
}

/**
 * Gamepad button binding descriptor.
 * Use for: linking controller buttons to actions.
 * Import: gameplay/inputManager.ts
 */
export interface GamepadButtonBinding {
  device: 'gamepad-button';
  button: string | number;
  gamepadId?: string;
}

/**
 * Gamepad axis binding descriptor.
 * Use for: connecting analog stick axes to actions.
 * Import: gameplay/inputManager.ts
 */
export interface GamepadAxisBinding {
  device: 'gamepad-axis';
  axis: number;
  direction?: 'positive' | 'negative' | 'both';
  threshold?: number;
  gamepadId?: string;
}

/**
 * Union describing supported input bindings.
 * Import: gameplay/inputManager.ts
 */
export type InputBinding =
  | KeyboardBinding
  | MouseBinding
  | GamepadButtonBinding
  | GamepadAxisBinding;

/**
 * Action definition used when creating the input manager.
 * Use for: declaring action ids and default bindings.
 * Import: gameplay/inputManager.ts
 */
export interface InputActionDefinition {
  id: string;
  bindings: ReadonlyArray<InputBinding>;
  type?: InputActionType;
  deadzone?: number;
}

/**
 * Input manager configuration options.
 * Use for: supplying action definitions and time sources.
 * Import: gameplay/inputManager.ts
 */
export interface InputManagerOptions {
  actions: ReadonlyArray<InputActionDefinition>;
  getTime?: () => number;
  defaultAxisThreshold?: number;
}

/**
 * Runtime state snapshot for an action.
 * Import: gameplay/inputManager.ts
 */
export interface InputActionState {
  id: string;
  active: boolean;
  value: number;
  changedAt: number;
  type: InputActionType;
}

/**
 * Keyboard event payload accepted by the manager.
 * Import: gameplay/inputManager.ts
 */
export interface KeyInputEvent {
  type: 'down' | 'up';
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  time?: number;
}

/**
 * Pointer event payload accepted by the manager.
 * Import: gameplay/inputManager.ts
 */
export interface PointerInputEvent {
  type: 'down' | 'up';
  button: number;
  time?: number;
}

/**
 * Gamepad button event payload accepted by the manager.
 * Import: gameplay/inputManager.ts
 */
export interface GamepadButtonEvent {
  type: 'down' | 'up';
  button: string | number;
  value?: number;
  gamepadId?: string;
  time?: number;
}

/**
 * Gamepad axis event payload accepted by the manager.
 * Import: gameplay/inputManager.ts
 */
export interface GamepadAxisEvent {
  axis: number;
  value: number;
  gamepadId?: string;
  time?: number;
}

/**
 * Input manager controller API.
 * Use for: handling events and querying remappable action states.
 * Import: gameplay/inputManager.ts
 */
export interface InputManager {
  handleKeyEvent(event: KeyInputEvent): boolean;
  handlePointerEvent(event: PointerInputEvent): boolean;
  handleGamepadButton(event: GamepadButtonEvent): boolean;
  handleGamepadAxis(event: GamepadAxisEvent): boolean;
  isActive(actionId: string): boolean;
  getValue(actionId: string): number;
  getState(actionId: string): InputActionState | undefined;
  getActions(): ReadonlyArray<InputActionState>;
  getBindings(actionId: string): ReadonlyArray<InputBinding>;
  setBindings(actionId: string, bindings: ReadonlyArray<InputBinding>): void;
  reset(): void;
}

/**
 * Creates an input manager for keyboard, mouse, and gamepad remapping.
 * Use for: abstracting input handling across devices.
 * Import: gameplay/inputManager.ts
 */
export function createInputManager(options: InputManagerOptions): InputManager;

/**
 * Metadata describing a saved slot entry.
 * Import: gameplay/saveManager.ts
 */
export interface SaveSlotMetadata {
  slotId: string;
  checksum: string;
  updatedAt: number;
  size: number;
  version?: number;
}

/**
 * Result returned after saving a slot.
 * Import: gameplay/saveManager.ts
 */
export interface SaveResult {
  metadata: SaveSlotMetadata;
  overwritten?: SaveSlotMetadata;
  evicted?: ReadonlyArray<SaveSlotMetadata>;
}

/**
 * Load failure reasons.
 * Import: gameplay/saveManager.ts
 */
export type LoadError = 'not-found' | 'corrupted' | 'parse-error';

/**
 * Result returned when loading a slot.
 * Import: gameplay/saveManager.ts
 */
export interface LoadResult<T> {
  ok: boolean;
  slotId: string;
  data?: T;
  metadata?: SaveSlotMetadata;
  error?: LoadError;
}

/**
 * Minimal storage adapter contract for persistence.
 * Import: gameplay/saveManager.ts
 */
export interface SaveStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  keys(): Iterable<string>;
}

/**
 * Configuration options for the save manager.
 * Import: gameplay/saveManager.ts
 */
export interface SaveManagerOptions<T> {
  prefix?: string;
  storage?: SaveStorageAdapter;
  serializer?: (data: T) => string;
  deserializer?: (raw: string) => T;
  checksum?: (raw: string) => string;
  getTime?: () => number;
  version?: number;
  maxSlots?: number;
}

/**
 * Save manager API for slot-based persistence.
 * Import: gameplay/saveManager.ts
 */
export interface SaveManager<T> {
  save(slotId: string, data: T, time?: number): SaveResult;
  load(slotId: string): LoadResult<T>;
  delete(slotId: string): SaveSlotMetadata | null;
  list(): ReadonlyArray<SaveSlotMetadata>;
  get(slotId: string): SaveSlotMetadata | null;
  verify(slotId: string): boolean;
  clear(): ReadonlyArray<SaveSlotMetadata>;
  getStorage(): SaveStorageAdapter;
}

/**
 * Creates an in-memory storage adapter useful for tests.
 * Import: gameplay/saveManager.ts
 */
export function createMemorySaveStorage(): SaveStorageAdapter;

/**
 * Creates a save manager with slot metadata and checksum verification.
 * Import: gameplay/saveManager.ts
 */
export function createSaveManager<T>(options: SaveManagerOptions<T>): SaveManager<T>;

/**
 * Screen transition configuration.
 * Use for: defining fade-in/out durations and easing.
 * Import: gameplay/screenTransitions.ts
 */
export interface ScreenTransitionOptions {
  durationIn: number;
  durationOut: number;
  hold?: number;
  easingIn?: (t: number) => number;
  easingOut?: (t: number) => number;
}

/**
 * Snapshot of transition progress.
 * Import: gameplay/screenTransitions.ts
 */
export interface ScreenTransitionState {
  phase: 'idle' | 'in' | 'hold' | 'out' | 'completed';
  progress: number;
  value: number;
  elapsed: number;
  totalDuration: number;
}

/**
 * Controller for screen transitions.
 * Import: gameplay/screenTransitions.ts
 */
export interface ScreenTransitionController {
  start(): void;
  update(delta: number): ScreenTransitionState;
  getState(): ScreenTransitionState;
  reset(): void;
  isActive(): boolean;
  isCompleted(): boolean;
}

/**
 * Creates a transition controller for fades/letterboxing/wipes.
 * Import: gameplay/screenTransitions.ts
 */
export function createScreenTransition(options: ScreenTransitionOptions): ScreenTransitionController;

/**
 * Fade effect helper returning current opacity.
 * Import: gameplay/screenTransitions.ts
 */
export interface FadeResult {
  opacity: number;
}
export function computeFade(state: ScreenTransitionState): FadeResult;

/**
 * Horizontal wipe effect helper.
 * Import: gameplay/screenTransitions.ts
 */
export interface WipeResult {
  offset: number;
  direction: 'left' | 'right';
}
export function computeHorizontalWipe(state: ScreenTransitionState, direction?: 'left' | 'right'): WipeResult;

/**
 * Letterbox effect helper returning bar size.
 * Import: gameplay/screenTransitions.ts
 */
export interface LetterboxResult {
  barSize: number;
}
export function computeLetterbox(state: ScreenTransitionState, maxBar: number): LetterboxResult;

/**
 * FSM state definition.
 * Import: ai/fsm.ts
 */
export interface StateDefinition<TContext, TEvent> {
  id: string;
  onEnter?: (context: TContext, event?: TEvent) => void;
  onExit?: (context: TContext, event?: TEvent) => void;
  onUpdate?: (context: TContext, delta: number) => void;
}

/**
 * FSM transition definition.
 * Import: ai/fsm.ts
 */
export interface TransitionDefinition<TContext, TEvent> {
  from: string;
  to: string;
  event: string;
  condition?: (context: TContext, event: TEvent) => boolean;
  action?: (context: TContext, event: TEvent) => void;
}

/**
 * Finite state machine configuration options.
 * Import: ai/fsm.ts
 */
export interface FSMOptions<TContext, TEvent> {
  initial: string;
  context: TContext;
  states: ReadonlyArray<StateDefinition<TContext, TEvent>>;
  transitions?: ReadonlyArray<TransitionDefinition<TContext, TEvent>>;
}

/**
 * Finite state machine controller API.
 * Import: ai/fsm.ts
 */
export interface FSMController<TContext, TEvent> {
  send(eventName: string, payload: TEvent): boolean;
  update(delta: number): void;
  getState(): string;
  getContext(): TContext;
  reset(stateId?: string): void;
}

/**
 * Creates a finite state machine.
 * Import: ai/fsm.ts
 */
export function createFSM<TContext, TEvent>(options: FSMOptions<TContext, TEvent>): FSMController<TContext, TEvent>;

/**
 * Parent selection function signature for the GA helper.
 * Import: ai/genetic.ts
 */
export type ParentSelector<T> = (
  population: ReadonlyArray<T>,
  fitnesses: ReadonlyArray<number>,
  random: () => number,
  maximize: boolean
) => number;

/**
 * Genetic algorithm configuration options.
 * Import: ai/genetic.ts
 */
export interface GeneticAlgorithmOptions<T> {
  population: ReadonlyArray<T>;
  fitness: (individual: T) => number;
  mutate: (individual: T, random: () => number) => T;
  crossover?: (a: T, b: T, random: () => number) => T;
  selection?: ParentSelector<T>;
  elitism?: number;
  maximize?: boolean;
  random?: () => number;
}

/**
 * Genetic algorithm controller.
 * Import: ai/genetic.ts
 */
export interface GeneticAlgorithmController<T> {
  step(): void;
  run(generations: number): void;
  getPopulation(): ReadonlyArray<T>;
  getBest(): { individual: T; fitness: number };
  getGeneration(): number;
}

/**
 * Creates a genetic algorithm helper for evolutionary optimisation.
 * Import: ai/genetic.ts
 */
export function createGeneticAlgorithm<T>(
  options: GeneticAlgorithmOptions<T>
): GeneticAlgorithmController<T>;

/**
 * Influence map source definition.
 * Import: ai/influenceMap.ts
 */
export interface InfluenceSource {
  position: { x: number; y: number };
  strength: number;
  radius?: number;
  falloff?: 'linear' | 'inverse' | 'constant';
}

/**
 * Influence map configuration options.
 * Import: ai/influenceMap.ts
 */
export interface InfluenceMapOptions {
  width: number;
  height: number;
  cellSize?: number;
  sources: ReadonlyArray<InfluenceSource>;
  obstacles?: (x: number, y: number) => boolean;
  /** Optional [0, 1] smoothing factor applied after contributions. */
  decay?: number;
}

/**
 * Influence map result payload.
 * Import: ai/influenceMap.ts
 */
export interface InfluenceMapResult {
  width: number;
  height: number;
  cellSize: number;
  values: Float32Array;
}

/**
 * Computes an influence map for AI positioning.
 * Import: ai/influenceMap.ts
 */
export function computeInfluenceMap(options: InfluenceMapOptions): InfluenceMapResult;
/**
 * Item insertion payload used by the inventory controller.
 * Use for: adding items with quantity and metadata.
 * Import: gameplay/inventory.ts
 */
export interface AddItemOptions<TMeta = unknown> {
  id: string;
  quantity: number;
  metadata?: TMeta;
}

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
 * Knuth–Morris–Pratt substring search.
 * Use for: searching within large texts with linear complexity.
 * Performance: O(n + m) where n = text length, m = pattern length.
 * Import: search/kmp.ts
 */
export interface KMPSearchOptions {
  text: string;
  pattern: string;
  caseSensitive?: boolean;
}
export function kmpSearch(options: KMPSearchOptions): number[];

/**
 * Rabin–Karp substring search supporting multiple patterns.
 * Use for: scanning texts for multiple signatures with rolling hashes.
 * Performance: O(n + m) expected, depending on hash collisions.
 * Import: search/rabinKarp.ts
 */
export interface RabinKarpOptions {
  text: string;
  patterns: ReadonlyArray<string>;
  prime?: number;
  base?: number;
  caseSensitive?: boolean;
}
export function rabinKarp(options: RabinKarpOptions): Record<string, number[]>;

/**
 * Boyer–Moore substring search with bad-character and good-suffix heuristics.
 * Use for: efficient single-pattern searches on large texts.
 * Performance: O(n) average case.
 * Import: search/boyerMoore.ts
 */
export interface BoyerMooreOptions {
  text: string;
  pattern: string;
  caseSensitive?: boolean;
}
export function boyerMooreSearch(options: BoyerMooreOptions): number[];

/**
 * Levenshtein edit distance between two strings.
 * Use for: spellcheck, similarity scoring, diff tools.
 * Performance: O(n × m).
 * Import: search/levenshtein.ts
 */
export function levenshteinDistance(a: string, b: string): number;

/**
 * Suffix array construction with LCP computation.
 * Use for: substring queries, suffix automata, indexing.
 * Performance: O(n log n) for suffix array, O(n) for LCP.
 * Import: search/suffixArray.ts
 */
export interface SuffixArrayOptions {
  text: string;
  caseSensitive?: boolean;
}
export interface SuffixArrayResult {
  suffixArray: number[];
  lcpArray: number[];
}
export function buildSuffixArray(options: SuffixArrayOptions): SuffixArrayResult;

/**
 * Longest common subsequence helpers.
 * Import: search/lcs.ts
 */
export interface LCSOptions {
  a: string;
  b: string;
}
export interface LCSResult {
  length: number;
  sequence: string;
}
export interface DiffOp {
  type: 'equal' | 'insert' | 'delete';
  value: string;
}
export function longestCommonSubsequence(options: LCSOptions): LCSResult;
export function diffStrings(options: LCSOptions): DiffOp[];

/**
 * Aho–Corasick multi-pattern automaton.
 * Use for: scanning texts for many patterns efficiently with overlaps.
 * Performance: O(n + m + z) where n=text length, m=total pattern length, z=matches.
 * Import: search/ahoCorasick.ts
 */
export interface AhoBuildOptions {
  patterns: ReadonlyArray<string>;
  caseSensitive?: boolean;
}
export interface AhoAutomaton {
  search(text: string): Record<string, number[]>;
}
export function createAhoCorasick(options: AhoBuildOptions): AhoAutomaton;

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
export interface DiffJsonAdvancedOptions {
  ignoreKeys?: ReadonlyArray<string>;
  pathFilter?: (path: JsonPathSegment[]) => boolean;
}
export function diffJsonAdvanced(
  previous: JsonValue,
  next: JsonValue,
  options?: DiffJsonAdvancedOptions
): JsonDiffOperation[];
export interface ApplyJsonDiffOptions {
  shouldApply?: (operation: JsonDiffOperation) => boolean;
  pathFilter?: (path: JsonPathSegment[]) => boolean;
}
export function applyJsonDiffSelective<T extends JsonValue>(
  value: T,
  diff: JsonDiffOperation[],
  options?: ApplyJsonDiffOptions
): JsonValue;

/**
 * Flattens nested structures into key/value pairs.
 * Use for: serialising nested configs, diffing deeply nested settings.
 * Import: data/flatten.ts
 */
export interface FlattenOptions {
  delimiter?: string;
}
export function flatten(value: unknown, options?: FlattenOptions): Record<string, unknown>;

/**
 * Expands flattened key/value pairs back into nested structures.
 * Use for: restoring configuration objects, merging patches.
 * Import: data/flatten.ts
 */
export interface UnflattenOptions {
  delimiter?: string;
}
export function unflatten(entries: Record<string, unknown>, options?: UnflattenOptions): unknown;

/**
 * Paginates arrays with metadata describing the slice.
 * Use for: client-side paging, infinite scroll, batching exports.
 * Performance: O(pageSize) for slicing.
 * Import: data/pagination.ts
 */
export interface PaginateOptions<T> {
  items: ReadonlyArray<T>;
  page: number;
  pageSize: number;
}
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
export interface PaginationResult<T> {
  items: T[];
  metadata: PaginationMetadata;
}
export function paginate<T>(options: PaginateOptions<T>): PaginationResult<T>;

/**
 * Diffs tree structures while preserving node identity.
 * Use for: UI virtual DOM reconciliation, scene graphs, hierarchical state.
 * Import: data/treeDiff.ts
 */
export interface TreeNode<TValue = unknown> {
  id: string;
  value?: TValue;
  children?: TreeNode<TValue>[];
}
export interface TreeInsertOperation<TValue = unknown> {
  type: 'insert';
  id: string;
  parentId: string | null;
  index: number;
  node: TreeNode<TValue>;
}
export interface TreeRemoveOperation {
  type: 'remove';
  id: string;
  parentId: string | null;
}
export interface TreeMoveOperation {
  type: 'move';
  id: string;
  parentId: string | null;
  index: number;
}
export interface TreeUpdateOperation<TValue = unknown> {
  type: 'update';
  id: string;
  value: TValue | undefined;
  hasValue: boolean;
}
export type TreeDiffOperation<TValue = unknown> =
  | TreeInsertOperation<TValue>
  | TreeRemoveOperation
  | TreeMoveOperation
  | TreeUpdateOperation<TValue>;
export interface TreeDiffOptions<TValue = unknown> {
  isEqual?: (previous: TreeNode<TValue>, next: TreeNode<TValue>) => boolean;
}
export function diffTree<TValue = unknown>(
  previous: ReadonlyArray<TreeNode<TValue>>,
  next: ReadonlyArray<TreeNode<TValue>>,
  options?: TreeDiffOptions<TValue>
): TreeDiffOperation<TValue>[];
export function applyTreeDiff<TValue = unknown>(
  tree: ReadonlyArray<TreeNode<TValue>>,
  diff: ReadonlyArray<TreeDiffOperation<TValue>>
): TreeNode<TValue>[];

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

/**
 * Binary heap (priority queue) with custom comparator.
 * Use for: A*/Dijkstra, schedulers, real-time queues.
 * Import: data/binaryHeap.ts
 */
export class BinaryHeap<T> {
  constructor(compare: (a: T, b: T) => number, items?: Iterable<T>);
  readonly size: number;
  peek(): T | undefined;
  push(value: T): void;
  pop(): T | undefined;
}

/**
 * Bloom filter (probabilistic set with no false negatives).
 * Use for: quick membership checks, caching fronts, anti-spam.
 * Import: data/bloomFilter.ts
 */
export interface BloomFilterOptions {
  size: number;
  hashes: number;
  seed?: number;
}
export class BloomFilter {
  constructor(options: BloomFilterOptions);
  add(value: string | number | Uint8Array): void;
  has(value: string | number | Uint8Array): boolean;
  static fromCapacity(capacity: number, errorRate?: number, seed?: number): BloomFilter;
}

/**
 * Segment tree for range queries with point updates.
 * Use for: range sums/min/max and similar associative operations.
 * Import: data/segmentTree.ts
 */
export interface SegmentTreeOptions<T> {
  values: ReadonlyArray<T>;
  combine?: (a: T, b: T) => T;
  identity?: T;
}
export class SegmentTree<T = number> {
  constructor(options: SegmentTreeOptions<T>);
  update(index: number, value: T): void;
  query(left: number, right: number): T;
}

/**
 * Skip list (probabilistic ordered set) with seeded RNG.
 * Use for: ordered sets/maps with expected O(log n) ops.
 * Import: data/skipList.ts
 */
export interface SkipListOptions<T> {
  compare?: (a: T, b: T) => number;
  p?: number;
  maxLevel?: number;
  seed?: number;
}
export class SkipList<T> {
  constructor(options?: SkipListOptions<T>);
  has(value: T): boolean;
  insert(value: T): void;
  remove(value: T): boolean;
  values(): IterableIterator<T>;
}

/**
 * Run-length encoding for strings.
 * Use for: simple compression of repetitive text.
 * Import: data/rle.ts
 */
export interface RlePair { char: string; count: number }
export function runLengthEncode(input: string): RlePair[];
export function runLengthDecode(pairs: ReadonlyArray<RlePair>): string;

/**
 * Base64 encode/decode utilities (UTF-8 strings and bytes).
 * Use for: compact textual transport, data URIs, wire formats.
 * Import: data/base64.ts
 */
export function base64Encode(input: string | Uint8Array): string;
export function base64Decode(b64: string): Uint8Array;

/**
 * Huffman coding utilities for entropy compression.
 * Use for: building compact prefix codes for textual payloads.
 * Import: data/huffman.ts
 */
export interface HuffmanEncodedResult { bitString: string; table: HuffmanTable }
export type HuffmanTable = Record<string, string>;
export function createHuffmanTable(input: string): HuffmanTable;
export function huffmanEncode(input: string): HuffmanEncodedResult;
export function huffmanDecode(encoded: string, table: Readonly<HuffmanTable>): string;

/**
 * LZ77 dictionary compression helper.
 * Use for: streaming compression with sliding window back-references.
 * Import: data/lz77.ts
 */
export interface Lz77Token { offset: number; length: number; next: string }
export interface Lz77Options { windowSize?: number; lookaheadSize?: number }
export function lz77Compress(input: string, options?: Lz77Options): Lz77Token[];
export function lz77Decompress(tokens: ReadonlyArray<Lz77Token>): string;

/**
 * Disjoint Set Union (Union-Find) with path compression and union by size.
 * Use for: connectivity queries, Kruskal MST, clustering.
 * Import: data/unionFind.ts
 */
export class UnionFind<T = number> {
  constructor(elements?: Iterable<T>);
  makeSet(x: T): void;
  find(x: T): T;
  union(a: T, b: T): boolean;
  connected(a: T, b: T): boolean;
  size(x: T): number;
}

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

/**
 * Weighted edge representation for MST computation.
 * Import: graph/kruskal.ts
 */
export interface WeightedEdge {
  source: string;
  target: string;
  weight: number;
}

/**
 * Options for computing a minimum spanning tree via Kruskal's algorithm.
 * Import: graph/kruskal.ts
 */
export interface KruskalOptions {
  nodes: ReadonlyArray<string>;
  edges: ReadonlyArray<WeightedEdge>;
}

/**
 * Result payload for a minimum spanning tree.
 * Import: graph/kruskal.ts
 */
export interface MinimumSpanningTree {
  edges: WeightedEdge[];
  totalWeight: number;
}

/**
 * Computes a minimum spanning tree using Kruskal's algorithm.
 * Import: graph/kruskal.ts
 */
export function computeMinimumSpanningTree(options: KruskalOptions): MinimumSpanningTree;

/**
 * Strongly connected components result payload.
 * Import: graph/scc.ts
 */
export interface SCCResult {
  components: string[][];
}

/**
 * Computes strongly connected components via Tarjan's algorithm.
 * Import: graph/scc.ts
 */
export function computeStronglyConnectedComponents(graph: Graph): SCCResult;

/**
 * Builds a condensation DAG from SCCs where nodes are component indices.
 * Import: graph/scc.ts
 */
export function buildCondensationGraph(graph: Graph, components: string[][]): Graph;

/**
 * Edge description for capacity graphs.
 * Import: graph/maxflow.ts
 */
export interface FlowEdge {
  source: string;
  target: string;
  capacity: number;
}

/**
 * Dinic maximum flow configuration.
 * Import: graph/maxflow.ts
 */
export interface MaxFlowOptions {
  nodes: ReadonlyArray<string>;
  edges: ReadonlyArray<FlowEdge>;
  source: string;
  sink: string;
}

/**
 * Maximum flow result with per-edge flows.
 * Import: graph/maxflow.ts
 */
export interface MaxFlowResult {
  maxFlow: number;
  flows: Array<{ source: string; target: string; flow: number }>;
}

/**
 * Computes maximum flow using Dinic's algorithm with residual network.
 * Import: graph/maxflow.ts
 */
export function computeMaximumFlowDinic(options: MaxFlowOptions): MaxFlowResult;

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
 * Closest pair of points in 2D space.
 * Use for: nearest neighbour queries, clustering seeds, geometric stats.
 * Performance: O(n log n).
 * Import: geometry/closestPair.ts
 */
export interface ClosestPairResult { distance: number; pair: [Point, Point] | null }
export function closestPair(points: ReadonlyArray<Point>): ClosestPairResult;

// ============================================================================
// ⚙️ PHYSICS & FOLD BARRIERS
// ============================================================================

/**
 * Registry for Fold constraint factory implementations.
 * Use for: hooking cubic/contact/wall barrier evaluators into the solver.
 * Import: physics/fold/index.ts
 */
export function createFoldConstraintRegistry(): FoldConstraintRegistry;

/**
 * Factory for the cubic barrier potential described in Fold.
 * Use for: enforcing inequality constraints with C^2 continuity.
 * Import: physics/fold/cubicBarrier.ts
 */
export interface CubicBarrierOptions {
  id?: string;
  stiffness?: number;
  maxGap?: number;
  direction?: Vector3D;
}
export function createCubicBarrier(options?: CubicBarrierOptions): FoldConstraint;

/**
 * Stiffness design principle helper for frozen Fold barriers.
 * Use for: computing \bar\kappa using mass and Hessian terms.
 * Import: physics/fold/stiffness.ts
 */
export interface StiffnessDesignInput {
  gap: number;
  effectiveMass: number;
  direction: Vector3D;
  hessian: Matrix3x3;
}
export interface StiffnessDesignOptions {
  epsilon?: number;
  min?: number;
  max?: number;
}
export function computeFrozenStiffness(input: StiffnessDesignInput, options?: StiffnessDesignOptions): number;

/**
 * Contact barrier leveraging Fold extended direction scaling.
 * Use for: point-triangle and edge-edge contact inequality enforcement.
 * Import: physics/fold/contactBarrier.ts
 */
export interface ContactBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxGap?: number;
  direction?: Vector3D;
  extendedDirectionScale?: number;
}
export function createContactBarrier(options?: ContactBarrierOptions): FoldConstraint;

/**
 * Pin constraint barrier using cubic barrier formulation.
 * Use for: soft positional pinning with Fold barrier guarantees.
 * Import: physics/fold/pinBarrier.ts
 */
export interface PinBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxGap?: number;
  direction?: Vector3D;
}
export function createPinBarrier(options?: PinBarrierOptions): FoldConstraint;

/**
 * Wall constraint barrier for plane contacts.
 * Use for: enforcing collision against static planes with Fold guarantees.
 * Import: physics/fold/wallBarrier.ts
 */
export interface WallBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxGap?: number;
  normal?: Vector3D;
  planePoint?: Vector3D;
}
export function createWallBarrier(options?: WallBarrierOptions): FoldConstraint;

/**
 * Triangle strain-limiting barrier using deformation singular values.
 * Use for: preventing excessive stretch/compression in Fold primitives.
 * Import: physics/fold/strainBarrier.ts
 */
export interface StrainBarrierOptions {
  id?: string;
  stiffnessOverride?: number;
  maxStretch?: number;
  minCompression?: number;
  direction?: Vector3D;
}
export function createStrainBarrier(options?: StrainBarrierOptions): FoldConstraint;

/**
 * Friction potential tied to contact force magnitude.
 * Use for: tangential friction response in Fold contact solver.
 * Import: physics/fold/frictionPotential.ts
 */
export interface FrictionOptions {
  id?: string;
  coefficient?: number;
  epsilon?: number;
}
export function createFrictionPotential(options?: FrictionOptions): FoldConstraint;

export type FoldConstraintType =
  | 'cubic-barrier'
  | 'contact-barrier'
  | 'pin-barrier'
  | 'wall-barrier'
  | 'strain-barrier'
  | 'friction'
  | 'assembly'
  | 'gap-evaluator';

export interface FoldConstraintState {
  gap: number;
  maxGap: number;
  stiffness: number;
  direction: Vector3D;
  extendedDirection?: Vector3D;
  effectiveMass?: number;
  metadata?: Record<string, unknown>;
}

export interface FoldComputationContext {
  deltaTime: number;
  iteration?: number;
  time?: number;
}

export interface FoldConstraintEvaluation {
  energy: number;
  gradient: Vector3D;
  hessian: Matrix3x3;
}

export interface FoldConstraint<TState = FoldConstraintState, TResult = FoldConstraintEvaluation> {
  readonly type: FoldConstraintType;
  readonly id?: string;
  enabled: boolean;
  evaluate(state: TState, context: FoldComputationContext): TResult;
}

export interface FoldConstraintFactory<TConfig, TState = FoldConstraintState, TResult = FoldConstraintEvaluation> {
  readonly type: FoldConstraintType;
  create(config: TConfig): FoldConstraint<TState, TResult>;
}

export interface FoldConstraintRegistry {
  register<TConfig>(factory: FoldConstraintFactory<TConfig>): void;
  get(type: FoldConstraintType): FoldConstraintFactory<unknown> | undefined;
  list(): ReadonlyArray<FoldConstraintFactory<unknown>>;
}

export interface FoldSolverSettings {
  maxIterations: number;
  tolerance: number;
  allowEarlyExit?: boolean;
}

export interface FoldSystemState {
  positions: Array<Vector3D>;
  velocities: Array<Vector3D>;
  constraints: Array<FoldConstraint>;
  settings: FoldSolverSettings;
}

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

/**
 * RGB color representation.
 * Use for: interop between CSS colors and rendering utilities.
 * Import: visual/color.ts
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * HSL color representation.
 * Use for: manipulating saturation and lightness in color tools.
 * Import: visual/color.ts
 */
export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

/**
 * Options for blending RGB colors.
 * Use for: creating palette variations and gradients.
 * Import: visual/color.ts
 */
export interface MixColorOptions {
  ratio?: number;
}

/**
 * Converts a hex color string into RGB components.
 * Use for: parsing palette tokens, shader inputs, CSS colours.
 * Import: visual/color.ts
 */
export function hexToRgb(hex: string): RGBColor;

/**
 * Converts RGB components into a hex color string.
 * Use for: serialising computed colours, theme export.
 * Import: visual/color.ts
 */
export function rgbToHex(color: RGBColor): string;

/**
 * Converts an RGB color to HSL.
 * Use for: adjusting saturation/lightness while preserving hue.
 * Import: visual/color.ts
 */
export function rgbToHsl(color: RGBColor): HSLColor;

/**
 * Converts an HSL color back to RGB.
 * Use for: creating display-ready colors after HSL manipulations.
 * Import: visual/color.ts
 */
export function hslToRgb(color: HSLColor): RGBColor;

/**
 * Blends two RGB colors together.
 * Use for: highlight colors, gradients, and hover states.
 * Import: visual/color.ts
 */
export function mixRgbColors(a: RGBColor, b: RGBColor, options?: MixColorOptions): RGBColor;

/**
 * Node definition for force-directed layout input.
 * Use for: positioning graph vertices in 2D space.
 * Import: visual/forceDirected.ts
 */
export interface ForceDirectedNodeInput {
  id: string;
  x?: number;
  y?: number;
  fixed?: boolean;
}

/**
 * Resulting node with resolved coordinates after layout.
 * Use for: rendering graphs, network diagrams, simulations.
 * Import: visual/forceDirected.ts
 */
export interface ForceDirectedNode extends ForceDirectedNodeInput {
  x: number;
  y: number;
}

/**
 * Edge definition for force-directed layout.
 * Use for: describing relationships between nodes.
 * Import: visual/forceDirected.ts
 */
export interface ForceDirectedEdge {
  source: string;
  target: string;
  weight?: number;
}

/**
 * Configuration options for the force-directed layout.
 * Use for: tuning iteration count, repulsion, gravity, and bounds.
 * Import: visual/forceDirected.ts
 */
export interface ForceDirectedLayoutOptions {
  nodes: ReadonlyArray<ForceDirectedNodeInput>;
  edges: ReadonlyArray<ForceDirectedEdge>;
  width?: number;
  height?: number;
  iterations?: number;
  repulsion?: number;
  attraction?: number;
  damping?: number;
  gravity?: number;
  initialTemperature?: number;
  random?: () => number;
}

/**
 * Result payload from the force-directed layout computation.
 * Use for: feeding coordinates into rendering pipelines.
 * Import: visual/forceDirected.ts
 */
export interface ForceDirectedLayoutResult {
  nodes: ForceDirectedNode[];
}

/**
 * Computes 2D coordinates for a graph using a force-directed method.
 * Use for: network visualisation, relationship mapping, graph diagrams.
 * Import: visual/forceDirected.ts
 */
export function computeForceDirectedLayout(
  options: ForceDirectedLayoutOptions
): ForceDirectedLayoutResult;

/**
 * Scalar field for marching squares contour extraction.
 * Use for: density maps, heatmaps, elevation grids.
 * Import: visual/marchingSquares.ts
 */
export interface ScalarField {
  data: ReadonlyArray<ReadonlyArray<number>>;
  cellSize?: number;
}

/**
 * Options for marching squares contour extraction.
 * Use for: generating isolines from scalar fields.
 * Import: visual/marchingSquares.ts
 */
export interface MarchingSquaresOptions {
  field: ScalarField | ReadonlyArray<ReadonlyArray<number>>;
  threshold?: number;
}

/**
 * 2D point type for marching squares results.
 * Use for: interoperating with rendering APIs.
 * Import: visual/marchingSquares.ts
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Line segment returned by marching squares.
 * Use for: drawing contour polylines.
 * Import: visual/marchingSquares.ts
 */
export interface LineSegment {
  start: Point2D;
  end: Point2D;
}

/**
 * Marching squares result payload.
 * Use for: feeding contour segments into renderers.
 * Import: visual/marchingSquares.ts
 */
export interface MarchingSquaresResult {
  segments: LineSegment[];
}

/**
 * Computes contour segments using the marching squares algorithm.
 * Use for: isolines, heatmap boundaries, scalar field visualisation.
 * Import: visual/marchingSquares.ts
 */
export function computeMarchingSquares(options: MarchingSquaresOptions): MarchingSquaresResult;

/**
 * Scalar field configuration for marching cubes.
 * Use for: volumetric data, signed distance fields, density grids.
 * Import: visual/marchingCubes.ts
 */
export interface ScalarField3D {
  data: ReadonlyArray<ReadonlyArray<ReadonlyArray<number>>>;
  cellSize?: number | { x: number; y: number; z: number };
}

/**
 * Marching cubes configuration options.
 * Use for: extracting isosurfaces from 3D scalar fields.
 * Import: visual/marchingCubes.ts
 */
export interface MarchingCubesOptions {
  field: ScalarField3D | ReadonlyArray<ReadonlyArray<ReadonlyArray<number>>>;
  threshold?: number;
}

/**
 * 3D vector representation used by marching cubes.
 * Use for: triangle vertices, normals, mesh construction.
 * Import: visual/marchingCubes.ts
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Triangle output from marching cubes.
 * Use for: mesh generation, collision geometry, visualization.
 * Import: visual/marchingCubes.ts
 */
export interface Triangle {
  a: Vector3;
  b: Vector3;
  c: Vector3;
}

/**
 * Marching cubes result payload.
 * Use for: converting scalar fields into triangle meshes.
 * Import: visual/marchingCubes.ts
 */
export interface MarchingCubesResult {
  triangles: Triangle[];
}

/**
 * Computes triangles using the marching cubes algorithm.
 * Use for: isosurface extraction, voxel rendering, volumetric meshing.
 * Import: visual/marchingCubes.ts
 */
export function computeMarchingCubes(options: MarchingCubesOptions): MarchingCubesResult;

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

export interface Point3D extends Point {
  z: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Box3 {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

export interface Ray3D {
  origin: Point3D;
  direction: Vector3D;
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
