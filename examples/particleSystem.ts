import { createParticleSystem } from '../src/index.js';

const system = createParticleSystem({
  emitter: {
    position: { x: 0, y: 0 },
    rate: 20,
    life: { min: 0.6, max: 1.2 },
    speed: { min: 2, max: 4 },
    angle: { min: 0, max: Math.PI * 2 },
    size: { min: 0.5, max: 1.5 },
    acceleration: { x: 0, y: -3 },
  },
  maxParticles: 100,
});

for (let i = 0; i < 5; i += 1) {
  system.update(1 / 30);
  console.log(`frame ${i}:`, system.getParticles().length, 'particles');
}

system.burst(10);
console.log('after burst:', system.getParticles().length, 'particles');
