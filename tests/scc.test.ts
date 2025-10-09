import { describe, expect, it } from 'vitest';

import { buildCondensationGraph, computeStronglyConnectedComponents } from '../src/index.js';

describe('strongly connected components', () => {
  it('finds SCCs in a directed graph and builds condensation DAG', () => {
    const graph = {
      A: [{ node: 'B' }],
      B: [{ node: 'C' }, { node: 'E' }],
      C: [{ node: 'A' }, { node: 'D' }],
      D: [{ node: 'E' }],
      E: [{ node: 'F' }],
      F: [{ node: 'D' }],
    };

    const { components } = computeStronglyConnectedComponents(graph);
    // Expect two cyclic components: {A,B,C} and {D,E,F}
    const sorted = components.map((c) => c.sort()).sort((a, b) => a[0].localeCompare(b[0]));
    expect(sorted).toEqual([
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
    ]);

    const dag = buildCondensationGraph(graph, components);
    // There should be one edge from comp(ABC) -> comp(DEF)
    const edgesOutOf0 = dag['0']?.map((e) => e.node) ?? [];
    const edgesOutOf1 = dag['1']?.map((e) => e.node) ?? [];
    const totalEdges = edgesOutOf0.length + edgesOutOf1.length;
    expect(totalEdges).toBe(1);
  });
});

