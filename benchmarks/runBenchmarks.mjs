#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distEntry = join(__dirname, '../dist/index.js');

if (!existsSync(distEntry)) {
  console.error('dist/index.js not found. Run "npm run build" before benchmarking.');
  process.exit(1);
}

const {
  astar,
  dijkstra,
  manhattanDistance,
  graphBFS,
  perlin,
  worley,
  simplex2D,
  Quadtree,
} = await import('../dist/index.js');

function runBenchmarks() {
  const benchmarks = [
    createNoiseBenchmark(),
    createSpatialBenchmark(),
    createGraphBenchmark(),
  ];

  console.log('LLM Algorithms – Benchmark Suite');
  console.log('===================================');

  for (const benchmark of benchmarks) {
    executeBenchmark(benchmark);
  }
}

function createRng(seed = 42) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createNoiseBenchmark() {
  const width = 128;
  const height = 128;
  const seed = 1337;

  return {
    name: 'Procedural noise generation (128×128)',
    iterations: 5,
    context: { width, height, seed },
    variants: [
      {
        name: 'Perlin',
        run: ({ width: w, height: h, seed: s }) => aggregateGrid(perlin({ width: w, height: h, seed: s })),
      },
      {
        name: 'Worley',
        run: ({ width: w, height: h, seed: s }) => aggregateGrid(worley({ width: w, height: h, points: 32, seed: s })),
      },
      {
        name: 'Simplex',
        run: ({ width: w, height: h, seed: s }) => aggregateSimplex(w, h, s),
      },
    ],
  };
}

function aggregateGrid(grid) {
  let total = 0;
  for (const row of grid) {
    for (const value of row) {
      total += value;
    }
  }
  return total;
}

function aggregateSimplex(width, height, seed) {
  let total = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      total += simplex2D(x / width, y / height, seed);
    }
  }
  return total;
}

function createSpatialBenchmark() {
  const pointCount = 10_000;
  const queryRect = { x: 200, y: 200, width: 300, height: 300 };
  const rng = createRng(123);

  const points = Array.from({ length: pointCount }, () => ({
    x: rng() * 1_000,
    y: rng() * 1_000,
  }));

  const tree = new Quadtree({ x: 0, y: 0, width: 1_000, height: 1_000 }, 8);
  for (const point of points) {
    tree.insert(point);
  }

  return {
    name: 'Spatial query – quadtree vs linear scan',
    iterations: 50,
    context: { points, queryRect, tree },
    variants: [
      {
        name: 'Quadtree query',
        run: ({ tree: qt, queryRect: rect }) => qt.query(rect).length,
      },
      {
        name: 'Linear scan',
        run: ({ points: pts, queryRect: rect }) => {
          let hits = 0;
          const { x, y, width, height } = rect;
          const x2 = x + width;
          const y2 = y + height;
          for (const point of pts) {
            if (point.x >= x && point.x <= x2 && point.y >= y && point.y <= y2) {
              hits += 1;
            }
          }
          return hits;
        },
      },
    ],
  };
}

function createGraphBenchmark() {
  const dimension = 32;
  const obstacleChance = 0.18;
  const baseSeed = 9001;

  let generated;
  let reachable = false;
  for (let attempt = 0; attempt < 8 && !reachable; attempt += 1) {
    generated = buildGridGraph(dimension, obstacleChance, baseSeed + attempt);
    const distances = graphBFS(generated.graph, generated.startNode);
    reachable = distances.has(generated.goalNode);
  }

  if (!generated || !reachable) {
    throw new Error('Failed to generate a traversable grid graph for benchmarking.');
  }

  return {
    name: 'Graph traversal – Dijkstra vs BFS vs A*',
    iterations: 25,
    context: generated,
    variants: [
      {
        name: 'Dijkstra (weighted)',
        run: ({ graph: g, startNode: s, goalNode: t }) => {
          const result = dijkstra({ graph: g, start: s, goal: t });
          return result ? result.cost : Number.POSITIVE_INFINITY;
        },
      },
      {
        name: 'BFS (unweighted)',
        run: ({ graph: g, startNode: s, goalNode: t }) => {
          const distances = graphBFS(g, s);
          return distances.get(t) ?? Number.POSITIVE_INFINITY;
        },
      },
      {
        name: 'A* Manhattan heuristic',
        run: ({ grid, startPoint, goalPoint }) => {
          const path = astar({ grid, start: startPoint, goal: goalPoint, heuristic: manhattanDistance, allowDiagonal: false });
          return path ? path.length : Number.POSITIVE_INFINITY;
        },
      },
    ],
  };
}

function buildGridGraph(size, obstacleChance, seed) {
  const rng = createRng(seed);
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if ((x === 0 && y === 0) || (x === size - 1 && y === size - 1)) {
        continue;
      }
      grid[y][x] = rng() < obstacleChance ? 1 : 0;
    }
  }

  const graph = {};
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (grid[y][x] === 1) {
        continue;
      }
      const id = `${x},${y}`;
      graph[id] = [];
      const neighbors = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size || grid[ny][nx] === 1) {
          continue;
        }
        graph[id].push({ node: `${nx},${ny}`, weight: 1 + rng() * 4 });
      }
    }
  }

  return {
    graph,
    grid,
    startNode: '0,0',
    goalNode: `${size - 1},${size - 1}`,
    startPoint: { x: 0, y: 0 },
    goalPoint: { x: size - 1, y: size - 1 },
  };
}

function executeBenchmark({ name, iterations, context, variants }) {
  console.log(`\n${name}`);
  console.log('-'.repeat(name.length));

  const results = variants.map((variant) => measureVariant(variant, context, iterations));
  const table = results.map((result) => ({
    Variant: result.name,
    'Avg ms': result.avgMs.toFixed(3),
    'Ops/sec': result.opsPerSec.toFixed(2),
    Iterations: iterations,
    Checksum: result.checksum.toFixed(2),
  }));

  console.table(table);
}

function measureVariant(variant, context, iterations) {
  // Warm up once.
  variant.run(context);

  const start = performance.now();
  let checksum = 0;
  for (let i = 0; i < iterations; i += 1) {
    const value = variant.run(context);
    checksum += normaliseResult(value);
  }
  const totalMs = performance.now() - start;
  const avgMs = totalMs / iterations;
  const opsPerSec = iterations / (totalMs / 1_000 || 1);

  return { name: variant.name, avgMs, opsPerSec, checksum };
}

function normaliseResult(value) {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return value.length;
  }
  if (Array.isArray(value)) {
    return value.length;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length;
  }
  return 0;
}

runBenchmarks();
