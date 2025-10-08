import { computeFade, computeHorizontalWipe, computeLetterbox, createScreenTransition } from '../src/index.js';

const transition = createScreenTransition({
  durationIn: 1,
  hold: 0.5,
  durationOut: 1,
});

transition.start();

for (let step = 0; step < 6; step += 1) {
  const state = transition.update(0.5);
  const fade = computeFade(state);
  const wipe = computeHorizontalWipe(state, 'left');
  const letterbox = computeLetterbox(state, 100);
  console.log(`t=${state.elapsed.toFixed(1)} phase=${state.phase} fade=${fade.opacity.toFixed(2)} wipe=${wipe.offset.toFixed(2)} bars=${letterbox.barSize.toFixed(1)}`);
}
