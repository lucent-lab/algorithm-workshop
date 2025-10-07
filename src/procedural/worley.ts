export interface WorleyOptions {
  width: number;
  height: number;
  points: number;
  seed?: number;
  distanceMetric?: 'euclidean' | 'manhattan';
  normalize?: boolean;
}

interface Point2D {
  x: number;
  y: number;
}

/**
 * Generates a Worley (cellular) noise field matrix.
 * Useful for: cellular textures, biome masks, water/stone patterns.
 *
 * @param {WorleyOptions} options - Configuration values.
 * @returns {number[][]} Height-by-width matrix of normalized distances (0-1 by default).
 *
 * @example
 * const field = worley({ width: 4, height: 4, points: 8, seed: 42 });
 * console.log(field[0][0] >= 0 && field[0][0] <= 1);
 * // => true
 *
 * @example
 * const tiles = worley({
 *   width: 8,
 *   height: 8,
 *   points: 10,
 *   distanceMetric: 'manhattan',
 *   normalize: false,
 * });
 * console.log(Math.max(...tiles.flat()));
 */
export function worley(options: WorleyOptions): number[][] {
  const {
    width,
    height,
    points,
    seed = 1337,
    distanceMetric = 'euclidean',
    normalize = true,
  } = options;

  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error('width and height must be positive integers.');
  }
  if (!Number.isInteger(points) || points <= 0) {
    throw new Error('points must be a positive integer.');
  }

  const rng = createSeededRandom(seed);
  const featurePoints: Point2D[] = Array.from({ length: points }, () => ({
    x: rng() * width,
    y: rng() * height,
  }));

  const field: number[][] = Array.from({ length: height }, () => Array<number>(width).fill(0));
  let maxDistance = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const distance = findNearestDistance({ x, y }, featurePoints, distanceMetric);
      field[y][x] = distance;
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
  }

  if (normalize && maxDistance > 0) {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        field[y][x] /= maxDistance;
      }
    }
  }

  return field;
}

/**
 * Computes Worley distance for a coordinate against prepared feature points.
 * Useful for: shader lookups, procedural sampling on the fly.
 *
 * @param {number} x - Sample X coordinate.
 * @param {number} y - Sample Y coordinate.
 * @param {readonly Point2D[]} points - Array of feature points.
 * @param {'euclidean' | 'manhattan'} [metric='euclidean'] - Distance function.
 *
 * @returns {number} Distance to nearest feature point.
 *
 * @example
 * const points = [{ x: 0, y: 0 }, { x: 10, y: 10 }];
 * worleySample(5, 5, points);
 * // => ~7.07
 */
export function worleySample(
  x: number,
  y: number,
  points: readonly Point2D[],
  metric: 'euclidean' | 'manhattan' = 'euclidean'
): number {
  return findNearestDistance({ x, y }, points, metric);
}

function findNearestDistance(point: Point2D, points: readonly Point2D[], metric: 'euclidean' | 'manhattan'): number {
  let nearest = Number.POSITIVE_INFINITY;
  for (const feature of points) {
    const distance = metric === 'euclidean'
      ? euclidean(point, feature)
      : manhattan(point, feature);
    if (distance < nearest) {
      nearest = distance;
    }
  }
  return nearest;
}

function euclidean(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function manhattan(a: Point2D, b: Point2D): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export const __internals = {
  createSeededRandom,
  findNearestDistance,
  euclidean,
  manhattan,
};
