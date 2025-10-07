import { createDeltaTimeManager } from '../src/index.js';

const manager = createDeltaTimeManager({ smoothing: 2, maxDelta: 0.05 });

console.log('Delta 0:', manager.update(0));
console.log('Delta 1:', manager.update(16));
console.log('Delta 2:', manager.update(32));
