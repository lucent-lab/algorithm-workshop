/**
 * Options for two-dimensional Perlin noise generation.
 */
export interface PerlinOptions {
  width: number;
  height: number;
  scale?: number;
  octaves?: number;
  persistence?: number;
  lacunarity?: number;
  seed?: number;
}

/**
 * Generates two-dimensional Perlin noise with configurable octaves.
 * Useful for: terrain generation, natural textures, motion curves.
 */
export function perlin({
  width,
  height,
  scale = 20,
  octaves = 1,
  persistence = 0.5,
  lacunarity = 2,
  seed = 1337,
}: PerlinOptions): number[][] {
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error('width and height must be positive integers.');
  }

  const noise = new Perlin(seed);
  const result = Array.from({ length: height }, () => Array<number>(width).fill(0));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let amplitude = 1;
      let frequency = 1;
      let value = 0;

      for (let o = 0; o < octaves; o += 1) {
        const sampleX = (x / scale) * frequency;
        const sampleY = (y / scale) * frequency;
        value += amplitude * noise.perlin2(sampleX, sampleY);

        amplitude *= persistence;
        frequency *= lacunarity;
      }

      result[y][x] = clamp(value, -1, 1);
    }
  }

  return result;
}

/**
 * Computes single-sample Perlin noise in three dimensions.
 * Useful for: volumetric effects, animated noise, procedural clouds.
 */
export function perlin3D(x: number, y: number, z: number, seed = 1337): number {
  const noise = new Perlin(seed);
  return noise.perlin3(x, y, z);
}

class Perlin {
  private permutation: Uint8Array;

  constructor(seed: number) {
    this.permutation = buildPermutation(seed);
  }

  perlin2(x: number, y: number): number {
    return this.#perlin(x, y, 0, 2);
  }

  perlin3(x: number, y: number, z: number): number {
    return this.#perlin(x, y, z, 3);
  }

  #perlin(x: number, y: number, z: number, dimensions: 2 | 3): number {
    const p = this.permutation;
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    if (dimensions === 2) {
      const aa = p[p[xi] + yi];
      const ab = p[p[xi] + yi + 1];
      const ba = p[p[xi + 1] + yi];
      const bb = p[p[xi + 1] + yi + 1];

      const x1 = lerp(grad2(p[aa], xf, yf), grad2(p[ba], xf - 1, yf), u);
      const x2 = lerp(grad2(p[ab], xf, yf - 1), grad2(p[bb], xf - 1, yf - 1), u);
      return lerp(x1, x2, v);
    }

    const aaa = p[p[p[xi] + yi] + zi];
    const aba = p[p[p[xi] + yi + 1] + zi];
    const aab = p[p[p[xi] + yi] + zi + 1];
    const abb = p[p[p[xi] + yi + 1] + zi + 1];
    const baa = p[p[p[xi + 1] + yi] + zi];
    const bba = p[p[p[xi + 1] + yi + 1] + zi];
    const bab = p[p[p[xi + 1] + yi] + zi + 1];
    const bbb = p[p[p[xi + 1] + yi + 1] + zi + 1];

    const x1 = lerp(grad3(p[aaa], xf, yf, zf), grad3(p[baa], xf - 1, yf, zf), u);
    const x2 = lerp(grad3(p[aba], xf, yf - 1, zf), grad3(p[bba], xf - 1, yf - 1, zf), u);
    const y1 = lerp(x1, x2, v);

    const x3 = lerp(grad3(p[aab], xf, yf, zf - 1), grad3(p[bab], xf - 1, yf, zf - 1), u);
    const x4 = lerp(grad3(p[abb], xf, yf - 1, zf - 1), grad3(p[bbb], xf - 1, yf - 1, zf - 1), u);
    const y2 = lerp(x3, x4, v);

    return lerp(y1, y2, w);
  }
}

function buildPermutation(seed: number): Uint8Array {
  const permutation = new Uint8Array(512);
  const random = mulberry32(seed);
  const base = Array.from({ length: 256 }, (_, i) => i);

  for (let i = base.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }

  for (let i = 0; i < 512; i += 1) {
    permutation[i] = base[i & 255];
  }
  return permutation;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function random(): number {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad2(hash: number, x: number, y: number): number {
  switch (hash & 3) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    default:
      return -x - y;
  }
}

function grad3(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const __internals = {
  buildPermutation,
  fade,
  lerp,
  grad2,
  grad3,
  mulberry32,
};
