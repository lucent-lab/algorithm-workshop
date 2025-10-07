import { createObjectPool } from '../src/index.js';

interface Particle {
  id: number;
  active: boolean;
}

let nextId = 1;
const pool = createObjectPool<Particle>({
  factory: () => ({ id: nextId += 1, active: true }),
  reset: (particle) => {
    particle.active = true;
  },
  initialSize: 2,
  maxSize: 5,
});

const particle = pool.acquire();
console.log('Acquired particle:', particle);
particle.active = false;
pool.release(particle);
console.log('Available after release:', pool.available());
