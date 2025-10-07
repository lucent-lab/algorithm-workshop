import { calculateVirtualRange } from '../src/index.js';

const range = calculateVirtualRange({
  itemCount: 1000,
  itemHeight: 24,
  viewportHeight: 240,
  scrollOffset: 480,
  overscan: 2,
});

console.log(`render ${range.startIndex} to ${range.endIndex}`);
console.log(range.items.slice(0, 3));
