import { createCamera2D } from '../src/index.js';

const camera = createCamera2D({
  viewportWidth: 16,
  viewportHeight: 9,
  deadzone: { width: 4, height: 2 },
  smoothing: 0.2,
});

let time = 0;
const target = { x: 0, y: 0 };

for (let i = 0; i < 5; i += 1) {
  time += 1 / 60;
  target.x = Math.cos(time) * 20;
  target.y = Math.sin(time) * 5;
  const view = camera.update({ target, delta: 1 / 60 });
  console.log(`frame ${i}:`, view);
}

camera.applyShake({ magnitude: 1, duration: 0.3 });
console.log('shake:', camera.update({ target, delta: 1 / 60 }));
