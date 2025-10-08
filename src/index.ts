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
    generateRecursiveDivisionMaze: 'examples/mazeDivision.ts',
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
    kmpSearch: 'examples/search.ts',
    rabinKarp: 'examples/search.ts',
    boyerMooreSearch: 'examples/search.ts',
    buildSuffixArray: 'examples/search.ts',
    longestCommonSubsequence: 'examples/search.ts',
    diffStrings: 'examples/search.ts',
  },
  data: {
    diff: 'examples/jsonDiff.ts',
    deepClone: 'examples/jsonDiff.ts',
    groupBy: 'examples/jsonDiff.ts',
    diffJson: 'examples/jsonDiff.ts',
    applyJsonDiff: 'examples/jsonDiff.ts',
    applyJsonDiffSelective: 'examples/jsonDiff.ts',
    flatten: 'examples/jsonDiff.ts',
    unflatten: 'examples/jsonDiff.ts',
    paginate: 'examples/pagination.ts',
    diffTree: 'examples/treeDiff.ts',
    applyTreeDiff: 'examples/treeDiff.ts',
  },
  performance: {
    debounce: 'examples/requestDedup.ts',
    throttle: 'examples/requestDedup.ts',
    LRUCache: 'examples/requestDedup.ts',
    memoize: 'examples/requestDedup.ts',
    deduplicateRequest: 'examples/requestDedup.ts',
    clearRequestDedup: 'examples/requestDedup.ts',
    calculateVirtualRange: 'examples/virtualScroll.ts',
    createWeightedAliasSampler: 'examples/weightedAlias.ts',
    createObjectPool: 'examples/objectPool.ts',
    fisherYatesShuffle: 'examples/fisherYates.ts',
  },
  gameplay: {
    createDeltaTimeManager: 'examples/deltaTime.ts',
    createFixedTimestepLoop: 'examples/fixedTimestep.ts',
    createCamera2D: 'examples/camera2D.ts',
    createParticleSystem: 'examples/particleSystem.ts',
    createSpriteAnimation: 'examples/spriteAnimation.ts',
    createTweenSystem: 'examples/tween.ts',
    createPlatformerController: 'examples/platformerPhysics.ts',
    createTopDownController: 'examples/topDownMovement.ts',
    createTileMapController: 'examples/tileMap.ts',
    computeFieldOfView: 'examples/shadowcasting.ts',
    createInventory: 'examples/inventory.ts',
    calculateDamage: 'examples/combat.ts',
    createCooldownController: 'examples/combat.ts',
    createQuestMachine: 'examples/quest.ts',
    computeLightingGrid: 'examples/lighting.ts',
    createWaveSpawner: 'examples/waveSpawner.ts',
    createSoundManager: 'examples/soundManager.ts',
    createInputManager: 'examples/inputManager.ts',
    createSaveManager: 'examples/saveManager.ts',
    createScreenTransition: 'examples/screenTransitions.ts',
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
    createFSM: 'examples/fsm.ts',
    createGeneticAlgorithm: 'examples/genetic.ts',
    computeInfluenceMap: 'examples/influenceMap.ts',
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
    bresenhamLine: 'examples/bresenham.ts',
  },
  visual: {
    easing: 'examples/visual.ts',
    quadraticBezier: 'examples/visual.ts',
    cubicBezier: 'examples/visual.ts',
    hexToRgb: 'examples/color.ts',
    rgbToHex: 'examples/color.ts',
    rgbToHsl: 'examples/color.ts',
    hslToRgb: 'examples/color.ts',
    mixRgbColors: 'examples/color.ts',
    computeForceDirectedLayout: 'examples/forceDirected.ts',
    computeMarchingSquares: 'examples/marchingSquares.ts',
    computeMarchingCubes: 'examples/marchingCubes.ts',
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

/**
 * Recursive division maze generator for structured layouts.
 *
 * Example file: examples/mazeDivision.ts
 */
export { generateRecursiveDivisionMaze } from './procedural/maze.js';

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
 * Weighted alias sampler for constant-time discrete sampling.
 *
 * Example file: examples/weightedAlias.ts
 */
export { createWeightedAliasSampler } from './util/weightedAlias.js';

/**
 * Object pool helper for reusing allocations.
 *
 * Example file: examples/objectPool.ts
 */
export { createObjectPool } from './util/objectPool.js';

/**
 * Fisher–Yates shuffling utility for unbiased permutations.
 *
 * Example file: examples/fisherYates.ts
 */
export { fisherYatesShuffle } from './util/fisherYates.js';

/**
 * Virtual scroll type exports to help define rendering contracts.
 */
export type {
  VirtualRange,
  VirtualItem,
  VirtualScrollOptions,
} from './util/virtualScroll.js';


// ============================================================================
// 🕹️ GAMEPLAY SYSTEMS
// ============================================================================

/**
 * Delta-time manager that clamps spikes and smooths frame durations.
 *
 * Example file: examples/deltaTime.ts
 */
export { createDeltaTimeManager } from './util/deltaTime.js';

/**
 * Delta-time manager types for smoothing configuration and runtime control.
 */
export type { DeltaTimeOptions, DeltaTimeManager } from './util/deltaTime.js';

/**
 * Fixed timestep loop for deterministic gameplay updates.
 *
 * Example file: examples/fixedTimestep.ts
 */
export { createFixedTimestepLoop } from './util/fixedTimestep.js';

/**
 * Fixed timestep loop option and runtime types.
 */
export type { FixedTimestepOptions, FixedTimestepLoop } from './util/fixedTimestep.js';

/**
 * 2D camera helper supporting smoothing, dead zones, and screen shake.
 *
 * Example file: examples/camera2D.ts
 */
export { createCamera2D } from './gameplay/camera2D.js';

/**
 * Camera system typed interfaces for configuration and updates.
 */
export type {
  Camera2D,
  Camera2DOptions,
  CameraUpdateOptions,
  CameraBounds,
  CameraDeadzone,
  CameraShakeOptions,
} from './gameplay/camera2D.js';

/**
 * Particle system helper with emitter configuration and pooling.
 *
 * Example file: examples/particleSystem.ts
 */
export { createParticleSystem } from './gameplay/particleSystem.js';

/**
 * Particle system configuration and runtime types.
 */
export type {
  RangeOptions as ParticleRangeOptions,
  ParticleEmitterOptions,
  ParticleSystemOptions,
  Particle,
  ParticleSystem,
} from './gameplay/particleSystem.js';

/**
 * Sprite animation controller with frame timing and events.
 *
 * Example file: examples/spriteAnimation.ts
 */
export { createSpriteAnimation } from './gameplay/spriteAnimation.js';

/**
 * Sprite animation configuration and event types.
 */
export type {
  SpriteFrame,
  SpriteAnimationOptions,
  SpriteAnimationController,
  SpriteAnimationEvent,
  SpritePlaybackMode,
} from './gameplay/spriteAnimation.js';

/**
 * Tween system for interpolating numeric values with easing and repeats.
 *
 * Example file: examples/tween.ts
 */
export { createTweenSystem } from './gameplay/tween.js';

/**
 * Tween system configuration, controller, and status types.
 */
export type {
  TweenOptions,
  TweenController,
  TweenSystemOptions,
  TweenSystem,
  TweenStatus,
} from './gameplay/tween.js';

/**
 * Platformer physics controller with coyote time and jump buffering.
 *
 * Example file: examples/platformerPhysics.ts
 */
export { createPlatformerController } from './gameplay/platformerPhysics.js';

/**
 * Platformer physics options, state, and input types.
 */
export type {
  PlatformerPhysicsOptions,
  PlatformerController,
  PlatformerCharacterState,
  PlatformerInput,
  PlatformerUpdateOptions,
} from './gameplay/platformerPhysics.js';

/**
 * Top-down movement controller for 8-direction navigation.
 *
 * Example file: examples/topDownMovement.ts
 */
export { createTopDownController } from './gameplay/topDownMovement.js';

/**
 * Top-down movement configuration, state, and input types.
 */
export type {
  TopDownMovementOptions,
  TopDownController,
  TopDownState,
  TopDownInput,
  TopDownUpdateOptions,
} from './gameplay/topDownMovement.js';

/**
 * Tile map controller for chunked rendering and collision queries.
 *
 * Example file: examples/tileMap.ts
 */
export { createTileMapController } from './gameplay/tileMap.js';

/**
 * Tile map configuration, layers, and visibility types.
 */
export type {
  TileMapOptions,
  TileMapLayer,
  TileMapViewport,
  TileMapController,
  VisibleTile,
  ChunkCoordinate,
} from './gameplay/tileMap.js';

/**
 * Shadowcasting field of view helpers.
 *
 * Example file: examples/shadowcasting.ts
 */
export {
  computeFieldOfView,
  transparentFromGrid,
  transparentFromTileMap,
} from './gameplay/shadowcasting.js';

export type {
  ShadowcastOptions,
  FovResult,
  FovGrid,
} from './gameplay/shadowcasting.js';

/**
 * Inventory controller for stack-based item management.
 *
 * Example file: examples/inventory.ts
 */
export { createInventory } from './gameplay/inventory.js';

export type {
  InventoryOptions,
  InventoryController,
  InventoryItem,
  InventorySlot,
  InventorySnapshot,
  AddItemOptions,
} from './gameplay/inventory.js';

/**
 * Combat helpers for damage calculation, cooldowns, and status effects.
 *
 * Example file: examples/combat.ts
 */
export {
  calculateDamage,
  applyDamage,
  createCooldownController,
  updateStatusEffects,
  createStatusEffect,
} from './gameplay/combat.js';

export type {
  DamageResult,
  DamageModifiers,
  DamageType,
  CombatantStats,
  CooldownController,
  StatusEffect,
  ActiveStatusEffect,
} from './gameplay/combat.js';

/**
 * Quest/dialog state machine utilities.
 *
 * Example file: examples/quest.ts
 */
export { createQuestMachine } from './gameplay/questMachine.js';

export type {
  QuestStateNode,
  QuestTransition,
  QuestMachineOptions,
  QuestMachine,
  QuestMachineSnapshot,
} from './gameplay/questMachine.js';

/**
 * 2D lighting helpers for tile maps.
 *
 * Example file: examples/lighting.ts
 */
export { computeLightingGrid } from './gameplay/lighting.js';

export type {
  LightingGridOptions,
  LightingGridResult,
  LightingCell,
  PointLight,
  FalloffMode,
} from './gameplay/lighting.js';

/**
 * Wave spawner helper for timed encounters.
 *
 * Example file: examples/waveSpawner.ts
 */
export { createWaveSpawner } from './gameplay/waveSpawner.js';

export type {
  WaveSpawner,
  WaveSpawnerOptions,
  WaveDefinition,
  SpawnPayload,
  WaveSpawnerSnapshot,
} from './gameplay/waveSpawner.js';

/**
 * Sound manager helper for channel limiting and priority-based playback.
 *
 * Example file: examples/soundManager.ts
 */
export { createSoundManager } from './gameplay/soundManager.js';

export type {
  SoundManager,
  SoundManagerOptions,
  PlaySoundOptions,
  SoundHandle,
  PlaySoundResult,
} from './gameplay/soundManager.js';

/**
 * Input manager abstraction for keyboard, mouse, and gamepad remapping.
 *
 * Example file: examples/inputManager.ts
 */
export { createInputManager } from './gameplay/inputManager.js';

export type {
  InputManager,
  InputManagerOptions,
  InputActionDefinition,
  InputActionState,
  InputActionType,
  InputBinding,
  KeyboardBinding,
  MouseBinding,
  GamepadButtonBinding,
  GamepadAxisBinding,
  KeyInputEvent,
  PointerInputEvent,
  GamepadButtonEvent,
  GamepadAxisEvent,
} from './gameplay/inputManager.js';

/**
 * Save/load helper for slot-based persistence with checksums.
 *
 * Example file: examples/saveManager.ts
 */
export { createSaveManager, createMemorySaveStorage } from './gameplay/saveManager.js';

export type {
  SaveManager,
  SaveManagerOptions,
  SaveSlotMetadata,
  SaveResult,
  LoadResult,
  LoadError,
  SaveStorageAdapter,
} from './gameplay/saveManager.js';

/**
 * Screen transition helpers (fade, wipes, letterboxing).
 *
 * Example file: examples/screenTransitions.ts
 */
export {
  createScreenTransition,
  computeFade,
  computeHorizontalWipe,
  computeLetterbox,
} from './gameplay/screenTransitions.js';

export type {
  ScreenTransitionOptions,
  ScreenTransitionState,
  ScreenTransitionController,
  FadeResult,
  WipeResult,
  LetterboxResult,
} from './gameplay/screenTransitions.js';

/**
 * Finite state machine toolkit for stateful AI.
 *
 * Example file: examples/fsm.ts
 */
export { createFSM } from './ai/fsm.js';

export type {
  StateDefinition,
  TransitionDefinition,
  FSMOptions,
  FSMController,
} from './ai/fsm.js';

/**
 * Genetic algorithm helper for evolving solutions.
 *
 * Example file: examples/genetic.ts
 */
export { createGeneticAlgorithm } from './ai/genetic.js';

export type {
  GeneticAlgorithmOptions,
  GeneticAlgorithmController,
  ParentSelector,
} from './ai/genetic.js';

/**
 * Influence map computation for tactical AI.
 *
 * Example file: examples/influenceMap.ts
 */
export { computeInfluenceMap } from './ai/influenceMap.js';

export type {
  InfluenceSource,
  InfluenceMapOptions,
  InfluenceMapResult,
} from './ai/influenceMap.js';


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
 * Knuth–Morris–Pratt substring search helper.
 */
export { kmpSearch } from './search/kmp.js';

export type { KMPSearchOptions } from './search/kmp.js';

/**
 * Rabin–Karp multiple pattern matcher.
 */
export { rabinKarp } from './search/rabinKarp.js';

export type { RabinKarpOptions } from './search/rabinKarp.js';

/**
 * Boyer–Moore substring matcher.
 */
export { boyerMooreSearch } from './search/boyerMoore.js';

export type { BoyerMooreOptions } from './search/boyerMoore.js';

/**
 * Suffix array construction utilities.
 */
export { buildSuffixArray } from './search/suffixArray.js';

export type { SuffixArrayOptions, SuffixArrayResult } from './search/suffixArray.js';

/**
 * Longest common subsequence and diff helpers.
 */
export { longestCommonSubsequence, diffStrings } from './search/lcs.js';

export type { LCSOptions, LCSResult, DiffOp } from './search/lcs.js';

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
export { diffJson, diffJsonAdvanced, applyJsonDiff, applyJsonDiffSelective } from './data/jsonDiff.js';

/**
 * Flatten/unflatten nested structures.
 */
export { flatten, unflatten } from './data/flatten.js';

export type { FlattenOptions, UnflattenOptions } from './data/flatten.js';

/**
 * Pagination helper for slicing arrays with metadata.
 */
export { paginate } from './data/pagination.js';

export type { PaginateOptions, PaginationResult, PaginationMetadata } from './data/pagination.js';

/**
 * JSON diff related type exports.
 */
export type {
  JsonDiffOperation,
  JsonPathSegment,
  JsonPrimitive,
  JsonValue,
  DiffJsonAdvancedOptions,
  ApplyJsonDiffOptions,
} from './data/jsonDiff.js';

/**
 * Tree diff helpers for hierarchical data.
 */
export { diffTree, applyTreeDiff } from './data/treeDiff.js';

export type {
  TreeNode,
  TreeDiffOperation,
  TreeInsertOperation,
  TreeRemoveOperation,
  TreeMoveOperation,
  TreeUpdateOperation,
  TreeDiffOptions,
} from './data/treeDiff.js';

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

/**
 * Bresenham rasterisation for grid-based line traversal.
 *
 * Example file: examples/bresenham.ts
 */
export { bresenhamLine } from './geometry/bresenham.js';

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

/**
 * Color conversion and blending utilities.
 */
export { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, mixRgbColors } from './visual/color.js';

export type { RGBColor, HSLColor, MixColorOptions } from './visual/color.js';

/**
 * Force-directed graph layout helper.
 */
export { computeForceDirectedLayout } from './visual/forceDirected.js';

export type {
  ForceDirectedLayoutOptions,
  ForceDirectedLayoutResult,
  ForceDirectedEdge,
  ForceDirectedNode,
  ForceDirectedNodeInput,
} from './visual/forceDirected.js';

/**
 * Marching squares contour extraction.
 */
export { computeMarchingSquares } from './visual/marchingSquares.js';

export type {
  MarchingSquaresOptions,
  MarchingSquaresResult,
  ScalarField,
  LineSegment,
  Point2D,
} from './visual/marchingSquares.js';

/**
 * Marching cubes isosurface extraction.
 */
export { computeMarchingCubes } from './visual/marchingCubes.js';

export type {
  MarchingCubesOptions,
  MarchingCubesResult,
  ScalarField3D,
  Vector3,
  Triangle,
} from './visual/marchingCubes.js';

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
