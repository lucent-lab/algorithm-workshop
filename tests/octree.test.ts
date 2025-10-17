import { describe, expect, it } from 'vitest';

import { Octree } from '../src/spatial/octree.js';

describe('Octree', () => {
  it('stores and queries points within a bounding box', () => {
    const octree = new Octree<{ id: string }>(
      { x: 0, y: 0, z: 0, width: 32, height: 32, depth: 32 },
      2
    );

    octree.insert({ x: 4, y: 4, z: 4 }, { id: 'a' });
    octree.insert({ x: 8, y: 8, z: 8 }, { id: 'b' });
    octree.insert({ x: 20, y: 20, z: 20 }, { id: 'c' });

    const results = octree.query({ x: 0, y: 0, z: 0, width: 12, height: 12, depth: 12 });
    expect(results.map((point) => point.data?.id).sort()).toEqual(['a', 'b']);

    expect(octree.insert({ x: 40, y: 40, z: 40 }, { id: 'outside' })).toBe(false);
  });

  it('subdivides when at capacity and maintains stored payloads', () => {
    const octree = new Octree<{ id: number }>(
      { x: 0, y: 0, z: 0, width: 16, height: 16, depth: 16 },
      1,
      0,
      4
    );

    octree.insert({ x: 1, y: 1, z: 1 }, { id: 1 });
    octree.insert({ x: 9, y: 1, z: 1 }, { id: 2 });
    octree.insert({ x: 1, y: 9, z: 9 }, { id: 3 });
    octree.insert({ x: 9, y: 9, z: 9 }, { id: 4 });

    const results = octree.query({ x: 0, y: 0, z: 0, width: 16, height: 16, depth: 16 });
    expect(results).toHaveLength(4);
    expect(results.map((point) => point.data?.id).sort()).toEqual([1, 2, 3, 4]);
  });

  it('supports spherical queries for proximity checks', () => {
    const octree = new Octree(
      { x: 0, y: 0, z: 0, width: 50, height: 50, depth: 50 },
      4
    );

    octree.insert({ x: 5, y: 5, z: 5 });
    octree.insert({ x: 7, y: 4, z: 4 });
    octree.insert({ x: 20, y: 20, z: 20 });

    const results = octree.querySphere({ x: 4, y: 4, z: 4 }, 4);
    expect(results.length).toBe(2);
  });

  it('validates inputs', () => {
    expect(
      () =>
        new Octree({ x: 0, y: 0, z: 0, width: -1, height: 1, depth: 1 })
    ).toThrow('Box width, height, and depth must be non-negative.');

    const octree = new Octree({ x: 0, y: 0, z: 0, width: 10, height: 10, depth: 10 });
    expect(() => octree.insert({ x: 1, y: 1, z: Number.NaN })).toThrow(TypeError);
    expect(() =>
      octree.query({ x: 0, y: 0, z: 0, width: Number.NaN, height: 1, depth: 1 })
    ).toThrow(TypeError);
    expect(() => octree.querySphere({ x: 0, y: 0, z: 0 }, -1)).toThrow(
      'radius must be a non-negative number.'
    );
  });
});
