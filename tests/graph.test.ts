import { describe, expect, it } from 'vitest';
import { graphBFS, graphDFS, topologicalSort } from '../src/graph/traversal.js';

describe('graphBFS', () => {
  const graph = {
    A: [
      { node: 'B' },
      { node: 'C' },
    ],
    B: [{ node: 'D' }],
    C: [{ node: 'D' }],
    D: [],
  };

  it('computes distances from start node', () => {
    const distances = graphBFS(graph, 'A');
    expect(Array.from(distances.entries())).toEqual([
      ['A', 0],
      ['B', 1],
      ['C', 1],
      ['D', 2],
    ]);
  });

  it('throws when start node missing', () => {
    expect(() => graphBFS(graph, 'Z')).toThrow('Start node must exist in graph');
  });
});

describe('graphDFS', () => {
  it('visits nodes depth-first without repeats', () => {
    const graph = {
      A: [{ node: 'B' }, { node: 'C' }],
      B: [{ node: 'D' }],
      C: [],
      D: [],
    };
    const visited: string[] = [];
    graphDFS(graph, 'A', (node) => visited.push(node));
    expect(visited).toEqual(['A', 'B', 'D', 'C']);
  });
});

describe('topologicalSort', () => {
  it('produces a valid ordering for DAGs', () => {
    const graph = {
      cook: [{ node: 'eat' }],
      shop: [{ node: 'cook' }],
      eat: [],
    };
    expect(topologicalSort(graph)).toEqual(['shop', 'cook', 'eat']);
  });

  it('throws on cycles', () => {
    const graph = {
      A: [{ node: 'B' }],
      B: [{ node: 'A' }],
    };
    expect(() => topologicalSort(graph)).toThrow('Graph contains a cycle');
  });
});
