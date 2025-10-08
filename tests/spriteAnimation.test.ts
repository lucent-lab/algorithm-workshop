import { describe, expect, it } from 'vitest';

import { createSpriteAnimation } from '../src/index.js';

describe('createSpriteAnimation', () => {
  it('loops through frames and emits events', () => {
    const controller = createSpriteAnimation({
      frames: [
        { frame: 'idle-0', duration: 0.1, events: ['spawn'] },
        { frame: 'idle-1', duration: 0.2 },
      ],
      playOnStart: false,
    });

    const events: string[] = [];
    controller.on('frame-enter', (event) => {
      events.push(`frame:${event.frame.frame}`);
    });
    controller.on('spawn', () => {
      events.push('spawn');
    });
    controller.on('loop', (event) => {
      events.push(`loop:${event.loopCount}`);
    });

    controller.play();
    controller.reset();
    expect(events).toEqual(['frame:idle-0', 'spawn']);

    events.length = 0;
    controller.update(0.1);
    expect(events).toEqual(['frame:idle-1']);

    events.length = 0;
    controller.update(0.2);
    expect(events).toEqual(['loop:1', 'frame:idle-0', 'spawn']);
    expect(controller.getLoopCount()).toBe(1);
    expect(controller.getFrame().frame).toBe('idle-0');
  });

  it('stops in once mode and emits complete', () => {
    const controller = createSpriteAnimation({
      frames: [
        { frame: 0, duration: 0.1 },
        { frame: 1, duration: 0.1 },
      ],
      mode: 'once',
      playOnStart: false,
    });

    let completed = false;
    controller.on('complete', () => {
      completed = true;
    });

    controller.play();
    controller.reset();
    controller.update(0.2);
    expect(controller.isFinished()).toBe(true);
    expect(controller.isPlaying()).toBe(false);
    expect(completed).toBe(true);
    expect(controller.getFrame().frame).toBe(1);
  });

  it('ping-pong mode reverses direction', () => {
    const controller = createSpriteAnimation({
      frames: [
        { frame: 'a', duration: 0.1 },
        { frame: 'b', duration: 0.1 },
        { frame: 'c', duration: 0.1 },
      ],
      mode: 'ping-pong',
      playOnStart: false,
    });

    controller.play();
    controller.reset();

    const indices: number[] = [controller.getFrameIndex()];
    controller.update(0.1);
    indices.push(controller.getFrameIndex());
    controller.update(0.1);
    indices.push(controller.getFrameIndex());
    controller.update(0.1);
    indices.push(controller.getFrameIndex());
    controller.update(0.1);
    indices.push(controller.getFrameIndex());

    expect(indices).toEqual([0, 1, 2, 1, 0]);
    expect(controller.getLoopCount()).toBeGreaterThan(0);
  });

  it('validates inputs and setters', () => {
    expect(() =>
      createSpriteAnimation({
        frames: [{ frame: 'oops', duration: 0 }],
      })
    ).toThrow(/duration/);

    const controller = createSpriteAnimation({
      frames: [{ frame: 0, duration: 0.1 }],
      playOnStart: false,
    });

    expect(() => controller.update(-0.1)).toThrow(/delta/);
    expect(() => controller.setSpeed(-1)).toThrow(/speed/);
    expect(() => controller.on('', () => {})).toThrow(/event name/);

    controller.setSpeed(2);
    controller.setMode('loop');
    controller.play();
    controller.reset();
    expect(controller.isPlaying()).toBe(true);
  });
});
