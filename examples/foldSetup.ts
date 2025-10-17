import { createFoldConstraintRegistry } from '../src/index.js';

const registry = createFoldConstraintRegistry();

registry.register({
  type: 'cubic-barrier',
  create(config: { stiffness: number }) {
    return {
      type: 'cubic-barrier',
      enabled: true,
      evaluate(state) {
        const stiffness = config.stiffness;
        return {
          energy: stiffness * state.gap ** 2,
          gradient: { x: 0, y: 0, z: 0 },
          hessian: [
            [stiffness, 0, 0],
            [0, stiffness, 0],
            [0, 0, stiffness],
          ],
        };
      },
    };
  },
});

console.log(registry.list().length);
