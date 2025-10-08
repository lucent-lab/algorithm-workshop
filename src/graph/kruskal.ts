export interface WeightedEdge {
  source: string;
  target: string;
  weight: number;
}

export interface KruskalOptions {
  nodes: ReadonlyArray<string>;
  edges: ReadonlyArray<WeightedEdge>;
}

export interface MinimumSpanningTree {
  edges: WeightedEdge[];
  totalWeight: number;
}

export function computeMinimumSpanningTree(options: KruskalOptions): MinimumSpanningTree {
  validateOptions(options);
  const disjointSet = new DisjointSet(options.nodes);
  const edges = [...options.edges].sort((a, b) => a.weight - b.weight);
  const result: WeightedEdge[] = [];
  let totalWeight = 0;

  for (const edge of edges) {
    if (disjointSet.union(edge.source, edge.target)) {
      result.push(edge);
      totalWeight += edge.weight;
    }
  }

  return { edges: result, totalWeight };
}

class DisjointSet {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();

  constructor(nodes: ReadonlyArray<string>) {
    for (const node of nodes) {
      this.parent.set(node, node);
      this.rank.set(node, 0);
    }
  }

  find(node: string): string {
    const parent = this.parent.get(node);
    if (parent === undefined) {
      throw new Error(`Unknown node: ${node}`);
    }
    if (parent !== node) {
      const root = this.find(parent);
      this.parent.set(node, root);
      return root;
    }
    return parent;
  }

  union(a: string, b: string): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) {
      return false;
    }

    const rankA = this.rank.get(rootA) ?? 0;
    const rankB = this.rank.get(rootB) ?? 0;
    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
    return true;
  }
}

function validateOptions(options: KruskalOptions): void {
  if (!Array.isArray(options.nodes) || options.nodes.length === 0) {
    throw new Error('nodes must contain at least one node.');
  }
  if (!Array.isArray(options.edges)) {
    throw new Error('edges must be an array.');
  }
  const seenNodes = new Set(options.nodes);
  const edges: ReadonlyArray<WeightedEdge> = options.edges;
  for (const edge of edges) {
    const { source, target, weight } = edge;
    if (!seenNodes.has(source) || !seenNodes.has(target)) {
      throw new Error(`Edge references unknown node: ${source}-${target}`);
    }
    if (!Number.isFinite(weight)) {
      throw new Error('Edge weights must be finite numbers.');
    }
  }
}
