import { pointInPolygon } from '../geometry/pointInPolygon.js';
import type { Point } from '../types.js';

/**
 * Polygon used to describe navigation mesh walkable regions.
 */
export interface NavPolygon {
  id: string;
  vertices: ReadonlyArray<Point>;
}

/**
 * Connection between polygons, including the shared portal edge.
 */
export interface NavNeighbor {
  polygonId: string;
  portal: readonly [Point, Point];
  cost: number;
}

/**
 * Navigation mesh storing polygons, centroids, and adjacency information.
 */
export interface NavMesh {
  polygons: ReadonlyArray<NavPolygon>;
  neighbors: Record<string, NavNeighbor[]>;
  centroids: Record<string, Point>;
}

/**
 * Result produced by the navmesh pathfinder.
 */
export interface NavMeshPath {
  polygonPath: string[];
  waypoints: Point[];
  cost: number;
}

/**
 * Optional overrides for the navmesh pathfinder.
 */
export interface FindNavMeshPathOptions {
  heuristic?: (from: Point, to: Point) => number;
}

/**
 * Builds adjacency information for a set of convex polygons that comprise a navigation mesh.
 * Use for: irregular terrain navigation, point-and-click movement, patrol routing in 2D spaces.
 * Performance: O(p \* v \* log v) pre-processing where p = polygons, v = vertices per polygon.
 * Import: pathfinding/navMesh.ts
 */
export function buildNavMesh(polygons: readonly NavPolygon[]): NavMesh {
  if (polygons.length === 0) {
    throw new Error('NavMesh requires at least one polygon.');
  }

  const centroids: Record<string, Point> = {};
  const neighbors: Record<string, NavNeighbor[]> = {};
  const edgeMap = new Map<string, Array<{ polygonId: string; portal: [Point, Point] }>>();

  polygons.forEach((polygon: NavPolygon) => {
    if (!polygon.id) {
      throw new Error('Each polygon must have a unique id.');
    }
    if (polygon.vertices.length < 3) {
      throw new Error(`Polygon ${polygon.id} must include at least three vertices.`);
    }

    centroids[polygon.id] = computeCentroid(polygon.vertices);
    neighbors[polygon.id] = neighbors[polygon.id] ?? [];

    const { vertices } = polygon;
    for (let i = 0; i < vertices.length; i += 1) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length];
      if (!current || !next) {
        continue;
      }
      const key = makeEdgeKey(current, next);
      const list = edgeMap.get(key) ?? [];
      const portal: [Point, Point] = [current, next];
      list.push({ polygonId: polygon.id, portal });
      edgeMap.set(key, list);
    }
  });

  for (const [, entries] of edgeMap.entries()) {
    if (entries.length < 2) {
      continue;
    }
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const a = entries[i];
        const b = entries[j];
        if (!a || !b) {
          continue;
        }
        attachNeighbor(neighbors, centroids, a, b);
        attachNeighbor(neighbors, centroids, b, a);
      }
    }
  }

  return { polygons, neighbors, centroids };
}

/**
 * Runs A* over the navmesh to find a path between two points.
 * Use for: directing agents through irregular spaces, fusing flow fields with navmesh patrols.
 * Performance: O(e log v) where e = edges, v = polygons.
 * Import: pathfinding/navMesh.ts
 */
export function findNavMeshPath(
  mesh: NavMesh,
  start: Point,
  goal: Point,
  options: FindNavMeshPathOptions = {}
): NavMeshPath | null {
  const startPolygon = findContainingPolygon(mesh.polygons, start);
  const goalPolygon = findContainingPolygon(mesh.polygons, goal);

  if (!startPolygon || !goalPolygon) {
    return null;
  }

  const startId = startPolygon.id;
  const goalId = goalPolygon.id;

  if (startId === goalId) {
    const cost = distance(start, goal);
    return { polygonPath: [startId], waypoints: [start, goal], cost };
  }

  const startCentroid = mesh.centroids[startId];
  const goalCentroid = mesh.centroids[goalId];
  if (!startCentroid || !goalCentroid) {
    return null;
  }

  const heuristic = options.heuristic ?? defaultHeuristic();

  const openSet = new Set<string>([startId]);
  const cameFrom: Record<string, string | undefined> = {};
  const gScore: Record<string, number> = { [startId]: 0 };
  const fScore: Record<string, number> = {
    [startId]: heuristic(startCentroid, goalCentroid),
  };

  while (openSet.size > 0) {
    const current = findLowest(openSet, fScore);
    if (!current) {
      break;
    }

    if (current === goalId) {
      return buildPath(mesh, cameFrom, current, startId, start, goal);
    }

    openSet.delete(current);
    const currentNeighbors = mesh.neighbors[current] ?? [];
    for (const neighbor of currentNeighbors) {
      const currentCost = gScore[current];
      if (currentCost === undefined) {
        continue;
      }
      const tentative = currentCost + neighbor.cost;
      if (tentative < (gScore[neighbor.polygonId] ?? Number.POSITIVE_INFINITY)) {
        cameFrom[neighbor.polygonId] = current;
        gScore[neighbor.polygonId] = tentative;
        const neighborCentroid = mesh.centroids[neighbor.polygonId];
        if (!neighborCentroid) {
          continue;
        }
        fScore[neighbor.polygonId] = tentative + heuristic(neighborCentroid, goalCentroid);
        openSet.add(neighbor.polygonId);
      }
    }
  }

  return null;
}

function attachNeighbor(
  neighbors: Record<string, NavNeighbor[]>,
  centroids: Record<string, Point>,
  from: { polygonId: string; portal: [Point, Point] },
  to: { polygonId: string; portal: [Point, Point] }
): void {
  const fromNeighbors = neighbors[from.polygonId] ?? [];
  const fromCentroid = centroids[from.polygonId];
  const toCentroid = centroids[to.polygonId];
  if (!fromCentroid || !toCentroid) {
    return;
  }

  const cost = distance(fromCentroid, toCentroid);
  fromNeighbors.push({
    polygonId: to.polygonId,
    portal: [
      { ...from.portal[0] },
      { ...from.portal[1] },
    ],
    cost,
  });
  neighbors[from.polygonId] = fromNeighbors;
}

function defaultHeuristic() {
  return (from: Point, to: Point): number => distance(from, to);
}

function findLowest(openSet: Set<string>, scores: Record<string, number>): string | undefined {
  let best: string | undefined;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const node of openSet) {
    const value = scores[node] ?? Number.POSITIVE_INFINITY;
    if (value < bestScore) {
      bestScore = value;
      best = node;
    }
  }
  return best;
}

function buildPath(
  mesh: NavMesh,
  cameFrom: Record<string, string | undefined>,
  current: string,
  startId: string,
  start: Point,
  goal: Point
): NavMeshPath {
  const polygonPath = [current];
  while (current !== startId) {
    const parent = cameFrom[current];
    if (!parent) {
      break;
    }
    polygonPath.push(parent);
    current = parent;
  }
  polygonPath.reverse();

  const waypoints: Point[] = [{ ...start }];
  for (let i = 0; i < polygonPath.length - 1; i += 1) {
    const fromId = polygonPath[i];
    const toId = polygonPath[i + 1];
    if (!fromId || !toId) {
      continue;
    }
    const neighbor = mesh.neighbors[fromId]?.find((entry) => entry.polygonId === toId);
    if (!neighbor) {
      continue;
    }
    const [left, right] = neighbor.portal;
    const midpoint = {
      x: (left.x + right.x) / 2,
      y: (left.y + right.y) / 2,
    };
    const lastWaypoint = waypoints[waypoints.length - 1];
    if (!lastWaypoint || !pointsEqual(lastWaypoint, midpoint)) {
      waypoints.push(midpoint);
    }
  }

  const last = waypoints[waypoints.length - 1];
  if (!last || !pointsEqual(last, goal)) {
    waypoints.push({ ...goal });
  }

  let cost = 0;
  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (!a || !b) {
      continue;
    }
    cost += distance(a, b);
  }

  return {
    polygonPath,
    waypoints,
    cost,
  };
}

function computeCentroid(vertices: ReadonlyArray<Point>): Point {
  let twiceArea = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < vertices.length; i += 1) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    if (!current || !next) {
      continue;
    }
    const cross = current.x * next.y - next.x * current.y;
    twiceArea += cross;
    cx += (current.x + next.x) * cross;
    cy += (current.y + next.y) * cross;
  }

  if (Math.abs(twiceArea) < Number.EPSILON) {
    const average = vertices.reduce(
      (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
      { x: 0, y: 0 }
    );
    return {
      x: average.x / vertices.length,
      y: average.y / vertices.length,
    };
  }

  const factor = 1 / (3 * twiceArea);
  return {
    x: cx * factor,
    y: cy * factor,
  };
}

function makeEdgeKey(a: Point, b: Point): string {
  const keyA = `${a.x}:${a.y}`;
  const keyB = `${b.x}:${b.y}`;
  return keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
}

function findContainingPolygon(polygons: ReadonlyArray<NavPolygon>, point: Point): NavPolygon | null {
  for (const polygon of polygons) {
    if (pointInPolygon(point, polygon.vertices)) {
      return polygon;
    }
  }
  return null;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointsEqual(a: Point, b: Point): boolean {
  const epsilon = 1e-6;
  return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;
}
