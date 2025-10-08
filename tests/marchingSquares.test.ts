import { describe, expect, it } from 'vitest';

import { computeMarchingSquares } from '../src/index.js';

describe('computeMarchingSquares', () => {
  it('extracts contour segments around a single peak', () => {
    const field = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];

    const { segments } = computeMarchingSquares({ field, threshold: 0.5 });
    expect(segments).toHaveLength(4);

    const points = segments.flatMap((segment) => [segment.start, segment.end]);
    for (const point of points) {
      expect(point.x).toBeGreaterThan(0);
      expect(point.x).toBeLessThan(2);
      expect(point.y).toBeGreaterThan(0);
      expect(point.y).toBeLessThan(2);
    }
  });

  it('scales coordinates using cellSize', () => {
    const field = [
      [0, 0],
      [0, 1],
      [0, 0],
    ];

    const { segments } = computeMarchingSquares({ field: { data: field, cellSize: 2 }, threshold: 0.5 });
    expect(segments).toHaveLength(2);
    for (const { start, end } of segments) {
      for (const point of [start, end]) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(2);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(4);
      }
    }
  });

  it('handles ambiguous cases by emitting separate segments', () => {
    const field = [
      [1, 0],
      [0, 1],
      [1, 0],
    ];

    const { segments } = computeMarchingSquares({ field, threshold: 0.5 });
    expect(segments.length).toBeGreaterThanOrEqual(2);
  });

  it('validates grid dimensions and rectangular shape', () => {
    expect(() => computeMarchingSquares({ field: [[0]], threshold: 0 })).toThrow('field must contain at least two rows.');
    expect(() => computeMarchingSquares({ field: [[0, 0], [1]], threshold: 0 })).toThrow(
      'field rows must all have the same length.'
    );
  });
});
