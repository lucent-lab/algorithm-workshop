import { seek, wander } from '../src/index.js';

const agent = {
  position: { x: 0, y: 0 },
  velocity: { x: 1, y: 0 },
  maxSpeed: 5,
  maxForce: 1,
};

const target = { x: 10, y: 0 };
const seekForce = seek(agent, target);

console.log('Seek force:', seekForce);

const wanderResult = wander(agent);
console.log('Wander force:', wanderResult.force, 'state:', wanderResult.state);
