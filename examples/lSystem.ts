import { generateLSystem } from '../src/index.js';

const { result, history } = generateLSystem({
  axiom: 'F',
  iterations: 4,
  rules: {
    F: 'F+F−F−F+F',
  },
  trackHistory: true,
});

console.log('Final string length:', result.length);
console.log('History states:', history.length);
console.log('Final preview:', result.slice(0, 60));
