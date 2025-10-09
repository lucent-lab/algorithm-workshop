import { BloomFilter } from '../src/index.js';

// Create a Bloom filter for ~1000 items with ~1% false positive rate
const bf = BloomFilter.fromCapacity(1000, 0.01, 42);

bf.add('apple');
bf.add('banana');
bf.add('cherry');

console.log('has apple?', bf.has('apple'));
console.log('has grape?', bf.has('grape'));

