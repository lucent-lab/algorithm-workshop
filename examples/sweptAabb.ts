import { sweptAABB } from '../src/index.js';

const moving = { x: 0, y: 0, width: 1, height: 1, velocity: { x: 4, y: 2 } };
const target = { x: 3, y: 1, width: 2, height: 2 };

const result = sweptAABB(moving, target);
console.log(result);
