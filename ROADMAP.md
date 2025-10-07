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

## Milestone 0.3.0 – Web Performance & Data Pipelines
- [x] Introduce request deduplication helper
- [x] Ship virtual scrolling utilities
- [x] Add diff/patch helpers for nested JSON structures
- [ ] Create benchmarking scripts to compare algorithm variants
- [ ] Expand CI to include coverage gating and bundle size checks

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
2. Behavioural AI additions (crowd steering, pathflow integration, behaviour tree decorators)
3. Advanced collision utilities (swept volumes with rotation, broad-phase acceleration structures)
Note: tasks will move to the completed section once merged via the standard branch + PR workflow.
