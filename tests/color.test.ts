import { describe, expect, it } from 'vitest';

import { hexToRgb, hslToRgb, mixRgbColors, rgbToHex, rgbToHsl } from '../src/index.js';

describe('color utilities', () => {
  it('converts between hex and rgb representations', () => {
    expect(hexToRgb('#ffcc00')).toEqual({ r: 255, g: 204, b: 0 });
    expect(hexToRgb('336699')).toEqual({ r: 51, g: 102, b: 153 });
    expect(hexToRgb('#0fa8')).toEqual({ r: 0, g: 255, b: 170, a: 0.5333333333333333 });

    expect(rgbToHex({ r: 51, g: 102, b: 153 })).toBe('#336699');
    expect(rgbToHex({ r: 0, g: 255, b: 170, a: 0.5 })).toBe('#00ffaa80');
  });

  it('round-trips RGB and HSL conversions', () => {
    const rgb = { r: 26, g: 188, b: 156 };
    const hsl = rgbToHsl(rgb);
    expect(hsl.h).toBeGreaterThan(160);
    expect(hsl.h).toBeLessThan(175);
    expect(hsl.s).toBeCloseTo(0.76, 2);
    expect(hsl.l).toBeCloseTo(0.42, 2);

    const roundTrip = hslToRgb(hsl);
    expect(roundTrip).toEqual(rgb);

    const withAlpha = { h: 210, s: 0.5, l: 0.4, a: 0.25 };
    expect(hslToRgb(withAlpha)).toEqual({ r: 51, g: 102, b: 153, a: 0.25 });
    expect(rgbToHsl({ r: 51, g: 102, b: 153, a: 0.25 }).a).toBeCloseTo(0.25, 5);
  });

  it('mixes RGB colors with optional alpha', () => {
    const mixed = mixRgbColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, { ratio: 0.25 });
    expect(mixed).toEqual({ r: 191, g: 0, b: 64 });

    const mixedAlpha = mixRgbColors(
      { r: 255, g: 255, b: 255, a: 0.2 },
      { r: 0, g: 0, b: 0, a: 0.8 },
      { ratio: 0.75 }
    );
    expect(mixedAlpha.r).toBe(64);
    expect(mixedAlpha.g).toBe(64);
    expect(mixedAlpha.b).toBe(64);
    expect(mixedAlpha.a).toBeDefined();
    expect(mixedAlpha.a).toBeCloseTo(0.65, 5);
  });

  it('validates input ranges', () => {
    expect(() => hexToRgb('#xyz')).toThrow();
    expect(() => rgbToHex({ r: 300, g: 0, b: 0 })).toThrow('r must be an integer between 0 and 255.');
    expect(() => rgbToHsl({ r: 0, g: -1, b: 0 })).toThrow('g must be an integer between 0 and 255.');
    expect(() => hslToRgb({ h: 0, s: 1.5, l: 0.5 })).toThrow('s must be between 0 and 1.');
    expect(() => mixRgbColors({ r: 0, g: 0, b: 0, a: -0.1 }, { r: 0, g: 0, b: 0 })).toThrow('a must be between 0 and 1.');
  });
});
