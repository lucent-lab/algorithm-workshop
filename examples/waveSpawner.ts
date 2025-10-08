import { createWaveSpawner } from '../src/index.js';

const spawner = createWaveSpawner({
  loop: false,
  waves: [
    { delay: 1, count: 3, interval: 0.5, template: { type: 'grunt', hp: 10 } },
    { delay: 2, count: 2, interval: 0.25, template: { type: 'archer', hp: 6 } },
  ],
});

let elapsed = 0;
while (!spawner.isFinished()) {
  elapsed += 0.5;
  const spawns = spawner.update(0.5);
  if (spawns.length > 0) {
    console.log(`t=${elapsed.toFixed(1)}s`, spawns);
  }
}
