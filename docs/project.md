# LLM Algorithm Library – Reference Companion

This document complements `docs/index.d.ts` with high-level navigation notes that help human developers and coding assistants discover the right algorithms quickly.

## 📚 Quick Start

### For LLMs and automation
1. Inspect the TypeScript definitions in `docs/index.d.ts` for signatures, “Use for” blurbs, and performance notes.
2. Pick the algorithm that matches your task from the selection guide below.
3. Import from the package entry point or CDN:

```ts
import { astar } from 'llm-algorithms/dist/index.js';
```

```html
<script type="module">
  import { astar, perlin } from "https://cdn.jsdelivr.net/npm/llm-algorithms/dist/index.js";
</script>
```

### For local development

```bash
npm install llm-algorithms
npm run build           # emit dist/
```

Examples in `examples/` are runnable with `tsx`/`ts-node` for quick validation.

---

## 🎯 Algorithm Selection Guide

| Need | Algorithm(s) | Import From | Example |
| ---- | ------------ | ----------- | ------- |
| Grid pathfinding | `astar`, `dijkstra`, `manhattanDistance`, `gridFromString` | `pathfinding/astar.ts`, `pathfinding/dijkstra.ts` | `examples/astar.ts` |
| Procedural generation | `perlin`, `perlin3D`, `simplex2D`, `simplex3D`, `worley`, `worleySample` | `procedural/*.ts` | `examples/simplex.ts`, `examples/worley.ts` |
| Spatial queries & collision | `Quadtree`, `aabbCollision`, `aabbIntersection`, `satCollision`, `circleRayIntersection`, `sweptAABB` | `spatial/*.ts` | `examples/sat.ts` |
| AI behaviours & crowds | `seek`, `flee`, `arrive`, `pursue`, `wander`, `updateBoids`, `BehaviorTree`, `rvoStep` | `ai/steering.ts`, `ai/boids.ts`, `ai/behaviorTree.ts`, `ai/rvo.ts` | `examples/steering.ts`, `examples/boids.ts`, `examples/rvo.ts` |
| Web performance & UI | `debounce`, `throttle`, `LRUCache`, `memoize`, `deduplicateRequest`, `clearRequestDedup`, `calculateVirtualRange` | `util/*.ts` | `examples/requestDedup.ts`, `examples/virtualScroll.ts` |
| Text & search | `fuzzySearch`, `fuzzyScore`, `Trie`, `binarySearch`, `levenshteinDistance` | `search/*.ts` | `tests/search.test.ts` |
| Data transforms & diffing | `diff`, `deepClone`, `groupBy`, `diffJson`, `applyJsonDiff` | `data/*.ts` | `tests/jsonDiff.test.ts` |
| Graph algorithms | `graphBFS`, `graphDFS`, `topologicalSort` | `graph/traversal.ts` | `tests/graph.test.ts` |
| Geometry & visuals | `convexHull`, `lineIntersection`, `pointInPolygon`, `easing`, `quadraticBezier`, `cubicBezier` | `geometry/*.ts`, `visual/*.ts` | `tests/geometry.test.ts`, `tests/visual.test.ts` |

---

## 📦 Project Structure (TypeScript)

```
llm-algorithms/
├── docs/
│   ├── index.d.ts          # Authoritative type surface + “Use for” notes
│   ├── index2.d.ts         # Quick navigation helper (references index.d.ts)
│   └── project.md          # This guide
├── examples/               # Runnable scripts (astar, steering, boids, rvo, sat, simplex, worley, requestDedup, virtualScroll)
├── src/
│   ├── ai/                 # Steering, boids, behaviour tree, RVO
│   ├── data/               # Diff, deep clone, groupBy, JSON diff
│   ├── graph/              # BFS, DFS, topological sort
│   ├── pathfinding/        # A*, Dijkstra helpers
│   ├── procedural/         # Noise generators
│   ├── search/             # Fuzzy search, trie, binary search, Levenshtein
│   ├── spatial/            # Quadtree, AABB, SAT, circle-ray, swept AABB
│   ├── util/               # Debounce, throttle, LRU, memoize, dedup, virtual scroll
│   ├── visual/             # Easing curves, Bezier helpers
│   ├── types.ts            # Shared geometric and agent types
│   └── index.ts            # Barrel exports
├── tests/                  # Vitest coverage ensuring examples remain truthful
└── README.md               # High-level summary + selection table
```

---

## 🧠 Working With LLMs

When prompting an LLM to add or extend functionality, ensure it follows these guardrails:

1. **Implementation** – add runtime code to `src/<category>/<name>.ts` using modern TypeScript, rich JSDoc, and small pure helpers. Provide at least two `@example` blocks.
2. **Types & docs** – update `docs/index.d.ts` (and this guide if applicable) with description, “Use for” line, performance note, import path, and any new interfaces/options.
3. **Exports** – wire the module through `src/index.ts` and add/extend the relevant types in `src/types.ts` when necessary.
4. **Tests** – create Vitest coverage in `tests/` demonstrating success paths and edge cases. Prefer deterministic fixtures to keep CI stable.
5. **Examples** – add or update an entry under `examples/` so users can run the algorithm quickly.
6. **Quality gate** – ensure `npm run lint`, `npm run typecheck`, `npm run build`, `npm run size`, and `npm run test:coverage` succeed before opening a PR.

Following these steps keeps the documentation aligned with the code and makes the library predictable for both humans and language models.

---

## ✅ Included Implementations (Snapshot)

- **Pathfinding:** A*, Dijkstra, Manhattan heuristic, grid helpers.
- **Procedural:** Perlin (2D/3D), Simplex (2D/3D), Worley noise.
- **Spatial:** Quadtree, AABB helpers, SAT collision, circle-ray intersection, swept AABB.
- **Web performance:** Debounce, throttle, LRU cache, memoize, request deduplication, virtual scroll windowing.
- **Search & text:** Fuzzy search/scoring, Trie autocomplete, binary search, Levenshtein distance.
- **Data pipelines:** Diff (LCS), deep clone, groupBy, JSON diff/patch helpers.
- **Graph:** BFS distance map, DFS traversal, topological ordering.
- **Geometry & visuals:** Convex hull, line intersection, point-in-polygon, easing curves, Bezier evaluation.
- **AI behaviours:** Steering helpers, boids, behaviour trees, RVO crowd steering.

---

## 🔭 Upcoming Focus

- Flow-field integration with RVO for smoother large crowd routing.
- Behaviour-tree decorators and reusable condition/action packs.
- Additional procedural generators (erosion, domain-warped noise).
- Expanded example gallery with visualization snippets.
- Procedural world toolkit (Wave Function Collapse, dungeon suites, L-systems, diamond-square, maze packs).
- Complete gameplay systems (game loop, camera, particle/sprite systems, platformer physics, tile map renderer, FOV, inventory, combat, quest/dialog, lighting, wave spawner, sound manager, input manager, save/load, screen transitions).

Contributions welcome! Follow conventional commits and keep examples runnable so docs stay in sync.
