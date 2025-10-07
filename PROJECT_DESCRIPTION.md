# LLM Algorithm Library

Curated TypeScript toolkit offering well-documented algorithms that map cleanly to generated declaration files. The goal is to give large-language models (LLMs) dependable building blocks with human-readable APIs, runnable tests, and copy/pasteable examples.

---

## 📚 Quick Start for LLMs

1. Inspect the TypeScript declarations in `docs/index.d.ts` to discover available algorithms, their signatures, and performance notes.
2. Pick the function that matches the task using the selection table below.
3. Use the `examples` registry exported from `src/index.ts` to locate runnable snippets programmatically when guiding an LLM.
4. Import from the published bundle or CDN mirrors:

```ts
import { astar, perlin } from 'llm-algorithms';
```

CDN usage:
```html
<script type="module">
  import { astar } from "https://cdn.jsdelivr.net/npm/llm-algorithms/dist/index.js";
</script>
```

Developers working locally can install via npm:

```bash
npm install llm-algorithms
npm run build
```

---

## 🎯 Algorithm Selection Guide

| Need | Algorithm(s) | Module | Example |
| ---- | ------------ | ------ | ------- |
| Grid pathfinding | `astar`, `dijkstra`, `jumpPointSearch`, `computeFlowField`, `buildNavMesh`, `findNavMeshPath`, `manhattanDistance`, `gridFromString` | `pathfinding/astar.ts`, `pathfinding/dijkstra.ts`, `pathfinding/jumpPointSearch.ts`, `pathfinding/flowField.ts`, `pathfinding/navMesh.ts` | `examples/astar.ts`, `examples/flowField.ts`, `examples/navMesh.ts` |
| Procedural textures & terrain | `perlin`, `perlin3D`, `simplex2D`, `simplex3D`, `worley`, `worleySample`, `waveFunctionCollapse`, `cellularAutomataCave`, `poissonDiskSampling`, `computeVoronoiDiagram`, `diamondSquare`, `generateLSystem`, `generateBspDungeon`, `generateRecursiveMaze`, `generatePrimMaze`, `generateKruskalMaze`, `generateWilsonMaze`, `generateAldousBroderMaze`, `generateRecursiveDivisionMaze` | `procedural/*.ts` | `examples/simplex.ts`, `examples/worley.ts`, `examples/waveFunctionCollapse.ts`, `examples/cellularAutomata.ts`, `examples/poissonDisk.ts`, `examples/voronoi.ts`, `examples/diamondSquare.ts`, `examples/lSystem.ts`, `examples/dungeonBsp.ts`, `examples/mazeRecursive.ts`, `examples/mazePrim.ts`, `examples/mazeKruskal.ts`, `examples/mazeWilson.ts`, `examples/mazeAldous.ts`, `examples/mazeDivision.ts` |
| Spatial queries & collision | `Quadtree`, `aabbCollision`, `aabbIntersection`, `satCollision`, `circleRayIntersection`, `sweptAABB` | `spatial/*.ts` | `examples/sat.ts` |
| Web performance & UI throttling | `debounce`, `throttle`, `LRUCache`, `memoize`, `deduplicateRequest`, `clearRequestDedup`, `calculateVirtualRange`, `createWeightedAliasSampler` | `util/*.ts` | `examples/requestDedup.ts`, `examples/virtualScroll.ts`, `examples/weightedAlias.ts` |
| Text & search | `fuzzySearch`, `fuzzyScore`, `Trie`, `binarySearch`, `levenshteinDistance` | `search/*.ts` | `examples/search.ts` |
| Data transforms & diffing | `diff`, `deepClone`, `groupBy`, `diffJson`, `applyJsonDiff` | `data/*.ts` | `examples/jsonDiff.ts` |
| Graph traversal | `graphBFS`, `graphDFS`, `topologicalSort` | `graph/traversal.ts` | `examples/graph.ts` |
| Geometry & visuals | `convexHull`, `lineIntersection`, `pointInPolygon`, `easing`, `quadraticBezier`, `cubicBezier` | `geometry/*.ts`, `visual/*.ts` | `examples/geometry.ts`, `examples/visual.ts` |
| AI behaviours & crowds | `seek`, `flee`, `arrive`, `pursue`, `wander`, `updateBoids`, `BehaviorTree`, `rvoStep` | `ai/steering.ts`, `ai/boids.ts`, `ai/behaviorTree.ts`, `ai/rvo.ts` | `examples/steering.ts`, `examples/boids.ts`, `examples/rvo.ts` |

---

## 📦 Project Structure

```
llm-algorithms/
├── README.md
├── package.json
├── docs/
│   └── index.d.ts          # TypeScript definitions + LLM guidance
├── src/
│   ├── index.ts            # Barrel exports
│   ├── ai/
│   ├── data/
│   ├── geometry/
│   ├── graph/
│   ├── pathfinding/
│   ├── procedural/
│   ├── search/
│   ├── spatial/
│   ├── types.ts
│   └── visual/
├── tests/                  # Vitest suites covering representative algorithms
└── examples/               # Runnable TypeScript snippets (astar, steering, search, graph, geometry, visual)
```

---

## 🧠 Working With LLMs

When requesting a new algorithm from an LLM:

1. Implement the runtime inside `src/<category>/<name>.ts` with rich JSDoc (description sentence, "Useful for" line, explicit `@param`, `@returns`, and at least two runnable `@example`s).
2. Update `docs/index.d.ts` with the matching signature, performance note, and import hint so tooling stays in sync.
3. Add or update tests under `tests/` and examples under `examples/` to showcase usage.
4. Export the new function from `src/index.ts` and ensure `npm run lint && npm run typecheck && npm run build && npm test` succeed.

Consistency between runtime code, documentation, and TypeScript declarations keeps generated code trustworthy for both humans and LLMs.

---

## ✅ Included Implementations (v0.1.0)

- **Pathfinding:** A*, Dijkstra, Jump Point Search, flow field integration, Manhattan heuristic, grid string parser.
- **Procedural:** 2D/3D Perlin, Worley noise, Wave Function Collapse tile synthesis.
- **Spatial:** Quadtree, AABB helpers, SAT convex polygon collision.
- **Performance utilities:** Debounce, throttle, LRU cache, memoize, request deduplication, virtual scrolling.
- **Search:** Fuzzy search + scoring, Trie-based autocomplete, binary search, Levenshtein distance.
- **Data tools:** Diff operations (LCS), deep clone, groupBy, JSON diff/patch helpers.
- **Graph:** BFS distance map, DFS traversal, topological sort.
- **Geometry & visuals:** Convex hull, line intersection, point-in-polygon, easing presets, quadratic/cubic Bezier evaluation.
- **AI behaviours:** Steering behaviours (seek, flee, arrive, pursue, wander), boids, behaviour trees, RVO crowd steering.

---

## 🔭 Roadmap Ideas

- Additional noise types (Simplex, Worley) and cellular automata helpers.
- Extended AI suite (boids, behaviour trees) and optimisation algorithms (genetic, simulated annealing).
- Advanced crowd steering variants (RVO + static obstacles, flow-field blends).
- Richer collision toolkit (circle-ray, swept AABB) and physics utilities.
- Expanded example gallery with browser + Node showcases and interactive demos.

Contributions welcome! Follow conventional commits and keep examples runnable for automated documentation extraction.
