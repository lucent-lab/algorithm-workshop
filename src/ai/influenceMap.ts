export interface InfluenceSource {
  position: { x: number; y: number };
  strength: number;
  radius?: number;
  falloff?: 'linear' | 'inverse' | 'constant';
}

export interface InfluenceMapOptions {
  width: number;
  height: number;
  cellSize?: number;
  sources: ReadonlyArray<InfluenceSource>;
  obstacles?: (x: number, y: number) => boolean;
  decay?: number;
}

export interface InfluenceMapResult {
  width: number;
  height: number;
  cellSize: number;
  values: Float32Array;
}

export function computeInfluenceMap(options: InfluenceMapOptions): InfluenceMapResult {
  validateOptions(options);
  const cellSize = options.cellSize ?? 1;
  const values = new Float32Array(options.width * options.height);

  const sources: ReadonlyArray<InfluenceSource> = options.sources;
  for (const source of sources) {
    applySource(values, options, source, cellSize);
  }

  if (options.decay !== undefined && options.decay > 0) {
    applyDecay(values, options, options.decay);
  }

  return {
    width: options.width,
    height: options.height,
    cellSize,
    values,
  };
}

function applySource(values: Float32Array, options: InfluenceMapOptions, source: InfluenceSource, cellSize: number): void {
  const radius = source.radius ?? Infinity;
  const falloff = source.falloff ?? 'linear';
  const strength = source.strength;
  const startX = Math.max(0, Math.floor((source.position.x - radius) / cellSize));
  const endX = Math.min(options.width - 1, Math.ceil((source.position.x + radius) / cellSize));
  const startY = Math.max(0, Math.floor((source.position.y - radius) / cellSize));
  const endY = Math.min(options.height - 1, Math.ceil((source.position.y + radius) / cellSize));

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      if (options.obstacles?.(x, y)) {
        continue;
      }
      const distance = euclideanDistance(source.position, { x: x * cellSize + cellSize / 2, y: y * cellSize + cellSize / 2 });
      if (distance > radius) {
        continue;
      }
      const contribution = computeContribution(strength, distance, radius, falloff);
      values[y * options.width + x] += contribution;
    }
  }
}

function applyDecay(values: Float32Array, options: InfluenceMapOptions, decay: number): void {
  const width = options.width;
  const height = options.height;
  const newValues = values.slice();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      let total = values[idx];
      let count = 1;
      if (x > 0) {
        total += values[idx - 1];
        count += 1;
      }
      if (x < width - 1) {
        total += values[idx + 1];
        count += 1;
      }
      if (y > 0) {
        total += values[idx - width];
        count += 1;
      }
      if (y < height - 1) {
        total += values[idx + width];
        count += 1;
      }
      newValues[idx] = values[idx] * (1 - decay) + (total / count) * decay;
    }
  }

  values.set(newValues);
}

function computeContribution(strength: number, distance: number, radius: number, falloff: 'linear' | 'inverse' | 'constant'): number {
  if (distance === 0) {
    return strength;
  }
  switch (falloff) {
    case 'linear':
      return strength * Math.max(0, 1 - distance / radius);
    case 'inverse':
      return strength / (distance * distance);
    case 'constant':
      return strength;
    default:
      return 0;
  }
}

function euclideanDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function validateOptions(options: InfluenceMapOptions): void {
  if (!Number.isInteger(options.width) || options.width <= 0) {
    throw new Error('width must be a positive integer.');
  }
  if (!Number.isInteger(options.height) || options.height <= 0) {
    throw new Error('height must be a positive integer.');
  }
  if (!Array.isArray(options.sources) || options.sources.length === 0) {
    throw new Error('sources must contain at least one source.');
  }
  if (options.cellSize !== undefined && (typeof options.cellSize !== 'number' || !Number.isFinite(options.cellSize) || options.cellSize <= 0)) {
    throw new Error('cellSize must be a positive number.');
  }
  if (options.decay !== undefined) {
    if (typeof options.decay !== 'number' || Number.isNaN(options.decay) || !Number.isFinite(options.decay)) {
      throw new Error('decay must be a finite number.');
    }
    if (options.decay < 0 || options.decay > 1) {
      throw new Error('decay must be in the range [0, 1].');
    }
  }
  const sources: ReadonlyArray<InfluenceSource> = options.sources;
  for (const source of sources) {
    const { position } = source;
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
      throw new Error('Each source must have a numeric position.');
    }
    if (typeof source.strength !== 'number' || Number.isNaN(source.strength) || !Number.isFinite(source.strength)) {
      throw new Error('Each source must have a numeric strength.');
    }
    if (source.radius !== undefined && (!Number.isFinite(source.radius) || source.radius <= 0)) {
      throw new Error('Source radius must be positive when provided.');
    }
    if (source.falloff && source.falloff !== 'linear' && source.falloff !== 'inverse' && source.falloff !== 'constant') {
      throw new Error('Source falloff must be linear, inverse, or constant when provided.');
    }
  }
}
