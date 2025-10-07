# LLM Algorithms

Utility-first TypeScript toolkit of high-signal algorithms tailored for large language model (LLM) generated code snippets and rapid prototyping scenarios. The project emphasises readable implementations, comprehensive documentation, and runnable examples that translate well into AI-assisted development workflows.

## Install
```bash
npm install llm-algorithms
```

ES module import (Node 18+ / modern bundlers):
```ts
import { astar, perlin } from 'llm-algorithms';
```

CDN usage:
```html
<script type="module">
  import { astar } from "https://cdn.jsdelivr.net/npm/llm-algorithms/dist/index.js";
  // ...
</script>
```

## Included Modules (v0.1.0)
- **Pathfinding:** A*, Dijkstra, Manhattan heuristic, grid string parser
- **Procedural:** 2D/3D Perlin noise, Simplex noise, Worley (cellular) noise
- **Spatial:** Quadtree, AABB helpers, SAT polygon intersection, circle-ray intersection, swept AABB
- **Search & Text:** Fuzzy search/scoring, Trie autocomplete, binary search, Levenshtein distance
- **Data:** Diff (LCS), deep clone, groupBy
- **Graph:** BFS distance map, DFS traversal, topological sort
- **Visual & Geometry:** Convex hull, line intersection, point-in-polygon, easing presets, Bezier helpers
- **AI Behaviours:** Steering behaviours (seek, flee, arrive, pursue, wander), boids flocking update

## Scripts
```bash
npm run lint        # ESLint + TypeScript rules
npm run typecheck   # Strict TypeScript validation
npm run build       # Emits dist/ with ESM + .d.ts
npm test            # Vitest suite
```

Examples live under `examples/` and can be executed with `tsx`/`ts-node` or compiled for the browser. See `examples/astar.ts`, `examples/steering.ts`, `examples/boids.ts`, `examples/sat.ts`, `examples/simplex.ts`, and `examples/worley.ts` for quick starts.

## Contributing
1. Fork the repository.
2. Create a feature branch per algorithm addition.
3. Update docs (`docs/index.d.ts`), examples, and tests alongside implementation.
4. Run the full suite (`lint`, `typecheck`, `build`, `test`) before opening a PR.

MIT License.
