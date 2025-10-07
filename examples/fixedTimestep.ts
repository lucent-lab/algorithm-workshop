import { createFixedTimestepLoop } from '../src/index.js';

let ticks = 0;
const loop = createFixedTimestepLoop({
  step: 1 / 60,
  update: () => {
    ticks += 1;
    if (ticks >= 3) {
      loop.stop();
      console.log('Stopped after 3 ticks');
    }
  },
});

loop.start();
