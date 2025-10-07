import { describe, it, expect } from 'vitest';
import { updateBoids } from '../src/ai/boids.js';

const createBoid = (x: number, y: number) => ({
  position: { x, y },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  maxSpeed: 3,
  maxForce: 0.1,
});

describe('boids', () => {
  it('adjusts velocities based on neighbours', () => {
    const boids = [createBoid(0, 0), createBoid(5, 0), createBoid(10, 0)];
    updateBoids(boids, {
      separationDistance: 6,
      alignmentDistance: 8,
      cohesionDistance: 12,
      maxSpeed: 3,
      maxForce: 0.1,
      separationWeight: 1.2,
      alignmentWeight: 1,
      cohesionWeight: 1,
    });

    expect(boids.some((boid) => Math.abs(boid.velocity.x) > 0)).toBe(true);
  });

  it('keeps velocities within max speed', () => {
    const boids = [createBoid(0, 0), createBoid(1, 0), createBoid(0, 1)];
    updateBoids(boids, {
      separationDistance: 5,
      alignmentDistance: 5,
      cohesionDistance: 5,
      maxSpeed: 1,
      maxForce: 0.05,
    });

    for (const boid of boids) {
      const speed = Math.hypot(boid.velocity.x, boid.velocity.y);
      expect(speed).toBeLessThanOrEqual(1.00001);
    }
  });
});
