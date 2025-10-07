import { describe, expect, it } from 'vitest';

import { buildNavMesh, findNavMeshPath } from '../src/index.js';

const meshPolygons = [
  {
    id: 'roomA',
    vertices: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
  },
  {
    id: 'corridor',
    vertices: [
      { x: 2, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 2 },
      { x: 2, y: 2 },
    ],
  },
  {
    id: 'roomB',
    vertices: [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: 2 },
      { x: 4, y: 2 },
    ],
  },
];

describe('navmesh pathfinding', () => {
  it('creates adjacency between polygons and finds a path', () => {
    const navMesh = buildNavMesh(meshPolygons);
    const result = findNavMeshPath(navMesh, { x: 0.5, y: 1 }, { x: 5.5, y: 1 });

    expect(result).not.toBeNull();
    expect(result?.polygonPath).toEqual(['roomA', 'corridor', 'roomB']);
    expect(result?.waypoints.at(0)).toEqual({ x: 0.5, y: 1 });
    expect(result?.waypoints.at(-1)).toEqual({ x: 5.5, y: 1 });
    expect(result?.waypoints.length).toBeGreaterThanOrEqual(3);
    expect(result?.cost).toBeGreaterThan(0);
  });

  it('returns direct link when start and goal are in the same polygon', () => {
    const navMesh = buildNavMesh(meshPolygons);
    const result = findNavMeshPath(navMesh, { x: 0.5, y: 0.5 }, { x: 1.5, y: 1.5 });

    expect(result).not.toBeNull();
    expect(result?.polygonPath).toEqual(['roomA']);
    expect(result?.waypoints).toEqual([
      { x: 0.5, y: 0.5 },
      { x: 1.5, y: 1.5 },
    ]);
  });

  it('returns null when no polygon contains the goal', () => {
    const navMesh = buildNavMesh(meshPolygons);
    const result = findNavMeshPath(navMesh, { x: 0.5, y: 0.5 }, { x: 8, y: 8 });

    expect(result).toBeNull();
  });

  it('returns null when goal polygon is unreachable', () => {
    const navMesh = buildNavMesh([
      ...meshPolygons,
      {
        id: 'isolated',
        vertices: [
          { x: 10, y: 10 },
          { x: 12, y: 10 },
          { x: 12, y: 12 },
          { x: 10, y: 12 },
        ],
      },
    ]);

    const result = findNavMeshPath(navMesh, { x: 0.5, y: 0.5 }, { x: 10.5, y: 10.5 });
    expect(result).toBeNull();
  });
});
