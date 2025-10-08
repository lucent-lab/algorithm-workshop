import { describe, expect, it, vi } from 'vitest';

import { createTweenSystem } from '../src/index.js';

describe('createTweenSystem', () => {
  it('interpolates values with easing and repeats', () => {
    const onUpdate = vi.fn();
    const onComplete = vi.fn();

    const tweens = createTweenSystem();
    const tween = tweens.create({
      from: 0,
      to: 10,
      duration: 1,
      repeat: 1,
      yoyo: true,
      onUpdate,
      onComplete,
      easing: (t) => t * t,
    });

    let total = 0;
    while (total < 4.5) {
      tween.update(0.25);
      total += 0.25;
    }

    expect(onUpdate).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(tween.getValue()).toBeCloseTo(10, 5);
    expect(tween.getStatus()).toBe('completed');
  });

  it('respects delay and global speed', () => {
    const tweens = createTweenSystem({ speed: 0.5 });
    const tween = tweens.create({
      from: 0,
      to: 1,
      duration: 1,
      delay: 1,
    });

    tweens.update(0.5);
    expect(tween.getValue()).toBe(0);

    tweens.update(1);
    expect(tween.getValue()).toBe(0);

    tweens.update(1);
    expect(tween.getValue()).toBeGreaterThan(0);

    tweens.setGlobalSpeed(2);
    tweens.update(0.25);
    expect(tween.getValue()).toBeCloseTo(1, 1);
  });

  it('validates inputs', () => {
    const tweens = createTweenSystem();

    expect(() =>
      tweens.create({
        from: 0,
        to: 1,
        duration: 0,
      })
    ).toThrow(/duration/);

    const tween = tweens.create({
      from: 0,
      to: 1,
      duration: 1,
    });

    expect(() => tween.update(-1)).toThrow(/delta/);
    expect(() => tween.setSpeed(-1)).toThrow(/speed/);
  });
});
