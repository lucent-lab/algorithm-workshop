const HEX_PATTERN = /^#?([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface MixColorOptions {
  /**
   * Amount of the second color to mix in. 0 keeps the first color, 1 replaces it entirely.
   * Defaults to 0.5.
   */
  ratio?: number;
}

export function hexToRgb(hex: string): RGBColor {
  const match = HEX_PATTERN.exec(hex.trim());
  if (!match) {
    throw new Error('Invalid hex color format.');
  }

  const value = match[1];
  const normalized = value.length <= 4 ? expandShorthand(value) : value;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const a = normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : undefined;

  return { r, g, b, a };
}

export function rgbToHex(color: RGBColor): string {
  validateRgb(color);
  const r = toHexComponent(color.r);
  const g = toHexComponent(color.g);
  const b = toHexComponent(color.b);
  const a = color.a === undefined ? '' : toHexComponent(Math.round(clamp(color.a, 0, 1) * 255));
  return `#${r}${g}${b}${a}`;
}

export function rgbToHsl(color: RGBColor): HSLColor {
  validateRgb(color);
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l, a: color.a };
}

export function hslToRgb(color: HSLColor): RGBColor {
  validateHsl(color);
  const h = mod(color.h, 360) / 60;
  const s = color.s;
  const l = color.l;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 1) {
    r = c;
    g = x;
  } else if (h >= 1 && h < 2) {
    r = x;
    g = c;
  } else if (h >= 2 && h < 3) {
    g = c;
    b = x;
  } else if (h >= 3 && h < 4) {
    g = x;
    b = c;
  } else if (h >= 4 && h < 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round(clamp((r + m) * 255, 0, 255)),
    g: Math.round(clamp((g + m) * 255, 0, 255)),
    b: Math.round(clamp((b + m) * 255, 0, 255)),
    a: color.a,
  };
}

export function mixRgbColors(a: RGBColor, b: RGBColor, options: MixColorOptions = {}): RGBColor {
  validateRgb(a);
  validateRgb(b);
  const ratio = clamp(options.ratio ?? 0.5, 0, 1);
  const inv = 1 - ratio;

  const alphaA = a.a ?? 1;
  const alphaB = b.a ?? 1;
  const mixedAlpha = alphaA * inv + alphaB * ratio;

  const mixChannel = (channelA: number, channelB: number) => Math.round(channelA * inv + channelB * ratio);

  const result: RGBColor = {
    r: mixChannel(a.r, b.r),
    g: mixChannel(a.g, b.g),
    b: mixChannel(a.b, b.b),
  };

  if (a.a !== undefined || b.a !== undefined) {
    result.a = clamp(mixedAlpha, 0, 1);
  }

  return result;
}

function expandShorthand(value: string): string {
  if (value.length === 3) {
    return value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (value.length === 4) {
    return value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return value;
}

function toHexComponent(value: number): string {
  const clamped = clamp(Math.round(value), 0, 255);
  return clamped.toString(16).padStart(2, '0');
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function validateRgb(color: RGBColor): void {
  assertFinite(color.r, 'r');
  assertFinite(color.g, 'g');
  assertFinite(color.b, 'b');
  if (!Number.isInteger(color.r) || color.r < 0 || color.r > 255) {
    throw new Error('r must be an integer between 0 and 255.');
  }
  if (!Number.isInteger(color.g) || color.g < 0 || color.g > 255) {
    throw new Error('g must be an integer between 0 and 255.');
  }
  if (!Number.isInteger(color.b) || color.b < 0 || color.b > 255) {
    throw new Error('b must be an integer between 0 and 255.');
  }
  if (color.a !== undefined) {
    assertFinite(color.a, 'a');
    if (color.a < 0 || color.a > 1) {
      throw new Error('a must be between 0 and 1.');
    }
  }
}

function validateHsl(color: HSLColor): void {
  assertFinite(color.h, 'h');
  assertFinite(color.s, 's');
  assertFinite(color.l, 'l');
  if (color.s < 0 || color.s > 1) {
    throw new Error('s must be between 0 and 1.');
  }
  if (color.l < 0 || color.l > 1) {
    throw new Error('l must be between 0 and 1.');
  }
  if (color.a !== undefined) {
    assertFinite(color.a, 'a');
    if (color.a < 0 || color.a > 1) {
      throw new Error('a must be between 0 and 1.');
    }
  }
}

function assertFinite(value: number | undefined, label: string): void {
  if (value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}
