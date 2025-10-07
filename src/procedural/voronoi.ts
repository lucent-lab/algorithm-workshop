import type { Point } from '../types.js';

export interface VoronoiSite extends Point {
  id?: string;
}

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface VoronoiOptions {
  boundingBox?: BoundingBox;
  padding?: number;
}

export interface VoronoiCell {
  site: VoronoiSite;
  polygon: Point[];
}

const EPSILON = 1e-9;

/**
 * Computes a 2D Voronoi diagram for the supplied sites using half-plane intersection.
 * Useful for: territory partitioning, procedural biome assignment, spatial clustering.
 * Performance: O(n^2 m) where m is number of polygon vertices retained during clipping.
 */
export function computeVoronoiDiagram(
  sites: ReadonlyArray<VoronoiSite>,
  options: VoronoiOptions = {}
): VoronoiCell[] {
  if (sites.length === 0) {
    return [];
  }

  const boundingBox = resolveBoundingBox(sites, options.boundingBox, options.padding ?? 0.1);
  const initialPolygon: Point[] = [
    { x: boundingBox.minX, y: boundingBox.minY },
    { x: boundingBox.maxX, y: boundingBox.minY },
    { x: boundingBox.maxX, y: boundingBox.maxY },
    { x: boundingBox.minX, y: boundingBox.maxY },
  ];

  const cells: VoronoiCell[] = [];
  for (const site of sites) {
    let polygon = initialPolygon.slice();
    for (const other of sites) {
      if (other === site) {
        continue;
      }
      polygon = clipPolygonWithBisector(polygon, site, other);
      if (polygon.length === 0) {
        break;
      }
    }
    cells.push({ site, polygon });
  }

  return cells;
}

function resolveBoundingBox(
  sites: ReadonlyArray<VoronoiSite>,
  explicit?: BoundingBox,
  paddingRatio: number = 0
): BoundingBox {
  if (explicit) {
    return explicit;
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const { x, y } of sites) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const width = maxX - minX;
  const height = maxY - minY;
  const paddingX = width * paddingRatio || 1;
  const paddingY = height * paddingRatio || 1;
  return {
    minX: minX - paddingX,
    maxX: maxX + paddingX,
    minY: minY - paddingY,
    maxY: maxY + paddingY,
  };
}

function clipPolygonWithBisector(polygon: Point[], site: Point, other: Point): Point[] {
  if (polygon.length === 0) {
    return polygon;
  }

  const a = other.x - site.x;
  const b = other.y - site.y;
  const c = (other.x * other.x + other.y * other.y - site.x * site.x - site.y * site.y) / 2;

  const output: Point[] = [];
  const lastVertex = polygon[polygon.length - 1];
  if (!lastVertex) {
    return [];
  }
  let prev = lastVertex;
  let prevInside = isInside(prev, a, b, c);

  for (const current of polygon) {
    const currentInside = isInside(current, a, b, c);
    if (currentInside) {
      if (!prevInside) {
        const intersection = computeIntersection(prev, current, a, b, c);
        if (intersection) {
          output.push(intersection);
        }
      }
      output.push(current);
    } else if (prevInside) {
      const intersection = computeIntersection(prev, current, a, b, c);
      if (intersection) {
        output.push(intersection);
      }
    }
    prev = current;
    prevInside = currentInside;
  }

  return deduplicateVertices(output);
}

function isInside(point: Point, a: number, b: number, c: number): boolean {
  return a * point.x + b * point.y <= c + EPSILON;
}

function computeIntersection(prev: Point, current: Point, a: number, b: number, c: number): Point | null {
  const dx = current.x - prev.x;
  const dy = current.y - prev.y;
  const denominator = a * dx + b * dy;
  if (Math.abs(denominator) < EPSILON) {
    return null;
  }
  const t = (c - a * prev.x - b * prev.y) / denominator;
  if (t < -EPSILON || t > 1 + EPSILON) {
    return null;
  }
  return {
    x: prev.x + t * dx,
    y: prev.y + t * dy,
  };
}

function deduplicateVertices(vertices: Point[]): Point[] {
  if (vertices.length <= 1) {
    return vertices;
  }
  const result: Point[] = [];
  for (const vertex of vertices) {
    const last = result[result.length - 1];
    if (!last || !pointsEqual(last, vertex)) {
      result.push(vertex);
    }
  }
  if (result.length > 1) {
    const first = result[0];
    const last = result[result.length - 1];
    if (first && last && pointsEqual(first, last)) {
      result.pop();
    }
  }
  return result;
}

function pointsEqual(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) < EPSILON && Math.abs(a.y - b.y) < EPSILON;
}
