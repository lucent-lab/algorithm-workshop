import { base64Encode, base64Decode } from '../src/index.js';

const s = 'Hello, 世界! 🎉';
const b64 = base64Encode(s);
console.log('b64:', b64);
console.log('utf8:', new TextDecoder().decode(base64Decode(b64)));

