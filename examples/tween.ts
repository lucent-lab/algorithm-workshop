import { createTweenSystem } from '../src/index.js';

const tweens = createTweenSystem();
const tween = tweens.create({
  from: 0,
  to: 100,
  duration: 2,
  easing: (t) => t * t,
  onUpdate(value, progress) {
    console.log('value:', value.toFixed(2), 'progress:', progress.toFixed(2));
  },
  onComplete() {
    console.log('tween complete');
  },
});

let elapsed = 0;
while (elapsed < 2.5) {
  tween.update(0.5);
  elapsed += 0.5;
}
