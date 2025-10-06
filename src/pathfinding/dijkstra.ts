import type { Graph } from '../types.js';

export interface DijkstraOptions {
  graph: Graph;
  start: string;
  goal: string;
}

export interface DijkstraResult {
  path: string[];
  cost: number;
}

/**
 * Dijkstra's algorithm for weighted graphs without heuristics.
 * Useful for: routing with varying edge weights, guaranteed shortest path, network latency planning.
 */
export function dijkstra({ graph, start, goal }: DijkstraOptions): DijkstraResult | null {
  if (!graph || typeof graph !== 'object') {
    throw new TypeError('graph must be an adjacency list object.');
  }
  if (!(start in graph) || !(goal in graph)) {
    throw new Error('start and goal nodes must exist in the graph.');
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const visited = new Set<string>();
  const queue = new Map<string, number>();

  for (const node of Object.keys(graph)) {
    const distance = node === start ? 0 : Infinity;
    distances.set(node, distance);
    queue.set(node, distance);
  }

  while (queue.size > 0) {
    const [node, distance] = [...queue.entries()].sort((a, b) => a[1] - b[1])[0];
    queue.delete(node);

    if (distance === Infinity) {
      break;
    }
    if (node === goal) {
      break;
    }
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);

    const neighbors = graph[node] ?? [];
    for (const { node: neighbor, weight = 1 } of neighbors) {
      if (!(neighbor in graph)) {
        continue;
      }
      const alt = distance + weight;
      if (alt < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, alt);
        previous.set(neighbor, node);
        queue.set(neighbor, alt);
      }
    }
  }

  if (!previous.has(goal) && start !== goal) {
    return null;
  }

  const path = rebuildPath(previous, start, goal);
  const cost = distances.get(goal) ?? Infinity;
  if (path.length === 0 && start !== goal) {
    return null;
  }
  return { path, cost };
}

function rebuildPath(previous: Map<string, string>, start: string, goal: string): string[] {
  const path = [goal];
  let current = goal;
  while (current !== start) {
    const next = previous.get(current);
    if (next === undefined) {
      return [];
    }
    path.unshift(next);
    current = next;
  }
  return path;
}

export const __internals = { rebuildPath };
