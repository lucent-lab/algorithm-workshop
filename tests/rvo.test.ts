import { describe, expect, it } from 'vitest';
import { rvoStep } from '../src/ai/rvo.js';
import type { RvoAgent } from '../src/types.js';

describe('rvoStep', () => {
  const baseAgents: RvoAgent[] = [
    {
      id: 'left',
      position: { x: -1, y: 0 },
      velocity: { x: 1, y: 0 },
      preferredVelocity: { x: 1, y: 0 },
      radius: 0.3,
      maxSpeed: 2,
    },
    {
      id: 'right',
      position: { x: 1, y: 0 },
      velocity: { x: -1, y: 0 },
      preferredVelocity: { x: -1, y: 0 },
      radius: 0.3,
      maxSpeed: 2,
    },
  ];

  it('adjusts velocities to avoid impending collisions', () => {
    const results = rvoStep(baseAgents, { timeHorizon: 3 });
    const left = results.find((entry) => entry.id === 'left');
    const right = results.find((entry) => entry.id === 'right');

    expect(left).toBeDefined();
    expect(right).toBeDefined();

    expect(Math.abs(left!.velocity.y)).toBeGreaterThan(0);
    expect(Math.abs(right!.velocity.y)).toBeGreaterThan(0);
    expect(left!.velocity.y * right!.velocity.y).toBeLessThan(0);

    expect(left!.velocity.x).toBeGreaterThan(0);
    expect(right!.velocity.x).toBeLessThan(0);
  });

  it('respects max speed and leaves non-threatening agents unchanged', () => {
    const agents: RvoAgent[] = [
      {
        id: 'a',
        position: { x: 0, y: 0 },
        velocity: { x: 0.2, y: 0 },
        preferredVelocity: { x: 1, y: 0 },
        radius: 0.2,
        maxSpeed: 1,
      },
      {
        id: 'b',
        position: { x: 0, y: 5 },
        velocity: { x: 0, y: -0.2 },
        preferredVelocity: { x: 0, y: -0.5 },
        radius: 0.2,
        maxSpeed: 1,
      },
    ];

    const [first, second] = rvoStep(agents, { timeHorizon: 2 });
    expect(Math.hypot(first.velocity.x, first.velocity.y)).toBeLessThanOrEqual(1 + 1e-6);
    expect(second.velocity).toEqual(agents[1].preferredVelocity);
  });

  it('validates inputs', () => {
    expect(() => rvoStep(null as unknown as RvoAgent[])).toThrow(TypeError);
    expect(() => rvoStep(baseAgents, { timeHorizon: 0 })).toThrow(RangeError);
  });
});
