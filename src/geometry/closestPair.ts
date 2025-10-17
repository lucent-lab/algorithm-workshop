import type { Point } from '../types.js';

export interface ClosestPairResult {
  distance: number;
  pair: [Point, Point] | null;
}

/**
 * Computes the closest pair of points in O(n log n) using a divide-and-conquer strategy.
 * Returns the distance between the closest points along with the pair itself.
 */
export function closestPair(points: ReadonlyArray<Point>): ClosestPairResult {
  if (!Array.isArray(points) || points.length < 2) {
    return { distance: Number.POSITIVE_INFINITY, pair: null };
  }

  const normalized: Array<Point> = points.map((point: Point) => {
    if (
      typeof point?.x !== 'number' ||
      typeof point?.y !== 'number' ||
      Number.isNaN(point.x) ||
      Number.isNaN(point.y)
    ) {
      throw new TypeError('points must contain numeric x and y values.');
    }
    return { x: point.x, y: point.y };
  });

  normalized.sort((a, b) => (a.x - b.x) || (a.y - b.y));
  const scratch: Array<Point> = normalized.map((point) => ({ ...point }));

  const result = divideAndConquer(normalized, scratch, 0, normalized.length);
  return { distance: result.distance, pair: result.pair };
}

interface DivideResult {
  distance: number;
  pair: [Point, Point] | null;
}

function divideAndConquer(
  points: Array<Point>,
  scratch: Array<Point>,
  start: number,
  end: number
): DivideResult {
  const count = end - start;
  if (count <= 1) {
    return { distance: Number.POSITIVE_INFINITY, pair: null };
  }

  if (count <= 3) {
    let bestDistance = Number.POSITIVE_INFINITY;
    let bestPair: [Point, Point] | null = null;
    for (let i = start; i < end; i += 1) {
      const pointI = points[i];
      if (!pointI) continue;
      for (let j = i + 1; j < end; j += 1) {
        const pointJ = points[j];
        if (!pointJ) continue;
        const distance = euclidean(pointI, pointJ);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPair = [pointI, pointJ];
        }
      }
    }
    const sorted = points.slice(start, end).sort((a, b) => (a.y - b.y) || (a.x - b.x));
    for (let i = 0; i < sorted.length; i += 1) {
      points[start + i] = sorted[i]!;
    }
    return { distance: bestDistance, pair: bestPair };
  }

  const mid = start + Math.floor(count / 2);
  const midPoint = points[mid];
  if (!midPoint) {
    return { distance: Number.POSITIVE_INFINITY, pair: null };
  }
  const midX = midPoint.x;

  const left = divideAndConquer(points, scratch, start, mid);
  const right = divideAndConquer(points, scratch, mid, end);

  let bestDistance = left.distance;
  let bestPair = left.pair;
  if (right.distance < bestDistance) {
    bestDistance = right.distance;
    bestPair = right.pair;
  }

  mergeByY(points, scratch, start, mid, end);

  const strip: Point[] = [];
  for (let i = start; i < end; i += 1) {
    const candidate = points[i];
    if (candidate && Math.abs(candidate.x - midX) < bestDistance) {
      strip.push(candidate);
    }
  }

  for (let i = 0; i < strip.length; i += 1) {
    const pointI = strip[i];
    if (!pointI) continue;
    for (let j = i + 1; j < strip.length; j += 1) {
      const pointJ = strip[j];
      if (!pointJ) continue;
      const deltaY = pointJ.y - pointI.y;
      if (deltaY >= bestDistance) break;
      const distance = euclidean(pointI, pointJ);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPair = [pointI, pointJ];
      }
    }
  }

  return { distance: bestDistance, pair: bestPair };
}

function mergeByY(
  points: Array<Point>,
  scratch: Array<Point>,
  start: number,
  mid: number,
  end: number
): void {
  let i = start;
  let j = mid;
  let k = start;

  while (i < mid && j < end) {
    const pointI = points[i];
    const pointJ = points[j];
    if (pointI === undefined || pointJ === undefined) {
      throw new Error('Unexpected undefined point while merging by Y.');
    }
    if ((pointI.y < pointJ.y) || (pointI.y === pointJ.y && pointI.x <= pointJ.x)) {
      scratch[k] = pointI;
      i += 1;
    } else {
      scratch[k] = pointJ;
      j += 1;
    }
    k += 1;
  }
  while (i < mid) {
    const pointI = points[i];
    if (pointI === undefined) {
      throw new Error('Unexpected undefined point while merging left partition.');
    }
    scratch[k] = pointI;
    i += 1;
    k += 1;
  }
  while (j < end) {
    const pointJ = points[j];
    if (pointJ === undefined) {
      throw new Error('Unexpected undefined point while merging right partition.');
    }
    scratch[k] = pointJ;
    j += 1;
    k += 1;
  }
  for (let idx = start; idx < end; idx += 1) {
    const value = scratch[idx];
    if (value === undefined) {
      throw new Error('Unexpected undefined scratch point after merge.');
    }
    points[idx] = value;
  }
}

function euclidean(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}
