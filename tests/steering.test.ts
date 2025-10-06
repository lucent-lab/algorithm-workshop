import { describe, it, expect } from 'vitest';
import { seek, flee, arrive, wander } from '../src/ai/steering.js';

const baseAgent = {
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  maxSpeed: 5,
  maxForce: 5,
};

describe('Steering behaviours', () => {
  it('seek accelerates toward target', () => {
    const force = seek(baseAgent, { x: 10, y: 0 });
    expect(force.x).toBeGreaterThan(0);
  });

  it('flee accelerates away from target', () => {
    const force = flee(baseAgent, { x: 10, y: 0 });
    expect(force.x).toBeLessThanOrEqual(0);
  });

  it('arrive slows near target', () => {
    const farForce = arrive(baseAgent, { x: 10, y: 0 }, 2);
    const closeForce = arrive(baseAgent, { x: 0.5, y: 0 }, 2);
    expect(Math.abs(closeForce.x)).toBeLessThan(Math.abs(farForce.x));
  });

  it('wander returns new heading state', () => {
    const { force, state } = wander({ ...baseAgent, velocity: { x: 1, y: 0 } });
    expect(force).toBeTruthy();
    expect(typeof state.angle).toBe('number');
  });
});
