import { afterEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../src/util/debounce.js';
import { throttle } from '../src/util/throttle.js';

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('debounce', () => {
  it('delays execution until inactivity window closes', () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced('first');
    vi.advanceTimersByTime(50);
    debounced('second');
    vi.advanceTimersByTime(99);

    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('second');
  });

  it('throws when provided invalid arguments', () => {
    expect(() => debounce(undefined as unknown as () => void, 10)).toThrow(TypeError);
    expect(() => debounce(() => undefined, -1)).toThrow(TypeError);
  });
});

describe('throttle', () => {
  it('limits call frequency while preserving trailing args', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('initial');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('initial');

    throttled('second');
    expect(spy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(90);
    throttled('third');
    expect(spy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('third');
  });

  it('clears pending timer when limit elapsed before flush', () => {
    vi.useFakeTimers();
    const nowSpy = vi.spyOn(Date, 'now');
    let current = 1_000;
    nowSpy.mockImplementation(() => current);

    const spy = vi.fn();
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const throttled = throttle(spy, 100);

    throttled('first');
    expect(spy).toHaveBeenCalledTimes(1);

    throttled('second');
    expect(spy).toHaveBeenCalledTimes(1);

    current = 1_200;
    throttled('third');

    expect(clearSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('third');
  });

  it('throws when provided invalid arguments', () => {
    expect(() => throttle(undefined as unknown as () => void, 10)).toThrow(TypeError);
    expect(() => throttle(() => undefined, -1)).toThrow(TypeError);
  });
});
