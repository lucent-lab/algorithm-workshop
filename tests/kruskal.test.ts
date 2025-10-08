import { describe, expect, it } from 'vitest';

import { computeMinimumSpanningTree } from '../src/index.js';

describe('computeMinimumSpanningTree', () => {
  it('builds minimum spanning tree for connected graph', () => {
    const nodes = ['A', 'B', 'C', 'D'];
    const edges = [
      { source: 'A', target: 'B', weight: 1 },
      { source: 'A', target: 'C', weight: 5 },
      { source: 'B', target: 'C', weight: 2 },
      { source: 'B', target: 'D', weight: 4 },
      { source: 'C', target: 'D', weight: 3 },
    ];

    const result = computeMinimumSpanningTree({ nodes, edges });
    expect(result.edges).toHaveLength(nodes.length - 1);
    expect(result.totalWeight).toBe(1 + 2 + 3);

    const mstEdges = result.edges.map((edge) => [edge.source, edge.target].sort().join('-'));
    expect(mstEdges).toEqual(['A-B', 'B-C', 'C-D']);
  });

  it('ignores heavier edges that form cycles', () => {
    const nodes = ['X', 'Y', 'Z'];
    const edges = [
      { source: 'X', target: 'Y', weight: 10 },
      { source: 'Y', target: 'Z', weight: 2 },
      { source: 'X', target: 'Z', weight: 1 },
    ];

    const result = computeMinimumSpanningTree({ nodes, edges });
    expect(result.totalWeight).toBe(3);
    const sorted = result.edges.map((edge) => [edge.source, edge.target].sort().join('-')).sort();
    expect(sorted).toEqual(['X-Z', 'Y-Z']);
  });

  it('validates inputs', () => {
    expect(() => computeMinimumSpanningTree({ nodes: [], edges: [] })).toThrow('nodes must contain at least one node.');
    expect(() =>
      computeMinimumSpanningTree({
        nodes: ['A'],
        edges: [{ source: 'A', target: 'B', weight: 1 }],
      })
    ).toThrow('Edge references unknown node');
  });
});
