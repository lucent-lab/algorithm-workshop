import { describe, expect, it } from 'vitest';

import { computeForceDirectedLayout } from '../src/index.js';

describe('computeForceDirectedLayout', () => {
  it('positions connected nodes within the bounding box', () => {
    const nodes = [
      { id: 'a', x: 0, y: 0 },
      { id: 'b', x: 200, y: 0 },
      { id: 'c', x: 100, y: 200 },
      { id: 'd', x: 100, y: 100 },
    ];
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'a' },
      { source: 'a', target: 'd' },
      { source: 'b', target: 'd' },
      { source: 'c', target: 'd' },
    ];

    const result = computeForceDirectedLayout({
      nodes,
      edges,
      width: 300,
      height: 300,
      iterations: 150,
      repulsion: 400,
      attraction: 0.08,
      damping: 0.9,
      gravity: 0.05,
    });

    expect(result.nodes).toHaveLength(nodes.length);
    for (const node of result.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(300);
      expect(node.y).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeLessThanOrEqual(300);
    }

    const distances = extractEdgeLengths(result.nodes, edges);
    const avg = distances.reduce((sum, value) => sum + value, 0) / distances.length;
    expect(avg).toBeGreaterThan(20);
    expect(avg).toBeLessThan(500);

    const centerX = result.nodes.reduce((sum, node) => sum + node.x, 0) / result.nodes.length;
    const centerY = result.nodes.reduce((sum, node) => sum + node.y, 0) / result.nodes.length;
    expect(centerX).toBeGreaterThan(60);
    expect(centerX).toBeLessThan(240);
    expect(centerY).toBeGreaterThan(60);
    expect(centerY).toBeLessThan(240);
  });

  it('supports deterministic layouts when providing a random source', () => {
    const nodes = Array.from({ length: 4 }, (_, index) => ({ id: String.fromCharCode(97 + index) }));
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'd' },
      { source: 'd', target: 'a' },
    ];

    const random = createDeterministicRandom(0.42);
    const result = computeForceDirectedLayout({
      nodes,
      edges,
      width: 200,
      height: 200,
      iterations: 120,
      random,
      repulsion: 300,
      attraction: 0.07,
      damping: 0.92,
    });

    expect(result.nodes.map((node) => ({ id: node.id, x: round(node.x), y: round(node.y) }))).toEqual([
      { id: 'a', x: 0, y: 43.76 },
      { id: 'b', x: 29.93, y: 200 },
      { id: 'c', x: 200, y: 85 },
      { id: 'd', x: 118.96, y: 0 },
    ]);
  });

  it('respects fixed nodes during layout', () => {
    const result = computeForceDirectedLayout({
      nodes: [
        { id: 'a', x: 0, y: 0, fixed: true },
        { id: 'b', x: 100, y: 0 },
      ],
      edges: [{ source: 'a', target: 'b' }],
      width: 200,
      height: 200,
      iterations: 50,
    });

    const nodeA = result.nodes.find((node) => node.id === 'a');
    expect(nodeA).toBeDefined();
    expect(nodeA?.x).toBe(0);
    expect(nodeA?.y).toBe(0);
  });

  it('validates options', () => {
    expect(() =>
      computeForceDirectedLayout({
        nodes: [],
        edges: [],
      })
    ).toThrow('nodes must contain at least one entry.');

    expect(() =>
      computeForceDirectedLayout({
        nodes: [{ id: 'a' }],
        edges: [{ source: 'a', target: 'missing' }],
      })
    ).toThrow('Edge references unknown node: missing');
  });
});

function extractEdgeLengths(nodes: { id: string; x: number; y: number }[], edges: { source: string; target: string }[]) {
  const index = new Map(nodes.map((node, idx) => [node.id, idx] as const));
  return edges.map((edge) => {
    const a = nodes[index.get(edge.source)!];
    const b = nodes[index.get(edge.target)!];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  });
}

function createDeterministicRandom(seed: number): () => number {
  let state = seed % 1;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
