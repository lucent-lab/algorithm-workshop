import { cubicBezier, easing, quadraticBezier } from '../src/index.js';

console.log('Ease-out cubic at 0.5:', easing.easeOutCubic(0.5));
console.log('Quadratic Bézier sample:', quadraticBezier({ x: 0, y: 0 }, { x: 10, y: 15 }, { x: 20, y: 0 }, 0.3));
console.log('Cubic Bézier sample:', cubicBezier(
  { x: 0, y: 0 },
  { x: 10, y: 20 },
  { x: 20, y: 20 },
  { x: 30, y: 0 },
  0.6
));
