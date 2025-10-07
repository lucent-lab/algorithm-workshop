// LLM Algorithm Library - TypeScript Definitions
// Import from: https://cdn.jsdelivr.net/npm/llm-algorithms/src/[filename].js
//
// 📚 QUICK NAVIGATION:
// - 🎮 Pathfinding & Navigation (A*, Dijkstra, Flow Field, Nav Mesh)
// - 🌍 Procedural Generation (Perlin, Wave Collapse, Cellular Automata, Dungeons)
// - 🎯 Spatial & Collision (Quadtree, AABB, SAT, Raycasting)
// - 🤖 AI & Behavior (Flocking, Steering, FSM, Behavior Trees, Genetic)
// - 🎲 Game Utilities (Object Pool, Weighted Random, Bresenham)
// - 🎮 Game Systems (Game Loop, Camera, Particles, Animation, Physics)
// - ⚡ Web Performance (Debounce, Throttle, Cache, Virtual Scroll)
// - 🔍 Search & Matching (Fuzzy, Trie, Levenshtein)
// - 📊 Data Processing (Diff, Traverse, Group By, Deep Clone)
// - 🎨 Visual & Animation (Easing, Bezier, Color, Force Graph)
// - 📈 Graph Algorithms (BFS, DFS, Topological Sort)
// - 🔤 String Algorithms (Rabin-Karp, LCS)
// - 📐 Geometric (Convex Hull, Line Intersection, Point in Polygon)
//
// 🎯 QUICK PICKS FOR GAME DEV:
// - Need pathfinding? → astar.js or dijkstra.js
// - Need procedural maps? → waveCollapse.js or perlin.js or dungeon.js
// - Need collision? → quadtree.js + aabb.js
// - Need AI movement? → steering.js, boids.js, rvo.ts
// - Need game loop? → gameLoop.js (planned)
// - Need camera? → camera2d.js (planned)
// - Need effects? → particles.js (planned)
// - Total algorithms (shipped + planned): 100+
//
// 🗺 Planned expansions (see ROADMAP.md Milestone 0.4)
// - Procedural: Wave Function Collapse, dungeon suites, L-systems, diamond-square, maze packs
// - Systems: game loop, camera, particles, sprite animation, platformer physics, tilemaps, FOV
// - Gameplay: inventory, combat, quest/dialog, lighting, wave spawner, sound, input, save/load, screen transitions

// ============================================================================
// 🎮 PATHFINDING & NAVIGATION
// ============================================================================

/**
 * A* pathfinding algorithm for grid-based navigation
 * Finds shortest path between two points using heuristic-based search.
 * Use for: game character movement, robot navigation, route planning
 * Performance: O(b^d) - Fast with good heuristic
 * Import: astar.js
 */
export interface AStarOptions {
  grid: number[][];
  start: { x: number; y: number };
  goal: { x: number; y: number };
  allowDiagonal?: boolean;
  heuristic?: (a: Point, b: Point) => number;
}
export function astar(options: AStarOptions): Point[] | null;
export function manhattanDistance(a: Point, b: Point): number;
export function gridFromString(mapString: string): number[][];

/**
 * Dijkstra's algorithm for shortest path without heuristic
 * Use for: weighted graphs, guaranteed shortest path, no heuristic available
 * Performance: O(E log V) - Slower but guaranteed optimal
 * Import: dijkstra.js
 */
export interface DijkstraOptions {
  graph: Graph;
  start: string | number;
  goal: string | number;
}
export function dijkstra(options: DijkstraOptions): Path | null;

/**
 * Jump Point Search - A* optimization for uniform grids
 * Use for: large grid pathfinding, performance-critical games
 * Performance: O(b^d) - Much faster than A* on grids
 * Import: jps.js
 */
export function jumpPointSearch(options: AStarOptions): Point[] | null;

/**
 * Flow Field pathfinding for many units to same goal
 * Use for: RTS games, crowd simulation, swarm movement
 * Performance: O(n) per unit after O(n²) preprocessing
 * Import: flowField.js
 */
export interface FlowFieldOptions {
  grid: number[][];
  goal: Point;
}
export function flowField(options: FlowFieldOptions): Vector2D[][];

/**
 * Navigation Mesh for 3D/irregular terrain
 * Use for: 3D games, irregular terrain, realistic movement
 * Performance: O(n log n) setup, O(log n) query
 * Import: navmesh.js
 */
export function createNavMesh(polygons: Polygon[]): NavMesh;

// ============================================================================
// 🌍 PROCEDURAL GENERATION
// ============================================================================

/**
 * Perlin Noise for smooth random terrain/textures
 * Use for: terrain generation, clouds, organic textures
 * Performance: O(n) - Smooth gradients
 * Import: perlin.js
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
export function perlin3D(x: number, y: number, z: number): number;

/**
 * Simplex Noise - improved Perlin alternative
 * Use for: better terrain, fewer artifacts, any dimension
 * Performance: O(n) - Faster than Perlin, no directional artifacts
 * Import: simplex.js
 */
export function simplex2D(x: number, y: number): number;
export function simplex3D(x: number, y: number, z: number): number;

/**
 * Wave Function Collapse for tile-based generation
 * Generates patterns by collapsing possibilities based on constraints.
 * Use for: tile-based maps, texture synthesis, puzzle generation, dungeons
 * Performance: O(n²) - Can be slow, high quality output
 * Import: waveCollapse.js
 */
export interface WaveCollapseOptions {
  width: number;
  height: number;
  tiles: Tile[];
  seed?: number;
}
export interface Tile {
  id: string;
  weight?: number;
  rules: {
    top?: string[];
    right?: string[];
    bottom?: string[];
    left?: string[];
  };
}
export function waveCollapse(options: WaveCollapseOptions): Tile[][];
export function createTileset(tileDefinitions: TileDefinition[]): Tile[];

/**
 * Cellular Automata for caves/organic structures
 * Use for: cave generation, organic patterns, erosion
 * Performance: O(n × iterations) - Very fast
 * Import: cellularAutomata.js
 */
export interface CellularOptions {
  width: number;
  height: number;
  fillProbability: number;
  iterations: number;
}
export function cellularAutomata(options: CellularOptions): number[][];

/**
 * Poisson Disk Sampling for even point distribution
 * Use for: tree placement, star fields, texture distribution
 * Performance: O(n) - No clumping, even spacing
 * Import: poissonDisk.js
 */
export function poissonDisk(width: number, height: number, radius: number): Point[];

/**
 * Voronoi Diagrams for territory/region generation
 * Use for: territory maps, biomes, cell-like patterns
 * Performance: O(n log n) - Natural-looking boundaries
 * Import: voronoi.js
 */
export function voronoi(points: Point[], bounds: Rect): VoronoiCell[];

/**
 * Maze Generation (multiple algorithms)
 * Use for: dungeons, puzzles, labyrinth games
 * Performance: O(n) - Various algorithms available
 * Import: maze.js
 */
export function mazeRecursiveBacktrack(width: number, height: number): number[][];
export function mazePrims(width: number, height: number): number[][];
export function mazeKruskals(width: number, height: number): number[][];
export function mazeWilsons(width: number, height: number): number[][];

/**
 * Dungeon Generation (BSP, Rooms & Corridors)
 * Use for: roguelikes, procedural dungeons, room-based levels
 * Performance: O(n log n) - Creates connected rooms
 * Import: dungeon.js
 */
export interface DungeonOptions {
  width: number;
  height: number;
  minRoomSize: number;
  maxRoomSize: number;
  maxRooms?: number;
}
export function generateDungeon(options: DungeonOptions): DungeonMap;
export function bspDungeon(width: number, height: number, minSize: number): Room[];

/**
 * L-System for organic generation
 * Use for: trees, plants, branching structures, fractals
 * Performance: O(n^iterations) - Exponential growth
 * Import: lsystem.js
 */
export interface LSystemOptions {
  axiom: string;
  rules: Record<string, string>;
  iterations: number;
}
export function lsystem(options: LSystemOptions): string;
export function drawLSystem(commands: string, angle: number): Point[][];

/**
 * Diamond-Square Algorithm for terrain
 * Use for: height maps, mountain generation, realistic terrain
 * Performance: O(n²) - Smooth height fields
 * Import: diamondSquare.js
 */
export function diamondSquare(size: number, roughness: number, seed?: number): number[][];

// ============================================================================
// 🎯 SPATIAL & COLLISION
// ============================================================================

/**
 * Quadtree for 2D spatial partitioning
 * Use for: 2D collision detection, spatial queries, particle systems
 * Performance: O(log n) query - Essential for performance
 * Import: quadtree.js
 */
export class Quadtree {
  constructor(bounds: Rect, capacity: number);
  insert(point: Point, data?: any): boolean;
  query(range: Rect): Point[];
  queryCircle(center: Point, radius: number): Point[];
}

/**
 * Octree for 3D spatial partitioning
 * Use for: 3D collision, voxels, 3D particle systems
 * Performance: O(log n) query
 * Import: octree.js
 */
export class Octree {
  constructor(bounds: Cube, capacity: number);
  insert(point: Point3D, data?: any): boolean;
  query(range: Cube): Point3D[];
}

/**
 * AABB (Axis-Aligned Bounding Box) collision
 * Use for: simple box collision, broad-phase detection
 * Performance: O(1) - Fastest, least accurate
 * Import: aabb.js
 */
export function aabbCollision(a: Rect, b: Rect): boolean;
export function aabbIntersection(a: Rect, b: Rect): Rect | null;

/**
 * SAT (Separating Axis Theorem) collision
 * Use for: polygon collision, accurate 2D physics
 * Performance: O(n + m) - Accurate for convex shapes
 * Import: sat.js
 */
export function satCollision(poly1: Point[], poly2: Point[]): boolean;

/**
 * Circle collision detection
 * Use for: round objects, bullets, simple physics
 * Performance: O(1) - Very fast
 * Import: circle.js
 */
export function circleCollision(a: Circle, b: Circle): boolean;
export function circleRectCollision(circle: Circle, rect: Rect): boolean;

/**
 * Raycasting for line of sight/shooting
 * Use for: line of sight, shooting mechanics, mouse picking
 * Performance: O(n) - Check against all objects
 * Import: raycast.js
 */
export function raycast(ray: Ray, objects: any[]): RaycastHit | null;
export function raycastGrid(ray: Ray, grid: number[][]): Point[];

/**
 * BVH (Bounding Volume Hierarchy) for complex 3D
 * Use for: 3D games, many objects, ray tracing
 * Performance: O(log n) - Best for many objects
 * Import: bvh.js
 */
export class BVH {
  constructor(objects: BoundedObject[]);
  query(bounds: any): any[];
  raycast(ray: Ray): RaycastHit | null;
}

// ============================================================================
// 🤖 AI & BEHAVIOR
// ============================================================================

/**
 * Flocking/Boids for group movement
 * Use for: birds, fish, crowds, swarm behavior
 * Performance: O(n²) or O(n log n) with spatial partitioning
 * Import: boids.js
 */
export interface BoidOptions {
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  maxSpeed: number;
  maxForce: number;
}
export function updateBoids(boids: Boid[], options: BoidOptions): void;

/**
 * Steering Behaviors for smooth AI movement
 * Use for: seek, flee, pursue, evade, wander, arrive
 * Performance: O(1) per agent
 * Import: steering.js
 */
export function seek(agent: Agent, target: Point): Vector2D;
export function flee(agent: Agent, target: Point): Vector2D;
export function pursue(agent: Agent, target: Agent): Vector2D;
export function wander(agent: Agent): Vector2D;
export function arrive(agent: Agent, target: Point, slowRadius: number): Vector2D;

/**
 * Finite State Machine for AI states
 * Use for: simple AI (idle, patrol, chase, attack)
 * Performance: O(1) - Easy to understand
 * Import: fsm.js
 */
export class FSM<T> {
  constructor(initialState: T);
  addTransition(from: T, to: T, condition: () => boolean): void;
  update(): void;
  getCurrentState(): T;
}

/**
 * Behavior Trees for complex AI
 * Use for: NPC behavior, boss patterns, complex decisions
 * Performance: O(tree depth) - Modular and reusable
 * Import: behaviorTree.js
 */
export type BehaviorNode = Sequence | Selector | Action | Condition;
export function createBehaviorTree(root: BehaviorNode): BehaviorTree;

/**
 * Genetic Algorithm for optimization
 * Use for: parameter tuning, AI evolution, procedural design
 * Performance: O(population × generations) - Slow but powerful
 * Import: genetic.js
 */
export interface GeneticOptions<T> {
  populationSize: number;
  generations: number;
  fitness: (individual: T) => number;
  mutate: (individual: T) => T;
  crossover: (a: T, b: T) => T;
  initialPopulation: T[];
}
export function geneticAlgorithm<T>(options: GeneticOptions<T>): { best: T; fitness: number };

/**
 * Influence Maps for tactical AI
 * Use for: strategy games, territory control, tactical positioning
 * Performance: O(n) - Strategic decision making
 * Import: influenceMap.js
 */
export function createInfluenceMap(width: number, height: number): InfluenceMap;

// ============================================================================
// 🎲 UTILITIES & HELPERS
// ============================================================================

/**
 * Weighted Random Selection
 * Use for: loot drops, spawn rates, probability tables
 * Performance: O(n) or O(log n) with alias method
 * Import: weightedRandom.js
 */
export function weightedRandom<T>(items: T[], weights: number[]): T;
export function createAliasTable<T>(items: T[], weights: number[]): AliasTable<T>;

/**
 * Fisher-Yates Shuffle
 * Use for: randomize arrays, deck shuffling, fair randomization
 * Performance: O(n) - Unbiased shuffle
 * Import: shuffle.js
 */
export function shuffle<T>(array: T[]): T[];

/**
 * Bresenham's Line Algorithm
 * Use for: draw lines on grids, fog of war, laser beams
 * Performance: O(max(dx, dy)) - Pixel perfect lines
 * Import: bresenham.js
 */
export function bresenhamLine(x0: number, y0: number, x1: number, y1: number): Point[];

/**
 * Marching Squares for contour generation
 * Use for: convert scalar field to contours (water, height maps)
 * Performance: O(n) - Smooth boundaries
 * Import: marchingSquares.js
 */
export function marchingSquares(field: number[][], threshold: number): Point[][];

/**
 * Object Pool for memory optimization
 * Use for: bullets, particles, frequently created/destroyed objects
 * Performance: O(1) - Prevents garbage collection spikes
 * Import: objectPool.js
 */
export class ObjectPool<T> {
  constructor(factory: () => T, reset: (obj: T) => void, initialSize: number);
  get(): T;
  release(obj: T): void;
}

// ============================================================================
// 🎮 GAME SYSTEMS & UTILITIES
// ============================================================================

/**
 * Game Loop with fixed timestep
 * Use for: consistent physics, frame-independent updates, game timing
 * Performance: O(1) per frame - Smooth gameplay
 * Import: gameLoop.js
 */
export interface GameLoopOptions {
  fps: number;
  update: (deltaTime: number) => void;
  render: (interpolation: number) => void;
}
export function createGameLoop(options: GameLoopOptions): GameLoop;

/**
 * Delta Time management
 * Use for: frame-independent movement, smooth animations
 * Performance: O(1) - Consistent across frame rates
 * Import: deltaTime.js
 */
export function createDeltaTime(): {
  update: () => number;
  getDelta: () => number;
  getFPS: () => number;
};

/**
 * Camera 2D with smooth follow
 * Use for: player following, smooth camera movement, screen shake
 * Performance: O(1) - Smooth camera controls
 * Import: camera2d.js
 */
export interface Camera2DOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  followSmooth?: number;
}
export class Camera2D {
  constructor(options: Camera2DOptions);
  follow(target: Point, deltaTime: number): void;
  shake(intensity: number, duration: number): void;
  worldToScreen(point: Point): Point;
  screenToWorld(point: Point): Point;
}

/**
 * Particle System for effects
 * Use for: explosions, fire, smoke, magic effects, weather
 * Performance: O(n) - Manages particle lifecycle
 * Import: particles.js
 */
export interface ParticleOptions {
  x: number;
  y: number;
  count: number;
  lifetime: number;
  speed: number;
  spread: number;
  gravity?: number;
}
export class ParticleSystem {
  constructor(maxParticles: number);
  emit(options: ParticleOptions): void;
  update(deltaTime: number): void;
  getParticles(): Particle[];
}

/**
 * Sprite Animation controller
 * Use for: character animations, sprite sheets, frame sequences
 * Performance: O(1) - Frame-based animation
 * Import: spriteAnimation.js
 */
export interface AnimationOptions {
  frames: number[];
  fps: number;
  loop?: boolean;
}
export class SpriteAnimator {
  addAnimation(name: string, options: AnimationOptions): void;
  play(name: string): void;
  update(deltaTime: number): void;
  getCurrentFrame(): number;
}

/**
 * Tween/Lerp utilities for smooth transitions
 * Use for: UI animations, object movement, value interpolation
 * Performance: O(1) - Smooth interpolation
 * Import: tween.js
 */
export function lerp(start: number, end: number, t: number): number;
export function lerpVector(a: Point, b: Point, t: number): Point;
export function createTween(
  from: number,
  to: number,
  duration: number,
  easing?: (t: number) => number,
): Tween;

/**
 * Platformer Physics for 2D games
 * Use for: jumping, gravity, ground detection, slopes
 * Performance: O(1) - Classic platformer feel
 * Import: platformerPhysics.js
 */
export interface PlatformerPhysicsOptions {
  gravity: number;
  jumpForce: number;
  maxSpeed: number;
  acceleration: number;
  friction: number;
}
export class PlatformerController {
  constructor(options: PlatformerPhysicsOptions);
  jump(): void;
  move(direction: number, deltaTime: number): void;
  update(deltaTime: number): void;
  isGrounded(): boolean;
}

/**
 * Top-Down Movement (8-directional)
 * Use for: RPG movement, twin-stick shooters, top-down games
 * Performance: O(1) - Smooth 8-way movement
 * Import: topDownMovement.js
 */
export interface TopDownOptions {
  speed: number;
  acceleration?: number;
  friction?: number;
}
export function topDownMovement(input: Vector2D, options: TopDownOptions): Vector2D;

/**
 * Tile Map renderer & collision
 * Use for: 2D tile games, grid-based collision, map rendering
 * Performance: O(visible tiles) - Efficient rendering
 * Import: tileMap.js
 */
export interface TileMapOptions {
  tiles: number[][];
  tileSize: number;
  collisionTiles?: number[];
}
export class TileMap {
  constructor(options: TileMapOptions);
  getTileAt(x: number, y: number): number;
  isSolid(x: number, y: number): boolean;
  getVisibleTiles(camera: Camera2D): TileInfo[];
}

/**
 * Field of View (FOV) / Line of Sight
 * Use for: stealth games, visibility, fog of war, enemy detection
 * Performance: O(n) - Raycasting-based
 * Import: fov.js
 */
export interface FOVOptions {
  x: number;
  y: number;
  radius: number;
  grid: number[][];
}
export function calculateFOV(options: FOVOptions): Set<string>;
export function shadowcasting(
  x: number,
  y: number,
  radius: number,
  isBlocked: (x: number, y: number) => boolean,
): Point[];

/**
 * Minimap generation
 * Use for: radar, minimap, overview map
 * Performance: O(visible area) - Scaled rendering
 * Import: minimap.js
 */
export function createMinimap(world: number[][], scale: number): HTMLCanvasElement;
export function updateMinimap(
  minimap: HTMLCanvasElement,
  playerPos: Point,
  entities: Point[],
): void;

/**
 * Inventory System
 * Use for: item management, equipment, crafting systems
 * Performance: O(1) add/remove, O(n) search
 * Import: inventory.js
 */
export interface Item {
  id: string;
  name: string;
  stackable?: boolean;
  maxStack?: number;
  [key: string]: any;
}
export class Inventory {
  constructor(maxSlots: number);
  addItem(item: Item, quantity?: number): boolean;
  removeItem(itemId: string, quantity?: number): boolean;
  getItem(itemId: string): Item | null;
  getSlots(): (Item | null)[];
}

/**
 * Combat System (turn-based & real-time)
 * Use for: RPG combat, damage calculation, status effects
 * Performance: O(1) per action - Combat resolution
 * Import: combat.js
 */
export interface CombatStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
}
export function calculateDamage(attacker: CombatStats, defender: CombatStats): number;
export function applyStatusEffect(target: any, effect: StatusEffect): void;

/**
 * Quest/Dialog System
 * Use for: story progression, NPC dialogs, mission tracking
 * Performance: O(1) - State machine based
 * Import: questSystem.js
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: Objective[];
  rewards?: any;
}
export class QuestManager {
  addQuest(quest: Quest): void;
  completeObjective(questId: string, objectiveId: string): void;
  isQuestComplete(questId: string): boolean;
  getActiveQuests(): Quest[];
}

/**
 * Save/Load System
 * Use for: game saves, checkpoints, persistent data
 * Performance: O(n) - Serialization/deserialization
 * Import: saveSystem.js
 */
export function saveGame(gameState: any, slot: string): Promise<void>;
export function loadGame(slot: string): Promise<any>;
export function serializeGameState(state: any): string;
export function deserializeGameState(data: string): any;

/**
 * 2D Lighting System
 * Use for: dynamic lighting, shadows, atmospheric effects
 * Performance: O(lights × affected area) - Light rendering
 * Import: lighting2d.js
 */
export interface Light {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  color?: string;
}
export class LightingSystem {
  addLight(light: Light): void;
  removeLight(light: Light): void;
  render(context: CanvasRenderingContext2D): void;
  calculateLightAt(x: number, y: number): number;
}

/**
 * Spawner/Wave System
 * Use for: enemy waves, spawn management, difficulty scaling
 * Performance: O(spawners) - Event-based spawning
 * Import: spawner.js
 */
export interface SpawnWave {
  enemies: { type: string; count: number }[];
  delay: number;
}
export class WaveSpawner {
  constructor(waves: SpawnWave[]);
  start(): void;
  update(deltaTime: number): void;
  getCurrentWave(): number;
  isComplete(): boolean;
}

/**
 * Sound Manager with pooling
 * Use for: audio playback, sound effects, music management
 * Performance: O(1) - Pooled audio sources
 * Import: soundManager.js
 */
export class SoundManager {
  loadSound(id: string, url: string): Promise<void>;
  playSound(id: string, volume?: number, loop?: boolean): void;
  stopSound(id: string): void;
  setMasterVolume(volume: number): void;
}

/**
 * Input Manager (keyboard, mouse, gamepad)
 * Use for: input handling, key binding, gamepad support
 * Performance: O(1) - Event-based input
 * Import: inputManager.js
 */
export class InputManager {
  isKeyDown(key: string): boolean;
  isKeyPressed(key: string): boolean;
  isKeyReleased(key: string): boolean;
  getMousePosition(): Point;
  isMouseButtonDown(button: number): boolean;
  getGamepadAxis(gamepadIndex: number, axisIndex: number): number;
}

/**
 * Screen Transitions
 * Use for: scene changes, level transitions, fade effects
 * Performance: O(1) - Smooth transitions
 * Import: transitions.js
 */
export function fadeOut(duration: number, callback?: () => void): void;
export function fadeIn(duration: number): void;
export function slideTransition(
  direction: 'left' | 'right' | 'up' | 'down',
  duration: number,
): void;

// ============================================================================
// ⚡ WEB PERFORMANCE
// ============================================================================

/**
 * Debounce to limit rapid function calls
 * Use for: search input, window resize, form validation
 * Performance: O(1) - Delay execution until idle
 * Import: debounce.js
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void;

/**
 * Throttle to rate-limit function execution
 * Use for: scroll events, mousemove, performance-critical events
 * Performance: O(1) - Execute at fixed intervals
 * Import: throttle.js
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void;

/**
 * LRU Cache with size limit
 * Use for: API response caching, expensive computations
 * Performance: O(1) get/set - Automatic eviction
 * Import: lruCache.js
 */
export class LRUCache<K, V> {
  constructor(capacity: number);
  get(key: K): V | undefined;
  put(key: K, value: V): void;
}

/**
 * Memoization for caching function results
 * Use for: expensive pure functions, recursive calculations
 * Performance: O(1) retrieval - Space for speed tradeoff
 * Import: memoize.js
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T;

/**
 * Virtual Scrolling for large lists
 * Use for: render only visible items, millions of rows
 * Performance: O(visible items) - Handle unlimited data
 * Import: virtualScroll.js
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  items: any[];
  renderItem: (item: any, index: number) => HTMLElement;
}
export function createVirtualScroll(options: VirtualScrollOptions): VirtualScroller;

/**
 * Request Deduplication
 * Use for: prevent duplicate API calls, batch requests
 * Performance: O(1) - Save bandwidth
 * Import: requestDedup.js
 */
export function deduplicateRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T>;

// ============================================================================
// 🔍 SEARCH & MATCHING
// ============================================================================

/**
 * Fuzzy Search for approximate matching
 * Use for: autocomplete, typo-tolerant search, user input
 * Performance: O(n × m) - Flexible matching
 * Import: fuzzySearch.js
 */
export function fuzzySearch(query: string, items: string[]): string[];
export function fuzzyScore(query: string, target: string): number;

/**
 * Trie (Prefix Tree) for string search
 * Use for: autocomplete, dictionary, prefix matching
 * Performance: O(m) - Excellent for prefix search
 * Import: trie.js
 */
export class Trie {
  insert(word: string): void;
  search(word: string): boolean;
  startsWith(prefix: string): string[];
}

/**
 * KMP String Search Algorithm
 * Use for: substring search, pattern matching
 * Performance: O(n + m) - Faster than naive search
 * Import: kmp.js
 */
export function kmpSearch(text: string, pattern: string): number[];

/**
 * Levenshtein Distance for string similarity
 * Use for: spell check, similarity scoring, fuzzy matching
 * Performance: O(n × m) - Edit distance calculation
 * Import: levenshtein.js
 */
export function levenshteinDistance(a: string, b: string): number;

/**
 * Binary Search on sorted arrays
 * Use for: search sorted data, find insertion point
 * Performance: O(log n) - Array must be sorted
 * Import: binarySearch.js
 */
export function binarySearch<T>(array: T[], target: T, compareFn?: (a: T, b: T) => number): number;

// ============================================================================
// 📊 DATA PROCESSING
// ============================================================================

/**
 * Diff Algorithm for comparing data
 * Use for: React-like reconciliation, change detection
 * Performance: O(n × m) - Find minimal changes
 * Import: diff.js
 */
export function diff<T>(oldArray: T[], newArray: T[]): DiffResult<T>;

/**
 * Tree Traversal (BFS/DFS)
 * Use for: DOM manipulation, file systems, nested data
 * Performance: O(n) - Visit all nodes
 * Import: traverse.js
 */
export function bfs<T>(root: TreeNode<T>, callback: (node: TreeNode<T>) => void): void;
export function dfs<T>(root: TreeNode<T>, callback: (node: TreeNode<T>) => void): void;

/**
 * Flatten/Unflatten nested structures
 * Use for: convert nested to flat and vice versa
 * Performance: O(n) - Data transformation
 * Import: flatten.js
 */
export function flatten<T>(nested: any): T[];
export function unflatten<T>(flat: any[], idKey: string, parentKey: string): T;

/**
 * Group By property
 * Use for: organize data, categorization, aggregation
 * Performance: O(n) - Single pass grouping
 * Import: groupBy.js
 */
export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]>;

/**
 * Deep Clone objects
 * Use for: copy nested objects, avoid mutations
 * Performance: O(n) - Handles circular refs
 * Import: deepClone.js
 */
export function deepClone<T>(obj: T): T;

/**
 * Pagination for client-side paging
 * Use for: split data into pages, table pagination
 * Performance: O(1) - Slice array
 * Import: paginate.js
 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[];

// ============================================================================
// 🎨 VISUAL & ANIMATION
// ============================================================================

/**
 * Easing Functions for smooth animations
 * Use for: UI animations, game tweening, smooth transitions
 * Performance: O(1) - Mathematical curves
 * Import: easing.js
 */
export const easing: {
  linear: (t: number) => number;
  easeInQuad: (t: number) => number;
  easeOutQuad: (t: number) => number;
  easeInOutQuad: (t: number) => number;
  easeInCubic: (t: number) => number;
  easeOutCubic: (t: number) => number;
  // ... more easing functions
};

/**
 * Bezier Curves for smooth paths
 * Use for: curved paths, animation trajectories, vector graphics
 * Performance: O(1) per point - Smooth interpolation
 * Import: bezier.js
 */
export function quadraticBezier(p0: Point, p1: Point, p2: Point, t: number): Point;
export function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point;

/**
 * Color Manipulation utilities
 * Use for: RGB/HSL conversion, color mixing, gradients
 * Performance: O(1) - Color math operations
 * Import: color.js
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number];
export function hslToRgb(h: number, s: number, l: number): [number, number, number];
export function colorLerp(color1: string, color2: string, t: number): string;

/**
 * Force-Directed Graph Layout
 * Use for: network visualizations, graph drawing
 * Performance: O(n²) - Physics-based layout
 * Import: forceGraph.js
 */
export function forceDirectedLayout(nodes: GraphNode[], edges: GraphEdge[]): void;

// ============================================================================
// 📈 GRAPH ALGORITHMS
// ============================================================================

/**
 * Breadth-First Search
 * Use for: shortest path (unweighted), level-order traversal
 * Performance: O(V + E) - Queue-based
 * Import: bfs.js
 */
export function graphBFS(graph: Graph, start: string): Map<string, number>;

/**
 * Depth-First Search
 * Use for: cycle detection, topological sort, maze solving
 * Performance: O(V + E) - Stack-based
 * Import: dfs.js
 */
export function graphDFS(graph: Graph, start: string, callback: (node: string) => void): void;

/**
 * Topological Sort for DAGs
 * Use for: dependency resolution, build systems, task scheduling
 * Performance: O(V + E) - Works only on DAGs
 * Import: topologicalSort.js
 */
export function topologicalSort(graph: Graph): string[];

// ============================================================================
// 🔤 STRING ALGORITHMS
// ============================================================================

/**
 * Rabin-Karp for pattern matching
 * Use for: multiple pattern search, plagiarism detection
 * Performance: O(n + m) average - Hash-based
 * Import: rabinKarp.js
 */
export function rabinKarp(text: string, pattern: string): number[];

/**
 * Longest Common Subsequence
 * Use for: diff algorithms, DNA sequence comparison
 * Performance: O(n × m) - Dynamic programming
 * Import: lcs.js
 */
export function longestCommonSubsequence(a: string, b: string): string;

// ============================================================================
// 📐 GEOMETRIC ALGORITHMS
// ============================================================================

/**
 * Convex Hull (Graham Scan)
 * Use for: find boundary points, collision hulls
 * Performance: O(n log n) - Boundary detection
 * Import: convexHull.js
 */
export function convexHull(points: Point[]): Point[];

/**
 * Line Intersection
 * Use for: check if lines cross, computational geometry
 * Performance: O(1) - Single calculation
 * Import: lineIntersection.js
 */
export function lineIntersection(a1: Point, a2: Point, b1: Point, b2: Point): Point | null;

/**
 * Point in Polygon test
 * Use for: hit detection, containment testing
 * Performance: O(n) - Ray casting method
 * Import: pointInPolygon.js
 */
export function pointInPolygon(point: Point, polygon: Point[]): boolean;

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
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

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Ray {
  origin: Point;
  direction: Vector2D;
}

export interface Graph {
  [key: string]: { node: string; weight?: number }[];
}

export interface Tile {
  id: string;
  rules?: any;
}

export interface Agent {
  position: Point;
  velocity: Vector2D;
  maxSpeed: number;
}

export interface Boid extends Agent {
  acceleration: Vector2D;
}

export interface DungeonMap {
  grid: number[][];
  rooms: Room[];
  corridors: Corridor[];
}

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Corridor {
  start: Point;
  end: Point;
  points: Point[];
}

export interface Cube {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

export interface Polygon {
  vertices: Point[];
}

export interface BoundedObject {
  bounds: Rect;
  data?: any;
}

export interface RaycastHit {
  object: any;
  point: Point;
  distance: number;
}

export interface VoronoiCell {
  site: Point;
  vertices: Point[];
}

export interface GameLoop {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export interface Tween {
  update(deltaTime: number): number;
  isComplete(): boolean;
}

export interface TileInfo {
  x: number;
  y: number;
  tileId: number;
}

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
}

export interface StatusEffect {
  type: string;
  duration: number;
  value: number;
}

export interface VirtualScroller {
  update(scrollTop: number): void;
  render(): HTMLElement[];
}

export interface DiffResult<T> {
  added: T[];
  removed: T[];
  unchanged: T[];
}

export interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface Path {
  nodes: string[];
  distance: number;
}

export interface InfluenceMap {
  addSource(x: number, y: number, strength: number): void;
  getValue(x: number, y: number): number;
  propagate(): void;
}

export interface NavMesh {
  findPath(start: Point, goal: Point): Point[];
}

export interface BehaviorTree {
  update(): void;
}

export interface AliasTable<T> {
  sample(): T;
}

export interface TileDefinition {
  id: string;
  weight?: number;
  compatible?: {
    top?: string[];
    right?: string[];
    bottom?: string[];
    left?: string[];
  };
}
