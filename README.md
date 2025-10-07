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

| Goal | Algorithms | Import From | Example |
| ---- | ---------- | ----------- | ------- |
| Pathfinding & navigation | `astar`, `dijkstra`, `jumpPointSearch`, `computeFlowField`, `buildNavMesh`, `findNavMeshPath`, `manhattanDistance`, `gridFromString` | `pathfinding/astar.ts`, `pathfinding/dijkstra.ts`, `pathfinding/jumpPointSearch.ts`, `pathfinding/flowField.ts`, `pathfinding/navMesh.ts` | `examples/astar.ts`, `examples/flowField.ts`, `examples/navMesh.ts` |
| Procedural generation | `perlin`, `perlin3D`, `simplex2D`, `simplex3D`, `worley`, `worleySample`, `waveFunctionCollapse`, `cellularAutomataCave`, `poissonDiskSampling`, `computeVoronoiDiagram`, `diamondSquare`, `generateLSystem`, `generateBspDungeon`, `generateRecursiveMaze`, `generatePrimMaze`, `generateKruskalMaze`, `generateWilsonMaze`, `generateAldousBroderMaze` | `procedural/*.ts` | `examples/simplex.ts`, `examples/worley.ts`, `examples/waveFunctionCollapse.ts`, `examples/cellularAutomata.ts`, `examples/poissonDisk.ts`, `examples/voronoi.ts`, `examples/diamondSquare.ts`, `examples/lSystem.ts`, `examples/dungeonBsp.ts`, `examples/mazeRecursive.ts`, `examples/mazePrim.ts`, `examples/mazeKruskal.ts`, `examples/mazeWilson.ts`, `examples/mazeAldous.ts` |
| Spatial queries & collision | `Quadtree`, `aabbCollision`, `aabbIntersection`, `satCollision`, `circleRayIntersection`, `sweptAABB` | `spatial/*.ts` | `examples/sat.ts` |
| AI behaviours & crowds | `seek`, `flee`, `arrive`, `pursue`, `wander`, `updateBoids`, `BehaviorTree`, `rvoStep` | `ai/steering.ts`, `ai/boids.ts`, `ai/behaviorTree.ts`, `ai/rvo.ts` | `examples/steering.ts`, `examples/boids.ts`, `examples/rvo.ts` |
| Web performance & UI | `debounce`, `throttle`, `LRUCache`, `memoize`, `deduplicateRequest`, `clearRequestDedup`, `calculateVirtualRange` | `util/*.ts` | `examples/requestDedup.ts`, `examples/virtualScroll.ts` |
| Search & text | `fuzzySearch`, `fuzzyScore`, `Trie`, `binarySearch`, `levenshteinDistance` | `search/*.ts` | `examples/search.ts` |
| Data & diff pipelines | `diff`, `deepClone`, `groupBy`, `diffJson`, `applyJsonDiff` | `data/*.ts` | `examples/jsonDiff.ts` |
| Graph algorithms | `graphBFS`, `graphDFS`, `topologicalSort` | `graph/traversal.ts` | `examples/graph.ts` |
| Visual & geometry | `convexHull`, `lineIntersection`, `pointInPolygon`, `easing`, `quadraticBezier`, `cubicBezier` | `geometry/*.ts`, `visual/*.ts` | `examples/geometry.ts`, `examples/visual.ts` |

## Scripts
```bash
npm run lint        # ESLint + TypeScript rules
npm run typecheck   # Strict TypeScript validation
npm run build       # Emits dist/ with ESM + .d.ts
npm test            # Vitest suite
npm run test:coverage  # Enforce coverage thresholds
npm run benchmark   # Compare algorithm variants locally
npm run size        # Enforce bundle size budget
```

## API Reference
- Full TypeScript signatures with "Use for" and performance notes live in `docs/index.d.ts`. Keep this document in sync with `src/index.ts` so tooling and LLMs can discover the complete surface area.

## Roadmap Snapshot
- Milestone 0.2 next targets crowd-flow integrations (RVO + flow fields) and behaviour-tree decorators for richer AI control.
- Milestone 0.4 plans a procedural + gameplay systems toolkit (Wave Function Collapse, dungeon suite, L-systems, game loop, camera, particles, inventory, combat, save/load, and more).

Examples live under `examples/` and can be executed with `tsx`/`ts-node` or compiled for the browser. See `examples/astar.ts`, `examples/flowField.ts`, `examples/navMesh.ts`, `examples/cellularAutomata.ts`, `examples/poissonDisk.ts`, `examples/voronoi.ts`, `examples/diamondSquare.ts`, `examples/lSystem.ts`, `examples/dungeonBsp.ts`, `examples/mazeRecursive.ts`, `examples/mazePrim.ts`, `examples/mazeKruskal.ts`, `examples/mazeWilson.ts`, `examples/mazeAldous.ts`, `examples/steering.ts`, `examples/boids.ts`, `examples/requestDedup.ts`, `examples/search.ts`, `examples/graph.ts`, `examples/geometry.ts`, `examples/visual.ts`, `examples/sat.ts`, `examples/simplex.ts`, and `examples/worley.ts` for quick starts. The `examples` registry exported from `src/index.ts` provides a typed index you can traverse programmatically.

## Contributing
1. Fork the repository.
2. Create a feature branch per algorithm addition.
3. Update docs (`docs/index.d.ts`), examples, and tests alongside implementation.
4. Run the full suite (`lint`, `typecheck`, `build`, `test`) before opening a PR.

MIT License.
