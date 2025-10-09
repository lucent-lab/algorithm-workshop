import { describe, expect, it } from 'vitest';

import { computeMaximumFlowDinic } from '../src/index.js';

describe('computeMaximumFlowDinic', () => {
  it('computes max flow on a small graph', () => {
    const nodes = ['S', 'A', 'B', 'T'];
    const edges = [
      { source: 'S', target: 'A', capacity: 10 },
      { source: 'S', target: 'B', capacity: 5 },
      { source: 'A', target: 'B', capacity: 15 },
      { source: 'A', target: 'T', capacity: 10 },
      { source: 'B', target: 'T', capacity: 10 },
    ];

    const result = computeMaximumFlowDinic({ nodes, edges, source: 'S', sink: 'T' });
    expect(result.maxFlow).toBe(15);
    const outOfS = result.flows
      .filter((e) => e.source === 'S')
      .reduce((sum, e) => sum + e.flow, 0);
    expect(outOfS).toBe(result.maxFlow);
  });

  it('validates inputs', () => {
    expect(() =>
      computeMaximumFlowDinic({ nodes: [], edges: [], source: 'S', sink: 'T' })
    ).toThrow('nodes must contain at least one node.');
    expect(() =>
      computeMaximumFlowDinic({ nodes: ['S'], edges: [], source: 'S', sink: 'T' })
    ).toThrow('source and sink must be present in nodes.');
  });
});

