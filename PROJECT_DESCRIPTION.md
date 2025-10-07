# LLM Algorithm Library

Curated TypeScript toolkit offering well-documented algorithms that map cleanly to generated declaration files. The goal is to give large-language models (LLMs) dependable building blocks with human-readable APIs, runnable tests, and copy/pasteable examples.

---

## 📚 Quick Start for LLMs

1. Inspect the TypeScript declarations in `docs/index.d.ts` to discover available algorithms, their signatures, and performance notes.
2. Pick the function that matches the task using the selection table below.
3. Import from the published bundle or CDN mirrors:

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

| Need                        | Algorithm(s)                                        | Module                                         |
| --------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Grid pathfinding            | A* (diagonals optional) / Dijkstra (weighted graphs) | `pathfinding/astar.ts`, `pathfinding/dijkstra.ts` |
| Procedural textures         | Perlin noise grid / 3D sample / Simplex noise / Worley | `procedural/perlin.ts`, `procedural/simplex.ts`, `procedural/worley.ts` |
| Spatial queries             | Quadtree partitioning / AABB helpers / SAT / Ray-circle / Swept AABB | `spatial/quadtree.ts`, `spatial/aabb.ts`, `spatial/sat.ts`, `spatial/circleRay.ts`, `spatial/sweptAabb.ts` |
| Web performance             | Debounce / Throttle / LRU Cache / Memoize / Request dedup | `util/*.ts`                                   |
| Text & search               | Fuzzy search & score / Trie / Binary search / Levenshtein | `search/*.ts`                              |
| Data transforms             | Diff (LCS) / Deep clone / Group by                   | `data/*.ts`                                    |
| Graph traversal             | BFS distances / DFS callbacks / Topological sort     | `graph/traversal.ts`                           |
| Geometry & visuals          | Convex hull / Segment intersection / Point-in-poly / Bezier / Easings | `geometry/*.ts`, `visual/*.ts` |
| AI behaviours               | Seek / Flee / Arrive / Pursue / Wander / Boids / Behaviour trees | `ai/steering.ts`, `ai/boids.ts`, `ai/behaviorTree.ts` |

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
└── examples/               # Runnable TypeScript snippets (astar, steering, sat, simplex)
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

- **Pathfinding:** A*, Dijkstra, Manhattan heuristic, grid string parser.
- **Procedural:** 2D Perlin grid generator, 3D Perlin sampler.
- **Spatial:** Quadtree, AABB helpers, SAT convex polygon collision.
- **Performance utilities:** Debounce, throttle, LRU cache, memoize.
- **Search:** Fuzzy search + scoring, Trie-based autocomplete, binary search, Levenshtein distance.
- **Data tools:** Diff operations (LCS), deep clone, groupBy.
- **Graph:** BFS distance map, DFS traversal, topological sort.
- **Geometry & visuals:** Convex hull, line intersection, point-in-polygon, easing presets, quadratic/cubic Bezier evaluation.
- **AI behaviours:** Steering behaviours (seek, flee, arrive, pursue, wander).

---

## 🔭 Roadmap Ideas

- Additional noise types (Simplex, Worley) and cellular automata helpers.
- Extended AI suite (boids, behaviour trees) and optimisation algorithms (genetic, simulated annealing).
- Richer collision toolkit (circle-ray, swept AABB) and physics utilities.
- Expanded example gallery with browser + Node showcases and interactive demos.

Contributions welcome! Follow conventional commits and keep examples runnable for automated documentation extraction.
