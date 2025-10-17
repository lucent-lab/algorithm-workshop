import { huffmanEncode, huffmanDecode, createHuffmanTable } from '../src/index.js';

const input = 'hello huffman';
const table = createHuffmanTable(input);

const { bitString } = huffmanEncode(input);
const decoded = huffmanDecode(bitString, table);

console.log('bits', bitString);
console.log('roundtrip', decoded);
