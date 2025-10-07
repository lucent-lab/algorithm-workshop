import { waveFunctionCollapse } from '../src/index.js';

const tiles = [
  {
    id: 'grass',
    weight: 3,
    rules: {
      top: ['grass'],
      right: ['grass', 'road'],
      bottom: ['grass'],
      left: ['grass', 'road'],
    },
  },
  {
    id: 'road',
    weight: 1,
    rules: {
      top: ['grass', 'road'],
      right: ['grass', 'road'],
      bottom: ['grass', 'road'],
      left: ['grass', 'road'],
    },
  },
];

const result = waveFunctionCollapse({ width: 5, height: 5, tiles, seed: 123 });
console.log(result.map((row) => row.join(' ')).join('\n'));
