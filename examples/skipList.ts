import { SkipList } from '../src/index.js';

const sl = new SkipList<number>({ seed: 2024 });
[5, 1, 9, 3, 7].forEach((x) => sl.insert(x));
console.log('has 3?', sl.has(3));
console.log('values:', Array.from(sl.values()));

