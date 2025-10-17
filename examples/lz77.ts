import { lz77Compress, lz77Decompress } from '../src/index.js';

const input = 'abracadabra abracadabra';
const tokens = lz77Compress(input, { windowSize: 12, lookaheadSize: 8 });
console.log(tokens);
console.log(lz77Decompress(tokens));
