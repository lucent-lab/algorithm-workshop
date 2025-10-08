import { describe, expect, it } from 'vitest';

import { computeMarchingCubes } from '../src/index.js';
import type { MarchingCubesResult } from '../src/index.js';

describe('computeMarchingCubes', () => {
  it('extracts triangles around a spherical scalar field', () => {
    const size = 4;
    const field: number[][][] = [];
    const radius = 1.5;
    for (let z = 0; z < size; z += 1) {
      const slice: number[][] = [];
      for (let y = 0; y < size; y += 1) {
        const row: number[] = [];
        for (let x = 0; x < size; x += 1) {
          const dx = x - (size - 1) / 2;
          const dy = y - (size - 1) / 2;
          const dz = z - (size - 1) / 2;
          row.push(radius - Math.sqrt(dx * dx + dy * dy + dz * dz));
        }
        slice.push(row);
      }
      field.push(slice);
    }

    const result: MarchingCubesResult = computeMarchingCubes({ field, threshold: 0 });
    expect(result.triangles.length).toBeGreaterThan(0);

    for (const triangle of result.triangles) {
      for (const vertex of [triangle.a, triangle.b, triangle.c]) {
        expect(vertex.x).toBeGreaterThanOrEqual(0);
        expect(vertex.y).toBeGreaterThanOrEqual(0);
        expect(vertex.z).toBeGreaterThanOrEqual(0);
        expect(vertex.x).toBeLessThanOrEqual(size - 1);
        expect(vertex.y).toBeLessThanOrEqual(size - 1);
        expect(vertex.z).toBeLessThanOrEqual(size - 1);
      }
    }
  });

  it('supports non-uniform cell sizes', () => {
    const field = [
      [
        [0, 1],
        [0, 1],
      ],
      [
        [1, 0],
        [1, 0],
      ],
    ];

    const result: MarchingCubesResult = computeMarchingCubes({
      field: { data: field, cellSize: { x: 2, y: 3, z: 4 } },
      threshold: 0.5,
    });

    const maxX = (field[0][0].length - 1) * 2;
    const maxY = (field[0].length - 1) * 3;
    const maxZ = (field.length - 1) * 4;
    for (const triangle of result.triangles) {
      for (const vertex of [triangle.a, triangle.b, triangle.c]) {
        expect(vertex.x).toBeGreaterThanOrEqual(0);
        expect(vertex.x).toBeLessThanOrEqual(maxX);
        expect(vertex.y).toBeGreaterThanOrEqual(0);
        expect(vertex.y).toBeLessThanOrEqual(maxY);
        expect(vertex.z).toBeGreaterThanOrEqual(0);
        expect(vertex.z).toBeLessThanOrEqual(maxZ);
      }
    }
  });

  it('validates field dimensions and shape', () => {
    expect(() => computeMarchingCubes({ field: [[[1]]] })).toThrow('field must contain at least two slices.');
    expect(() =>
      computeMarchingCubes({
        field: {
          data: [
            [
              [0, 0],
              [0, 0],
            ],
            [[0]],
          ],
        },
      })
    ).toThrow('field slices must share the same row count.');
  });
});
