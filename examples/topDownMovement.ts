import { createTopDownController } from '../src/index.js';

const controller = createTopDownController({
  acceleration: 20,
  deceleration: 18,
  maxSpeed: 6,
  drag: 0.1,
});

for (let frame = 0; frame < 10; frame += 1) {
  const angle = (frame / 10) * Math.PI * 2;
  const input = { x: Math.cos(angle), y: Math.sin(angle) };
  const state = controller.update({ delta: 1 / 30, input });
  console.log(
    `frame ${frame}: position=(${state.position.x.toFixed(2)}, ${state.position.y.toFixed(2)}) velocity=(${state.velocity.x.toFixed(2)}, ${state.velocity.y.toFixed(2)})`
  );
}
