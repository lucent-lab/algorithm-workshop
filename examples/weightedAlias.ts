import { createWeightedAliasSampler } from '../src/index.js';

const sampler = createWeightedAliasSampler([
  { value: 'common', weight: 70 },
  { value: 'rare', weight: 25 },
  { value: 'legendary', weight: 5 },
]);

const random = () => 0.42; // deterministic example
console.log('Sampled value:', sampler.sample(random));
