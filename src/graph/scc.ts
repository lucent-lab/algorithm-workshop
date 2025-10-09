import type { Graph } from '../types.js';

export interface SCCResult {
  components: string[][];
}

/**
 * Computes strongly connected components using Tarjan's algorithm.
 * Use for: condensation graphs, cycle detection, program analysis.
 */
export function computeStronglyConnectedComponents(graph: Graph): SCCResult {
  const indexByNode = new Map<string, number>();
  const lowlinkByNode = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const components: string[][] = [];
  let index = 0;

  function strongConnect(v: string): void {
    indexByNode.set(v, index);
    lowlinkByNode.set(v, index);
    index += 1;
    stack.push(v);
    onStack.add(v);

    const edges = graph[v] ?? [];
    for (const { node: w } of edges) {
      if (!indexByNode.has(w)) {
        strongConnect(w);
        lowlinkByNode.set(v, Math.min(lowlinkByNode.get(v)!, lowlinkByNode.get(w)!));
      } else if (onStack.has(w)) {
        lowlinkByNode.set(v, Math.min(lowlinkByNode.get(v)!, indexByNode.get(w)!));
      }
    }

    if (lowlinkByNode.get(v) === indexByNode.get(v)) {
      const component: string[] = [];
      // Pop nodes until we close the current component
      // Using an explicit loop with break to avoid recursion overhead.
      for (;;) {
        const w = stack.pop();
        if (w === undefined) {
          break;
        }
        onStack.delete(w);
        component.push(w);
        if (w === v) {
          break;
        }
      }
      components.push(component);
    }
  }

  for (const v of Object.keys(graph)) {
    if (!indexByNode.has(v)) {
      strongConnect(v);
    }
  }

  return { components };
}

/**
 * Builds a condensation DAG from SCC components.
 * Nodes become component indices, edges preserved between components.
 */
export function buildCondensationGraph(graph: Graph, components: string[][]): Graph {
  const compIndex = new Map<string, number>();
  components.forEach((comp, idx) => {
    for (const node of comp) compIndex.set(node, idx);
  });
  const dag: Graph = {};
  for (let i = 0; i < components.length; i += 1) {
    dag[String(i)] = [];
  }
  for (const [v, edges] of Object.entries(graph)) {
    const from = compIndex.get(v)!;
    for (const { node: w } of edges ?? []) {
      const to = compIndex.get(w)!;
      if (from !== to) {
        const list = dag[String(from)];
        if (!list.some((e) => e.node === String(to))) {
          list.push({ node: String(to) });
        }
      }
    }
  }
  return dag;
}
