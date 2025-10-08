import { createInputManager } from '../src/index.js';

let now = 0;

const input = createInputManager({
  getTime: () => now,
  actions: [
    {
      id: 'jump',
      bindings: [
        { device: 'keyboard', key: 'Space' },
        { device: 'gamepad-button', button: 0 },
      ],
    },
    {
      id: 'fire',
      bindings: [{ device: 'mouse', button: 0 }],
    },
    {
      id: 'move-horizontal',
      type: 'analog',
      bindings: [{ device: 'gamepad-axis', axis: 0, direction: 'both', threshold: 0.2 }],
    },
  ],
});

function advance(time: number): void {
  now += time;
}

input.handleKeyEvent({ type: 'down', key: 'Space' });
console.log('Jump active:', input.isActive('jump'));
input.handleKeyEvent({ type: 'up', key: 'Space' });

input.handlePointerEvent({ type: 'down', button: 0 });
console.log('Fire active:', input.isActive('fire'));
input.handlePointerEvent({ type: 'up', button: 0 });

input.handleGamepadAxis({ axis: 0, value: 0.1 });
console.log('Move horizontal value (deadzone):', input.getValue('move-horizontal'));

input.handleGamepadAxis({ axis: 0, value: 0.6 });
console.log('Move horizontal value:', input.getValue('move-horizontal'));

advance(0.5);
input.setBindings('jump', [{ device: 'keyboard', key: 'KeyZ' }]);
input.handleKeyEvent({ type: 'down', key: 'KeyZ' });
console.log('Jump remapped active:', input.isActive('jump'));
