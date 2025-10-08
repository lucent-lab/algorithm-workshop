import { describe, expect, it } from 'vitest';

import { createTopDownController } from '../src/index.js';

describe('createTopDownController', () => {
  const options = {
    acceleration: 20,
    deceleration: 18,
    maxSpeed: 5,
    drag: 0,
    normalizeDiagonal: true,
  } as const;

  it('accelerates towards max speed and maintains facing', () => {
    const controller = createTopDownController(options);
    let state = controller.update({ delta: 0.016, input: { x: 1, y: 0 } });
    expect(state.velocity.x).toBeGreaterThan(0);
    expect(state.facing.x).toBeCloseTo(1, 5);

    for (let i = 0; i < 200; i += 1) {
      state = controller.update({ delta: 0.016, input: { x: 1, y: 0 } });
    }
    expect(Math.abs(state.velocity.x)).toBeLessThanOrEqual(options.maxSpeed + 1e-3);
    expect(Math.abs(state.velocity.y)).toBeLessThan(1e-3);
  });

  it('decelerates to a stop when no input is provided', () => {
    const controller = createTopDownController(options);
    controller.update({ delta: 0.016, input: { x: 1, y: 0 } });
    controller.update({ delta: 0.5, input: { x: 1, y: 0 } });

    let state = controller.update({ delta: 0.16, input: { x: 0, y: 0 } });
    expect(Math.abs(state.velocity.x)).toBeLessThan(options.maxSpeed);

    for (let i = 0; i < 20; i += 1) {
      state = controller.update({ delta: 0.1, input: { x: 0, y: 0 } });
    }
    expect(state.velocity.x).toBeCloseTo(0, 5);
    expect(state.velocity.y).toBeCloseTo(0, 5);
  });

  it('normalizes diagonal input to avoid faster movement', () => {
    const controller = createTopDownController(options);
    const state = controller.update({ delta: 1, input: { x: 1, y: 1 } });
    const speed = Math.hypot(state.velocity.x, state.velocity.y);
    expect(speed).toBeLessThanOrEqual(options.maxSpeed + 1e-3);
  });

  it('reset restores baseline state', () => {
    const controller = createTopDownController(options, {
      position: { x: 5, y: -3 },
      velocity: { x: 2, y: 1 },
      facing: { x: 0, y: 1 },
    });

    controller.update({ delta: 0.5, input: { x: -1, y: 0 } });
    controller.reset();
    const state = controller.getState();
    expect(state.position).toEqual({ x: 5, y: -3 });
    expect(state.velocity).toEqual({ x: 2, y: 1 });
    expect(state.facing).toEqual({ x: 0, y: 1 });
  });
});
