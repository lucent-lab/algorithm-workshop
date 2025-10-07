import { describe, expect, it } from 'vitest';

import { createParticleSystem } from '../src/index.js';

describe('createParticleSystem', () => {
  it('spawns particles based on rate and updates movement', () => {
    const system = createParticleSystem({
      emitter: {
        position: { x: 0, y: 0 },
        rate: 10,
        life: { min: 1, max: 1 },
        speed: { min: 5, max: 5 },
        angle: { min: 0, max: 0 },
        size: { min: 1, max: 1 },
        acceleration: { x: 0, y: -9.81 },
      },
      maxParticles: 20,
    });

    system.update(0.5);
    let particles = system.getParticles();
    expect(particles.length).toBe(5);
    particles.forEach((particle) => {
      expect(particle.age).toBeCloseTo(0.5, 5);
      expect(particle.position.x).toBeCloseTo(2.5, 5);
      expect(particle.position.y).toBeCloseTo(-2.4525, 4);
    });

    system.update(0.5);
    particles = system.getParticles();
    expect(particles.length).toBe(5);
    particles.forEach((particle) => {
      expect(particle.age).toBeLessThanOrEqual(0.5);
    });
  });

  it('supports bursts and respects maxParticles', () => {
    const system = createParticleSystem({
      emitter: {
        life: { min: 1, max: 1 },
        speed: { min: 0, max: 0 },
        angle: { min: 0, max: 0 },
      },
      maxParticles: 3,
    });

    system.burst(5);
    expect(system.getParticles().length).toBe(3);
  });

  it('updates emitter configuration and resets state', () => {
    const system = createParticleSystem({
      emitter: {
        position: { x: 0, y: 0 },
        rate: 0,
        life: { min: 1, max: 1 },
      },
    });

    system.setEmitter({ rate: 2, life: { min: 0.5, max: 0.5 }, acceleration: { x: 1, y: 0 } });
    system.setPosition({ x: 10, y: 5 });
    system.burst(1);
    let particles = system.getParticles();
    expect(particles.length).toBe(1);
    expect(particles[0].position).toEqual({ x: 10, y: 5 });

    system.reset();
    particles = system.getParticles();
    expect(particles.length).toBe(0);
  });

  it('validates inputs', () => {
    expect(() => createParticleSystem({
      emitter: {
        life: { min: -1, max: 1 },
      },
    })).toThrow(/life/);

    const system = createParticleSystem({
      emitter: {
        life: { min: 1, max: 1 },
      },
    });

    expect(() => system.update(-0.1)).toThrow(/delta/);
    expect(() => system.burst(-1)).toThrow(/count/);
  });
});
