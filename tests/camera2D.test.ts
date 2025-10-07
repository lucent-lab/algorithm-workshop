import { describe, expect, it, vi } from 'vitest';

import { createCamera2D } from '../src/index.js';

describe('createCamera2D', () => {
  it('follows a target without smoothing', () => {
    const camera = createCamera2D({ viewportWidth: 10, viewportHeight: 10, smoothing: 0 });
    const view = camera.update({ target: { x: 20, y: 15 }, delta: 0.016 });
    expect(view).toEqual({ x: 15, y: 10, width: 10, height: 10 });
  });

  it('keeps target within deadzone before moving', () => {
    const camera = createCamera2D({
      viewportWidth: 12,
      viewportHeight: 12,
      smoothing: 0,
      deadzone: { width: 4, height: 4 },
    });

    camera.update({ target: { x: 6, y: 6 }, delta: 0.016 });
    expect(camera.getView().x).toBe(0);

    const moved = camera.update({ target: { x: 9, y: 6 }, delta: 0.016 });
    expect(moved.x).toBe(1);
  });

  it('applies smoothing gradually', () => {
    const camera = createCamera2D({ viewportWidth: 10, viewportHeight: 10, smoothing: 0.2 });
    camera.update({ target: { x: 10, y: 0 }, delta: 0.016 });
    const position = camera.getPosition();
    expect(position.x).toBeGreaterThan(0);
    expect(position.x).toBeLessThan(5);
  });

  it('clamps to bounds', () => {
    const camera = createCamera2D({
      viewportWidth: 10,
      viewportHeight: 10,
      smoothing: 0,
      bounds: { minX: 0, maxX: 25, minY: 0, maxY: 18 },
    });
    const view = camera.update({ target: { x: 50, y: 50 }, delta: 0.016 });
    expect(view).toEqual({ x: 15, y: 8, width: 10, height: 10 });
  });

  it('applies deterministic screen shake and clears on reset', () => {
    const random = vi.fn(() => 0.5);
    const camera = createCamera2D({ viewportWidth: 10, viewportHeight: 10, smoothing: 0, random });
    camera.applyShake({ magnitude: 2, duration: 0.5, frequency: 1 });

    const delta = 0.1;
    const shaken = camera.update({ target: { x: 0, y: 0 }, delta });
    const position = camera.getPosition();

    const duration = 0.5;
    const magnitude = 2;
    const frequency = 1;
    const phase = Math.PI;
    const progress = delta / duration;
    const damping = 1 - progress;
    const expectedOffsetX = Math.cos(phase + delta * frequency * Math.PI * 2) * magnitude * damping;
    const expectedOffsetY = Math.sin(phase + delta * (frequency * 0.9) * Math.PI * 2) * magnitude * damping;

    expect(shaken.x - position.x).toBeCloseTo(expectedOffsetX, 5);
    expect(shaken.y - position.y).toBeCloseTo(expectedOffsetY, 5);
    expect(camera.isShaking()).toBe(true);

    camera.reset({ x: 0, y: 0 });
    expect(camera.isShaking()).toBe(false);
    const resetView = camera.getView();
    expect(resetView).toEqual({ x: 0, y: 0, width: 10, height: 10 });
  });
});
