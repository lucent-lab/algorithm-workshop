import { runLengthEncode, runLengthDecode } from '../src/index.js';

const s = 'AAAABBBCCDAA';
const pairs = runLengthEncode(s);
console.log('pairs', pairs);
console.log('decoded', runLengthDecode(pairs));

