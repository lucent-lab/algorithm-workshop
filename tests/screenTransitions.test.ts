import { describe, expect, it } from 'vitest';

import {
  computeFade,
  computeHorizontalWipe,
  computeLetterbox,
  createScreenTransition,
} from '../src/index.js';

describe('screen transitions', () => {
  it('progresses through phases and respects hold duration', () => {
    const transition = createScreenTransition({ durationIn: 1, hold: 0.5, durationOut: 1 });
    transition.start();

    // Start phase in
    let state = transition.getState();
    expect(state.phase).toBe('in');
    expect(state.value).toBe(0);

    state = transition.update(0.5);
    expect(state.phase).toBe('in');
    expect(state.value).toBeCloseTo(0.5, 5);
    expect(computeFade(state).opacity).toBeCloseTo(0.5, 5);

    state = transition.update(0.5);
    expect(state.phase).toBe('hold');
    expect(state.value).toBe(1);

    state = transition.update(0.5);
    expect(state.phase).toBe('out');
    expect(state.value).toBeCloseTo(1, 5);

    state = transition.update(0.5);
    expect(state.phase).toBe('out');
    expect(state.value).toBeCloseTo(0.5, 5);

    state = transition.update(0.5);
    expect(state.phase).toBe('completed');
    expect(state.value).toBe(0);
    expect(transition.isCompleted()).toBe(true);
  });

  it('computes wipe and letterbox values and can reset', () => {
    const transition = createScreenTransition({ durationIn: 0.8, durationOut: 0.8 });
    transition.start();

    transition.update(0.4);
    let state = transition.getState();
    const wipe = computeHorizontalWipe(state, 'right');
    expect(wipe.direction).toBe('right');
    expect(wipe.offset).toBeCloseTo(state.value, 5);

    const bars = computeLetterbox(state, 200);
    expect(bars.barSize).toBeGreaterThan(0);

    transition.update(2);
    expect(transition.isCompleted()).toBe(true);

    transition.reset();
    state = transition.getState();
    expect(state.phase).toBe('idle');
    expect(state.value).toBe(0);
    expect(transition.isActive()).toBe(false);
  });
});
