import { rvoStep } from '../src/index.js';
import type { RvoAgent } from '../src/types.js';

const agents: RvoAgent[] = [
  {
    id: 'alpha',
    position: { x: -2, y: 0 },
    velocity: { x: 1, y: 0 },
    preferredVelocity: { x: 1, y: 0 },
    radius: 0.4,
    maxSpeed: 1.5,
  },
  {
    id: 'beta',
    position: { x: 2, y: 0.2 },
    velocity: { x: -1, y: 0 },
    preferredVelocity: { x: -1, y: 0 },
    radius: 0.4,
    maxSpeed: 1.5,
  },
  {
    id: 'gamma',
    position: { x: 0, y: 1.5 },
    velocity: { x: 0, y: -0.8 },
    preferredVelocity: { x: 0, y: -0.8 },
    radius: 0.4,
    maxSpeed: 1.2,
  },
];

const results = rvoStep(agents, { timeHorizon: 3 });
console.log(results);
