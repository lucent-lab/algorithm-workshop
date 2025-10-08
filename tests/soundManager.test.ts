import { describe, expect, it } from 'vitest';

import { createSoundManager } from '../src/index.js';

describe('createSoundManager', () => {
  it('enforces channel capacity and preempts lower priority sounds', () => {
    let now = 0;
    const manager = createSoundManager({
      maxChannels: 2,
      getTime: () => now,
    });

    const first = manager.play({ soundId: 'step-1', duration: 1, priority: 1 });
    const second = manager.play({ soundId: 'step-2', duration: 1, priority: 2 });

    expect(first.accepted).toBe(true);
    expect(second.accepted).toBe(true);

    const rejected = manager.play({ soundId: 'step-3', duration: 1, priority: 1 });
    expect(rejected.accepted).toBe(false);
    expect(rejected.reason).toBe('channel-limit');

    const promoted = manager.play({ soundId: 'step-4', duration: 1, priority: 5 });
    expect(promoted.accepted).toBe(true);
    expect(promoted.evicted?.soundId).toBe('step-1');
    expect(manager.getActive()).toHaveLength(2);

    const stopped = manager.stop(second.handle!.handleId);
    expect(stopped?.soundId).toBe('step-2');
    expect(manager.getActive()).toHaveLength(1);

    now = 2;
    const expired = manager.update();
    expect(expired).toHaveLength(1);
    expect(manager.getActive()).toHaveLength(0);
  });

  it('applies per-channel limits and allows higher priority overrides', () => {
    let now = 0;
    const manager = createSoundManager({
      maxChannels: 4,
      channelLimits: { music: 1, sfx: 2 },
      getTime: () => now,
    });

    const music = manager.play({ soundId: 'bgm', channel: 'music', duration: 10, priority: 1 });
    expect(music.accepted).toBe(true);

    const deniedMusic = manager.play({ soundId: 'boss-intro', channel: 'music', duration: 3, priority: 1 });
    expect(deniedMusic.accepted).toBe(false);

    const override = manager.play({ soundId: 'boss-intro', channel: 'music', duration: 3, priority: 10 });
    expect(override.accepted).toBe(true);
    expect(override.evicted?.soundId).toBe('bgm');

    manager.play({ soundId: 'hit', channel: 'sfx', duration: 1 });
    manager.play({ soundId: 'jump', channel: 'sfx', duration: 1 });
    const extraSfx = manager.play({ soundId: 'coin', channel: 'sfx', duration: 1 });
    expect(extraSfx.accepted).toBe(false);

    now = 2;
    const finished = manager.update();
    expect(finished.length).toBeGreaterThan(0);
    expect(manager.getActive().length).toBeLessThanOrEqual(2);

    const removed = manager.reset();
    expect(removed.length).toBeGreaterThan(0);
    expect(manager.getActive()).toHaveLength(0);
  });
});
