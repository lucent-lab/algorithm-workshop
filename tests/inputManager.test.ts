import { describe, expect, it } from 'vitest';

import { createInputManager } from '../src/index.js';

describe('createInputManager', () => {
  it('tracks digital inputs and remaps actions', () => {
    let now = 0;
    const manager = createInputManager({
      getTime: () => now,
      actions: [
        {
          id: 'jump',
          bindings: [
            { device: 'keyboard', key: 'Space' },
            { device: 'gamepad-button', button: 0 },
          ],
        },
        { id: 'fire', bindings: [{ device: 'mouse', button: 0 }] },
      ],
    });

    expect(manager.isActive('jump')).toBe(false);

    manager.handleKeyEvent({ type: 'down', key: 'Space', time: now });
    expect(manager.isActive('jump')).toBe(true);
    expect(manager.getValue('jump')).toBe(1);

    manager.handleKeyEvent({ type: 'up', key: 'Space', time: now });
    expect(manager.isActive('jump')).toBe(false);

    manager.handlePointerEvent({ type: 'down', button: 0, time: now });
    expect(manager.isActive('fire')).toBe(true);
    manager.handlePointerEvent({ type: 'up', button: 0, time: now });

    manager.setBindings('jump', [{ device: 'keyboard', key: 'KeyZ' }]);
    manager.handleKeyEvent({ type: 'down', key: 'Space', time: now });
    expect(manager.isActive('jump')).toBe(false);

    now = 1;
    manager.handleKeyEvent({ type: 'down', key: 'KeyZ', time: now });
    expect(manager.isActive('jump')).toBe(true);
    expect(manager.getState('jump')?.changedAt).toBe(now);

    manager.reset();
    expect(manager.isActive('jump')).toBe(false);
  });

  it('handles analog gamepad axis updates with thresholds', () => {
    let now = 0;
    const manager = createInputManager({
      getTime: () => now,
      defaultAxisThreshold: 0.2,
      actions: [
        {
          id: 'move-horizontal',
          type: 'analog',
          bindings: [{ device: 'gamepad-axis', axis: 0, direction: 'both', threshold: 0.25 }],
        },
      ],
    });

    manager.handleGamepadAxis({ axis: 0, value: 0.1, time: now });
    expect(manager.isActive('move-horizontal')).toBe(false);
    expect(manager.getValue('move-horizontal')).toBe(0);

    now = 1;
    manager.handleGamepadAxis({ axis: 0, value: 0.6, time: now });
    expect(manager.isActive('move-horizontal')).toBe(true);
    expect(manager.getValue('move-horizontal')).toBeCloseTo(0.6, 5);
    expect(manager.getState('move-horizontal')?.changedAt).toBe(now);

    now = 2;
    manager.handleGamepadAxis({ axis: 0, value: -0.7, time: now });
    expect(manager.getValue('move-horizontal')).toBeCloseTo(-0.7, 5);

    now = 3;
    manager.handleGamepadAxis({ axis: 0, value: 0.05, time: now });
    expect(manager.isActive('move-horizontal')).toBe(false);
    expect(manager.getValue('move-horizontal')).toBe(0);
  });
});
