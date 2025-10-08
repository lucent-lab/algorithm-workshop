import { describe, expect, it } from 'vitest';

import { createPlatformerController } from '../src/index.js';

describe('createPlatformerController', () => {
  const baseOptions = {
    acceleration: 40,
    deceleration: 35,
    maxSpeed: 6,
    gravity: 30,
    jumpVelocity: 12,
    coyoteTime: 0.1,
    jumpBufferTime: 0.1,
    jumpCutMultiplier: 0.5,
  } as const;

  it('accelerates horizontally and clamps speed', () => {
    const controller = createPlatformerController(baseOptions, {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      onGround: true,
    });

    let state = controller.update({
      delta: 0.016,
      input: { move: 1, jump: false },
      onGround: true,
    });
    expect(state.velocity.x).toBeGreaterThan(0);

    for (let i = 0; i < 200; i += 1) {
      state = controller.update({ delta: 0.016, input: { move: 1, jump: false }, onGround: true });
    }
    expect(Math.abs(state.velocity.x)).toBeLessThanOrEqual(baseOptions.maxSpeed + 1e-3);
  });

  it('allows jumps during coyote time after leaving ground', () => {
    const controller = createPlatformerController(baseOptions, {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      onGround: true,
    });

    controller.update({ delta: 0.016, input: { move: 0, jump: false }, onGround: true });
    controller.update({ delta: 0.05, input: { move: 0, jump: false }, onGround: false });
    const state = controller.update({ delta: 0.016, input: { move: 0, jump: true }, onGround: false });

    expect(state.velocity.y).toBeLessThan(0);
    expect(state.onGround).toBe(false);
  });

  it('buffers jump input before touching ground', () => {
    const controller = createPlatformerController(baseOptions, {
      position: { x: 0, y: 5 },
      velocity: { x: 0, y: 5 },
      onGround: false,
    });

    controller.update({ delta: 0.016, input: { move: 0, jump: true }, onGround: false });
    controller.update({ delta: 0.05, input: { move: 0, jump: true }, onGround: false });
    const state = controller.update({ delta: 0.016, input: { move: 0, jump: true }, onGround: true });

    expect(state.velocity.y).toBeLessThan(0);
    expect(state.onGround).toBe(false);
  });

  it('applies jump cut when jump is released early', () => {
    const controller = createPlatformerController(baseOptions, {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      onGround: true,
    });

    const jumpState = controller.update({ delta: 0.016, input: { move: 0, jump: true }, onGround: true });
    expect(jumpState.velocity.y).toBeLessThan(0);

    const cutState = controller.update({ delta: 0.016, input: { move: 0, jump: false }, onGround: false });
    expect(cutState.velocity.y).toBeGreaterThan(jumpState.velocity.y);
  });
});
