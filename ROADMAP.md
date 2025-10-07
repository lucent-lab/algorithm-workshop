# LLM Algorithms Roadmap

## Milestone 0.1.0 – Foundational Toolkit
- [x] Scaffold project structure, npm metadata, and documentation
- [x] Migrate runtime codebase to strict TypeScript with shared type definitions
- [x] Implement core algorithms (A*, Dijkstra, Perlin, Quadtree, AABB, data/search utilities)
- [x] Add steering behaviours and SAT collision module
- [x] Provide Vitest coverage for representative algorithms
- [x] Ship runnable TypeScript examples (A*, steering, SAT)
- [x] Configure ESLint, Prettier, and CI workflow integration

## Milestone 0.2.0 – Procedural & AI Expansion (In Progress)
- [x] Implement Simplex noise generator with tests
- [x] Implement Worley noise generator with tests
- [x] Add boids flocking simulation and unit coverage
- [x] Implement behaviour tree foundation with tests/examples
- [x] Add circle-ray intersection helper
- [x] Implement swept AABB collision checks
- [x] Document new modules in `docs/index.d.ts` and examples folder
- [x] Achieve >80% coverage across new modules
- [x] Implement reciprocal velocity obstacles (RVO) crowd steering with tests and example
- [x] Add Jump Point Search optimisation for uniform grids
- [x] Implement flow-field pathfinding for multi-unit navigation
- [x] Provide navigation mesh (navmesh) helper for irregular terrain

## Milestone 0.3.0 – Web Performance & Data Pipelines
- [x] Introduce request deduplication helper
- [x] Ship virtual scrolling utilities
- [x] Add diff/patch helpers for nested JSON structures
- [x] Create benchmarking scripts to compare algorithm variants
- [x] Expand CI to include coverage gating and bundle size checks

- ## Milestone 0.4.0 – Procedural Worlds & Game Systems (Planned)
- Procedural generators:
  - [x] Wave Function Collapse tile solver with options + example
  - [x] Cellular automata cave/organic generator utilities
  - [x] Poisson disk sampling for even point distribution
  - [ ] Voronoi diagram helpers for biome/territory generation
  - [ ] Diamond-square terrain height map generator
  - [ ] L-system generator for foliage and organic structures
  - [ ] Dungeon generation suite (BSP subdivision, rooms & corridors variants)
  - [ ] Maze algorithms pack (Recursive backtracking, Prim's, Kruskal's, Wilson's, Aldous–Broder, Recursive Division)
- Gameplay systems & utilities:
  - [ ] Fixed-timestep game loop utility with interpolation helpers
  - [ ] Delta-time manager for frame-independent timing
  - [ ] Object pool helper for reusable entities
  - [ ] Weighted random selector (alias method)
  - [ ] Fisher–Yates shuffle implementation
  - [ ] Bresenham line / raster traversal helpers
- Real-time systems:
  - [ ] 2D camera system (smooth follow, dead zones, screen shake)
  - [ ] Particle system with configurable emitters
  - [ ] Sprite animation controller (frame timing, events)
  - [ ] Tween/lerp utility for smooth interpolation
  - [ ] Platformer physics helper (gravity, coyote time, jump buffering)
  - [ ] Top-down movement helper (8-direction)
  - [ ] Tile map renderer helpers (chunking, layering, collision tags)
  - [ ] Shadowcasting field-of-view utilities and minimap helpers
- **Systems for gameplay loops**
  - [ ] Inventory system primitives (stacking, filtering, persistence hooks)
  - [ ] Combat resolution helpers (cooldowns, damage formulas, status effects)
  - [ ] Quest/dialog state machine utilities
  - [ ] 2D lighting helpers (falloff, blending stubs)
  - [ ] Wave spawner utilities for encounter pacing
  - [ ] Sound manager stubs (channel limiting, priority)
  - [ ] Input manager abstraction (keyboard/mouse/pad remapping)
  - [ ] Save/load serialization helpers (slots, integrity checks)
  - [ ] Screen transition utilities (fades, wipes, letterboxing)

## Milestone 0.5.0 – Algorithm Vault & Data Structures (Planned)
- **AI & behaviour expansions**
  - [ ] Finite state machine (FSM) toolkit
  - [ ] Genetic algorithm utilities
  - [ ] Influence map computation helpers
- **Search & string algorithms**
  - [ ] Knuth–Morris–Pratt (KMP) substring search
  - [ ] Rabin–Karp multiple pattern matching
  - [ ] Boyer–Moore fast substring search
  - [ ] Suffix array construction utilities
  - [ ] Longest common subsequence (LCS) enhancements and diff helpers
- **Data pipelines & utilities**
  - [ ] Flatten/unflatten helpers for nested structures
  - [ ] Pagination utilities for client-side paging
  - [ ] Advanced diff tooling (tree diff, selective patches)
- **Visual & simulation tools**
  - [ ] Color manipulation helpers (RGB/HSL conversion, blending)
  - [ ] Force-directed graph layout
  - [ ] Marching squares contour extraction
  - [ ] Marching cubes isosurface generation
- **Graph algorithms**
  - [ ] Minimum spanning tree (Kruskal)
  - [ ] Strongly connected components (Tarjan/Kosaraju)
  - [ ] Maximum flow (Ford–Fulkerson / Edmonds–Karp)
- **Spatial & collision expansion**
  - [ ] Octree partitioning for 3D space
  - [ ] Circle collision helpers
  - [ ] Raycasting utilities
  - [ ] Bounding volume hierarchy (BVH) builder
- **Data structures**
  - [ ] Binary heap priority queue
  - [ ] Disjoint set union (union-find)
  - [ ] Bloom filter probabilistic membership
  - [ ] Skip list sorted structure
  - [ ] Segment tree range query helper
- **Compression & encoding**
  - [ ] Run-length encoding (RLE)
  - [ ] Huffman coding utilities
  - [ ] LZ77 dictionary compression helper
  - [ ] Base64 encode/decode utilities
- **Geometric & numeric utilities**
  - [ ] Closest pair of points solver for geometry toolkit

## Milestone 1.0.0 – Production Readiness
- [ ] Publish to npm with semver automation and changelog management
- [ ] Provide comprehensive documentation site (e.g., VitePress) with interactive demos
- [ ] Offer ESM + CJS build outputs and tree-shaking test cases
- [ ] Establish regression test suite with snapshot examples for deterministic algorithms

---

## Recently Completed Tasks
- TypeScript migration with strict compiler settings
- Added steering behaviours and SAT collision detection
- Set up Vitest suites and GitHub Actions CI pipeline
- Authored usage examples to accelerate onboarding

## Upcoming Focus
1. Procedural generation enhancements (Worley refinements, Worley-based effects, upcoming Worley variants like Worley F1/F2)
2. Behavioural AI additions (crowd steering via RVO, flow-field integration, behaviour tree decorators)
3. Procedural & systems expansion (Wave Function Collapse, dungeon suite, L-systems, diamond-square, full game systems toolkit)
4. Advanced collision utilities (swept volumes with rotation, broad-phase acceleration structures)
Note: tasks will move to the completed section once merged via the standard branch + PR workflow.
