import { BinaryHeap } from '../src/index.js';

const heap = new BinaryHeap<number>((a, b) => a - b, [5, 1, 4]);
heap.push(3);
console.log('peek', heap.peek());
console.log('pop', heap.pop());
console.log('pop', heap.pop());

