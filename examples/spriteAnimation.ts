import { createSpriteAnimation } from '../src/index.js';

const animation = createSpriteAnimation({
  frames: [
    { frame: 'walk-0', duration: 0.08 },
    { frame: 'walk-1', duration: 0.08 },
    { frame: 'walk-2', duration: 0.08 },
    { frame: 'walk-3', duration: 0.08, events: ['footstep'] },
  ],
  mode: 'loop',
});

animation.on('footstep', (event) => {
  console.log('footstep event on frame', event.frameIndex);
});

for (let i = 0; i < 6; i += 1) {
  animation.update(0.08);
  console.log('current frame:', animation.getFrame().frame);
}
