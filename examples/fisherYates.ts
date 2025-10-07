import { fisherYatesShuffle } from '../src/index.js';

const rng = () => 0.42;
const items = ['a', 'b', 'c', 'd'];
console.log('Original:', items);
fisherYatesShuffle(items, { random: rng });
console.log('Shuffled:', items);
