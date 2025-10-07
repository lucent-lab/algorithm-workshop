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
- [ ] Implement reciprocal velocity obstacles (RVO) crowd steering with tests and example
- [ ] Add Jump Point Search optimisation for uniform grids
- [ ] Implement flow-field pathfinding for multi-unit navigation
- [ ] Provide navigation mesh (navmesh) helper for irregular terrain

## Milestone 0.3.0 – Web Performance & Data Pipelines
- [x] Introduce request deduplication helper
- [x] Ship virtual scrolling utilities
- [x] Add diff/patch helpers for nested JSON structures
- [x] Create benchmarking scripts to compare algorithm variants
- [x] Expand CI to include coverage gating and bundle size checks

## Milestone 0.4.0 – Procedural Worlds & Game Systems (Planned)
- [ ] Implement Wave Function Collapse tile solver with options + example
- [ ] Add dungeon generation suite (BSP subdivision, rooms & corridors variants)
- [ ] Provide L-system generator for foliage/organic structures
- [ ] Ship diamond-square terrain height map generator
- [ ] Offer maze algorithms pack (Kruskal, Wilson, Aldous–Broder, Recursive Division)
- [ ] Add cellular automata cave/organic generator utilities
- [ ] Deliver fixed-timestep game loop utility with interpolation helpers
- [ ] Provide object pool helper for rapid reuse of entities
- [ ] Add weighted random selector (aliasing method) utilities
- [ ] Implement Bresenham line / raster traversal helpers
- [ ] Implement 2D camera system (smooth follow, screen shake, dead zones)
- [ ] Add particle system with configurable emitters
- [ ] Provide sprite animation controller (frame timing, looping, events)
- [ ] Implement platformer physics helper (gravity, coyote time, jump buffering)
- [ ] Ship tile map renderer helpers (chunking, layering)
- [ ] Add shadowcasting field-of-view (FOV) utilities
- [ ] Implement inventory system primitives (stacking, filtering, persistence hooks)
- [ ] Add combat resolution helpers (cooldowns, damage formulas, status effects)
- [ ] Provide quest/dialog state machine utilities
- [ ] Implement 2D lighting helpers (light falloff, blending stubs)
- [ ] Add wave spawner utilities for encounter pacing
- [ ] Provide sound manager stubs (channel limiting, priority)
- [ ] Implement input manager abstraction (key remapping, axis curves)
- [ ] Add save/load serialization helpers (slots, integrity checks)
- [ ] Provide screen transition utilities (fades, wipes, letterboxing)

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
