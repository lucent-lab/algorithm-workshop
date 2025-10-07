import { afterEach, describe, expect, it, vi } from 'vitest';

import { createFixedTimestepLoop } from '../src/index.js';

const originalRAF = globalThis.requestAnimationFrame;
const originalCancel = globalThis.cancelAnimationFrame;

afterEach(() => {
  globalThis.requestAnimationFrame = originalRAF;
  globalThis.cancelAnimationFrame = originalCancel;
});

describe('createFixedTimestepLoop', () => {
  it('invokes update multiple times based on accumulated delta', () => {
    let storedCallback: FrameRequestCallback | undefined;
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      storedCallback = cb;
      return 1;
    });
    globalThis.cancelAnimationFrame = vi.fn();

    let updates = 0;
    const loop = createFixedTimestepLoop({
      step: 0.1,
      update: () => {
        updates += 1;
      },
    });

    loop.start();
    expect(storedCallback).toBeDefined();
    storedCallback?.(0);
    storedCallback?.(300); // 0.3 seconds -> 3 updates
    expect(updates).toBe(3);
    loop.stop();
  });

  it('caps delta by maxDelta to avoid spiral', () => {
    const callbacks: FrameRequestCallback[] = [];
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      callbacks.push(cb);
      return callbacks.length;
    });
    globalThis.cancelAnimationFrame = vi.fn();

    let totalElapsed = 0;
    const loop = createFixedTimestepLoop({
      step: 0.1,
      maxDelta: 0.3,
      update: ({ elapsed }) => {
        totalElapsed += elapsed;
      },
    });

    loop.start();
    expect(callbacks.length).toBeGreaterThan(0);
    callbacks[0]?.(0);
    callbacks[1]?.(1000);
    expect(totalElapsed).toBeCloseTo(0.3, 5);
    loop.stop();
  });
});
