import { describe, expect, it } from 'vitest';
import { quadraticBezier, cubicBezier } from '../src/visual/bezier.js';
import { easing } from '../src/visual/easing.js';

describe('quadraticBezier', () => {
  it('evaluates curve positions', () => {
    const point = quadraticBezier(
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 2, y: 0 },
      0.5
    );
    expect(point.x).toBeCloseTo(1);
    expect(point.y).toBeCloseTo(1);
  });
});

describe('cubicBezier', () => {
  it('evaluates cubic curve positions', () => {
    const point = cubicBezier(
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      0.5
    );
    expect(point.x).toBeCloseTo(0.5);
    expect(point.y).toBeCloseTo(0.75);
  });
});

describe('easing', () => {
  it('produces expected easing intensities', () => {
    expect(easing.linear(0.3)).toBeCloseTo(0.3);
    expect(easing.easeInQuad(0.5)).toBeLessThan(easing.linear(0.5));
    expect(easing.easeOutQuad(0.5)).toBeGreaterThan(easing.linear(0.5));
    expect(easing.easeInOutQuad(0)).toBe(0);
    expect(easing.easeInOutQuad(1)).toBe(1);
    expect(easing.easeInCubic(0.7)).toBeCloseTo(0.343);
    expect(easing.easeOutCubic(0)).toBe(0);
    expect(easing.easeOutCubic(1)).toBe(1);
  });
});
