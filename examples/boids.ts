import { updateBoids } from '../src/index.js';

const flock = Array.from({ length: 5 }, (_, i) => ({
  position: { x: i * 5, y: i * 2 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  maxSpeed: 2.5,
  maxForce: 0.08,
}));

updateBoids(flock, {
  separationDistance: 10,
  alignmentDistance: 15,
  cohesionDistance: 20,
  maxSpeed: 2.5,
  maxForce: 0.08,
  separationWeight: 1.2,
  alignmentWeight: 1,
  cohesionWeight: 0.9,
});

console.log('First boid velocity', flock[0].velocity);
