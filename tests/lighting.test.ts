import { describe, expect, it } from 'vitest';

import { computeLightingGrid } from '../src/index.js';

describe('computeLightingGrid', () => {
  it('applies falloff and ambient light', () => {
    const result = computeLightingGrid({
      width: 3,
      height: 3,
      tileSize: 1,
      ambient: 0.1,
      lights: [
        { x: 1.5, y: 1.5, radius: 2, intensity: 1, falloff: 'linear', color: [1, 0.8, 0.6] },
      ],
    });

    expect(result.cells).toHaveLength(9);
    const center = result.cells[4];
    expect(center.light).toBeGreaterThan(0.9);
    const corner = result.cells[0];
    expect(corner.light).toBeGreaterThan(0.1);
    expect(corner.light).toBeLessThan(center.light);
  });

  it('respects obstacles', () => {
    const result = computeLightingGrid({
      width: 3,
      height: 3,
      tileSize: 1,
      ambient: 0,
      lights: [{ x: 0.5, y: 0.5, radius: 3 }],
      obstacles: (x, y) => x === 1 && y === 0,
    });

    const blocked = result.cells[1];
    expect(blocked.light).toBe(0);
    const next = result.cells[2];
    expect(next.light).toBeGreaterThan(0);
  });
});
