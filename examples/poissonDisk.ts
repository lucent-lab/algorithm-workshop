import { poissonDiskSampling } from '../src/index.js';

const points = poissonDiskSampling({
  width: 100,
  height: 60,
  radius: 8,
  seed: 7,
});

console.log('Sample count:', points.length);
console.log('First five samples:', points.slice(0, 5));
