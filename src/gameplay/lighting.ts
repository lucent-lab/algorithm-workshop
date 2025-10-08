export type FalloffMode = 'linear' | 'quadratic' | 'smoothstep';

export interface PointLight {
  x: number;
  y: number;
  radius: number;
  intensity?: number;
  falloff?: FalloffMode;
  color?: [number, number, number];
}

export interface LightingGridOptions {
  width: number;
  height: number;
  tileSize: number;
  ambient?: number;
  lights: ReadonlyArray<PointLight>;
  obstacles?: (x: number, y: number) => boolean;
}

export interface LightingCell {
  light: number;
  color: [number, number, number];
}

export interface LightingGridResult {
  width: number;
  height: number;
  cells: LightingCell[];
}

function assertPositive(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive finite number.`);
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function falloff(distance: number, radius: number, mode: FalloffMode): number {
  const t = clamp(distance / radius, 0, 1);
  switch (mode) {
    case 'linear':
      return 1 - t;
    case 'quadratic':
      return 1 - t * t;
    case 'smoothstep':
      return 1 - (t * t * (3 - 2 * t));
    default:
      return 1 - t;
  }
}

function blendColor(base: [number, number, number], add: [number, number, number], weight: number): [number, number, number] {
  return [
    clamp(base[0] + add[0] * weight, 0, 1),
    clamp(base[1] + add[1] * weight, 0, 1),
    clamp(base[2] + add[2] * weight, 0, 1),
  ];
}

function defaultColor(): [number, number, number] {
  return [0, 0, 0];
}

/**
 * Calculates a lighting grid for 2D tile maps with simple falloff.
 * Useful for: top-down games, roguelike rendering, and fog-of-war overlays.
 */
export function computeLightingGrid(options: LightingGridOptions): LightingGridResult {
  if (!Array.isArray(options.lights) || options.lights.length === 0) {
    throw new Error('lights must contain at least one point light.');
  }
  assertPositive(options.width, 'width');
  assertPositive(options.height, 'height');
  assertPositive(options.tileSize, 'tileSize');

  const ambient = clamp(options.ambient ?? 0.1, 0, 1);
  const obstacles = options.obstacles ?? (() => false);

  const cells: LightingCell[] = [];

  const lights = options.lights as ReadonlyArray<PointLight>;

  for (let y = 0; y < options.height; y += 1) {
    for (let x = 0; x < options.width; x += 1) {
      let light = ambient;
      let color: [number, number, number] = defaultColor();
      color = blendColor(color, [ambient, ambient, ambient], 1);

      if (obstacles(x, y)) {
        cells.push({ light, color });
        continue;
      }

      const worldX = (x + 0.5) * options.tileSize;
      const worldY = (y + 0.5) * options.tileSize;

      for (const point of lights) {
        assertPositive(point.radius, 'light.radius');
        const dx = worldX - point.x;
        const dy = worldY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > point.radius) {
          continue;
        }
        const intensity = clamp(point.intensity ?? 1, 0, 10);
        const mode = point.falloff ?? 'smoothstep';
        const percent = falloff(distance, point.radius, mode) * intensity;
        light = clamp(light + percent, 0, 1);
        color = blendColor(color, point.color ?? [1, 0.95, 0.8], percent);
      }

      cells.push({ light, color });
    }
  }

  return {
    width: options.width,
    height: options.height,
    cells,
  };
}
