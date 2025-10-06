import type { Graph } from '../types.js';

/**
 * Breadth-first search over graph adjacency list.
 * Useful for: shortest path discovery in unweighted graphs, level order traversal, connectivity analysis.
 */
export function graphBFS(graph: Graph, start: string): Map<string, number> {
  if (!(start in graph)) {
    throw new Error('Start node must exist in graph');
  }
  const distances = new Map<string, number>([[start, 0]]);
  const queue: string[] = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const distance = distances.get(node)!;
    for (const { node: neighbor } of graph[node] ?? []) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, distance + 1);
        queue.push(neighbor);
      }
    }
  }

  return distances;
}

/**
 * Depth-first traversal invoking callback per node.
 * Useful for: connectivity analysis, cycle detection when combined with state, exploring graphs.
 */
export function graphDFS(graph: Graph, start: string, callback: (node: string) => void): void {
  if (!(start in graph)) {
    throw new Error('Start node must exist in graph');
  }
  const visited = new Set<string>();

  function dfs(node: string): void {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    callback(node);
    for (const { node: neighbor } of graph[node] ?? []) {
      dfs(neighbor);
    }
  }

  dfs(start);
}

/**
 * Topological sort for directed acyclic graphs.
 * Useful for: dependency resolution, build systems, course scheduling.
 */
export function topologicalSort(graph: Graph): string[] {
  const visited = new Set<string>();
  const temp = new Set<string>();
  const result: string[] = [];

  function visit(node: string): void {
    if (temp.has(node)) {
      throw new Error('Graph contains a cycle; topological sort unavailable.');
    }
    if (!visited.has(node)) {
      temp.add(node);
      for (const { node: neighbor } of graph[node] ?? []) {
        if (!(neighbor in graph)) {
          graph[neighbor] = [];
        }
        visit(neighbor);
      }
      temp.delete(node);
      visited.add(node);
      result.push(node);
    }
  }

  for (const node of Object.keys(graph)) {
    visit(node);
  }

  return result.reverse();
}
