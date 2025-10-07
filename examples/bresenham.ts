import { bresenhamLine } from '../src/index.js';

const cells = bresenhamLine({ x: 2, y: 3 }, { x: 10, y: 7 });
console.log(cells);
