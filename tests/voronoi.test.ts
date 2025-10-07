import { describe, expect, it } from 'vitest';

import { computeVoronoiDiagram } from '../src/index.js';

describe('computeVoronoiDiagram', () => {
  it('splits space between two sites along the perpendicular bisector', () => {
    const result = computeVoronoiDiagram(
      [
        { id: 'left', x: 0, y: 0 },
        { id: 'right', x: 10, y: 0 },
      ],
      {
        boundingBox: { minX: -10, maxX: 10, minY: -5, maxY: 5 },
      }
    );

    const leftCell = result.find((cell) => cell.site.id === 'left');
    const rightCell = result.find((cell) => cell.site.id === 'right');

    expect(leftCell).toBeDefined();
    expect(rightCell).toBeDefined();

    // Boundary should lie at x = 5 (midpoint between sites)
    expect(Math.max(...(leftCell?.polygon.map((point) => point.x) ?? []))).toBeLessThanOrEqual(5.001);
    expect(Math.min(...(rightCell?.polygon.map((point) => point.x) ?? []))).toBeGreaterThanOrEqual(4.999);
  });

  it('produces bounded polygons for three non-collinear points', () => {
    const cells = computeVoronoiDiagram(
      [
        { id: 'a', x: 0, y: 0 },
        { id: 'b', x: 6, y: 0 },
        { id: 'c', x: 3, y: 5 },
      ],
      {
        boundingBox: { minX: -2, maxX: 8, minY: -2, maxY: 7 },
      }
    );

    expect(cells).toHaveLength(3);
    for (const cell of cells) {
      expect(cell.polygon.length).toBeGreaterThanOrEqual(3);
      expect(cell.polygon.every((point) => point.x >= -2 && point.x <= 8)).toBe(true);
      expect(cell.polygon.every((point) => point.y >= -2 && point.y <= 7)).toBe(true);
    }
  });
});
