import { describe, expect, it } from 'vitest';

import { createDeltaTimeManager } from '../src/index.js';

describe('createDeltaTimeManager', () => {
  it('clamps delta by maxDelta and smooths samples', () => {
    const manager = createDeltaTimeManager({ maxDelta: 0.05, smoothing: 2 });
    expect(manager.update(0)).toBe(0);
    expect(manager.update(10)).toBeCloseTo(0.01, 5);
    expect(manager.update(200)).toBeCloseTo(0.03, 5); // (0.01 + clamp 0.05) /2
    expect(manager.getDelta()).toBeCloseTo(0.03, 5);
  });

  it('reset clears internal state', () => {
    const manager = createDeltaTimeManager();
    manager.update(0);
    manager.update(16);
    manager.reset();
    expect(manager.getDelta()).toBe(0);
    expect(manager.update(100)).toBe(0);
  });

  it('validates options and inputs', () => {
    expect(() => createDeltaTimeManager({ maxDelta: 0 })).toThrow(/greater than zero/i);
    expect(() => createDeltaTimeManager({ smoothing: 0 })).toThrow(/>= 1/i);
    expect(() => createDeltaTimeManager({ smoothing: 1.5 })).toThrow(/integer/i);

    const manager = createDeltaTimeManager();
    expect(() => manager.update(Number.NaN)).toThrow(/finite number/i);
  });
});
