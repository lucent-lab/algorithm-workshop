# LLM Algorithms Roadmap

## Milestone 0.1.0 – Foundational Toolkit

- [x] Scaffold project structure, npm metadata, and documentation
- [x] Migrate runtime codebase to strict TypeScript with shared type definitions
- [x] Implement core algorithms (A\*, Dijkstra, Perlin, Quadtree, AABB, data/search utilities)
- [x] Add steering behaviours and SAT collision module
- [x] Provide Vitest coverage for representative algorithms
- [x] Ship runnable TypeScript examples (A\*, steering, SAT)
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

## Milestone 0.4.0 – Procedural Worlds & Game Systems (Planned)
- Procedural generators:
  - [x] Wave Function Collapse tile solver with options + example
  - [x] Cellular automata cave/organic generator utilities
  - [x] Poisson disk sampling for even point distribution
  - [x] Voronoi diagram helpers for biome/territory generation
  - [x] Diamond-square terrain height map generator
  - [x] L-system generator for foliage and organic structures
  - [x] Dungeon generation suite (BSP subdivision, rooms & corridors variants)
  - [x] Maze algorithms pack (Recursive backtracking ✅, Prim's ✅, Kruskal's ✅, Wilson's ✅, Aldous–Broder ✅, Recursive Division ✅)
- Gameplay systems & utilities:
  - [x] Fixed-timestep game loop utility with interpolation helpers
  - [x] Delta-time manager for frame-independent timing
  - [x] Object pool helper for reusable entities
  - [x] Weighted random selector (alias method)
  - [x] Fisher–Yates shuffle implementation
  - [x] Bresenham line / raster traversal helpers
- Real-time systems:
  - [x] 2D camera system (smooth follow, dead zones, screen shake)
  - [x] Particle system with configurable emitters
  - [x] Sprite animation controller (frame timing, events)
  - [x] Tween/lerp utility for smooth interpolation
  - [x] Platformer physics helper (gravity, coyote time, jump buffering)
  - [x] Top-down movement helper (8-direction)
  - [x] Tile map renderer helpers (chunking, layering, collision tags)
  - [x] Shadowcasting field-of-view utilities and minimap helpers
- **Systems for gameplay loops**
  - [x] Inventory system primitives (stacking, filtering, persistence hooks)
  - [x] Combat resolution helpers (cooldowns, damage formulas, status effects)
  - [x] Quest/dialog state machine utilities
  - [x] 2D lighting helpers (falloff, blending stubs)
  - [x] Wave spawner utilities for encounter pacing
  - [x] Sound manager stubs (channel limiting, priority)
  - [x] Input manager abstraction (keyboard/mouse/pad remapping)
  - [x] Save/load serialization helpers (slots, integrity checks)
  - [x] Screen transition utilities (fades, wipes, letterboxing)

## Milestone 0.5.0 – Algorithm Vault & Data Structures (Planned)

- **AI & behaviour expansions**
  - [x] Finite state machine (FSM) toolkit
  - [x] Genetic algorithm utilities
  - [x] Influence map computation helpers
- **Search & string algorithms**
  - [x] Knuth–Morris–Pratt (KMP) substring search
  - [x] Rabin–Karp multiple pattern matching
  - [x] Boyer–Moore fast substring search
  - [x] Suffix array construction utilities
  - [x] Longest common subsequence (LCS) enhancements and diff helpers
  - [x] Aho–Corasick multi-pattern automaton
**Data pipelines & utilities**
  - [x] Flatten/unflatten helpers for nested structures
  - [x] Pagination utilities for client-side paging
  - [x] Advanced diff tooling (tree diff, selective patches)
**Visual & simulation tools**
  - [x] Color manipulation helpers (RGB/HSL conversion, blending)
  - [x] Force-directed graph layout
  - [x] Marching squares contour extraction
  - [x] Marching cubes isosurface generation
**Graph algorithms**
  - [x] Minimum spanning tree (Kruskal)
  - [x] Strongly connected components (Tarjan/Kosaraju)
  - [x] Maximum flow (Dinic preferred; Edmonds–Karp fallback)
**Spatial & collision expansion**
  - [x] Octree partitioning for 3D space
  - [x] Circle collision helpers
  - [x] Raycasting utilities
  - [x] Bounding volume hierarchy (BVH) builder
**Data structures**
  - [x] Binary heap priority queue
  - [x] Disjoint set union (union-find)
  - [x] Bloom filter probabilistic membership
  - [x] Skip list sorted structure
  - [x] Segment tree range query helper
**Compression & encoding**
  - [x] Run-length encoding (RLE)
  - [x] Huffman coding utilities
  - [x] LZ77 dictionary compression helper
  - [x] Base64 encode/decode utilities
**Geometric & numeric utilities**
  - [ ] Closest pair of points solver for geometry toolkit

## Milestone 0.6.0 – Fold Barrier Physics Suite (Planned)
- [x] Align Fold barrier scope with the paper and define shared constraint interfaces in `src/physics/fold`
- **Barrier primitives** (each item: runtime module + `docs/index.d.ts` entry + Vitest coverage + runnable example when feasible)
  - [x] Cubic barrier potential (energy, gradient, Hessian evaluation)
  - [ ] Stiffness design principle for frozen barrier stiffness
  - [ ] Contact barrier with extended direction handling
  - [ ] Pin constraint barrier using cubic barrier formulation
  - [ ] Wall constraint barrier for plane collisions
  - [ ] Triangle strain-limiting barrier driven by deformation singular values
- **Integrator and solver**
  - [ ] Inexact Newton integrator with beta accumulation
  - [ ] Constraint-only line search with extended direction scaling
  - [ ] Semi-implicit freeze schedule for barrier stiffness updates
  - [ ] Error-reduction pass leveraging beta-delta time refinement
  - [ ] Linear solver pipeline (PCG with 3x3 block-Jacobi preconditioner)
- **Contact and friction infrastructure**
  - [ ] Friction potential tied to contact force magnitude
  - [ ] Matrix assembly with cached contact index tables
  - [ ] Gap evaluators for point/triangle, edge/edge, and wall constraints
  - [ ] SPD enforcement pass for elasticity Hessian blocks

### LLM‑Optimised Additions (Priority Rationale)

These items offer the largest context and correctness savings for LLM users. Prioritize when bandwidth is limited:

1) Aho–Corasick automaton (string search)
   - Deterministic trie with failure links; long to hand-roll; great for lexing and multi‑pattern filters.

2) Dinic maximum flow (graph)
   - Level graph + blocking flow; reusable for min‑cut, image segmentation, bipartite matching.

3) Suffix Automaton or Ukkonen Suffix Tree (string index)
   - Advanced indexing primitive enabling substring queries and LCS; compact but intricate to implement.

4) Delaunay Triangulation (Bowyer–Watson) + KD‑Tree (geometry)
   - Robust triangulation and fast nearest neighbour queries are both lengthy and widely reused.

5) BVH (SAH) builder (spatial)
   - Non‑trivial tree construction with cost heuristics; useful for ray queries and collision.

6) Polygon clipping (Greiner–Hormann / Weiler–Atherton)
   - Complex boolean operations for polygons (union/intersect/diff); many edge cases.

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
