import { createPlatformerController } from '../src/index.js';

const controller = createPlatformerController({
  acceleration: 40,
  deceleration: 30,
  maxSpeed: 6,
  gravity: 30,
  jumpVelocity: 12,
  coyoteTime: 0.1,
  jumpBufferTime: 0.1,
});

let onGround = true;

for (let frame = 0; frame < 10; frame += 1) {
  const input = {
    move: frame < 5 ? 1 : 0,
    jump: frame === 0,
  };

  const state = controller.update({
    delta: 1 / 60,
    input,
    onGround,
  });

  // Simulate leaving the ground after the first update.
  onGround = frame === 0;

  console.log(`frame ${frame}: pos=(${state.position.x.toFixed(2)}, ${state.position.y.toFixed(2)}) velocity=(${state.velocity.x.toFixed(2)}, ${state.velocity.y.toFixed(2)})`);
}
