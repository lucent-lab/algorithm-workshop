import { applyJsonDiff, diffJson, diffJsonAdvanced, flatten, unflatten } from '../src/index.js';

const previous = { status: 'idle', jobs: ['ingest', 'transform'] };
const next = { status: 'running', jobs: ['ingest', 'transform', 'export'] };

const patch = diffJson(previous, next);
const updated = applyJsonDiff(previous, patch);

console.log(patch);
console.log(updated);

const flattened = flatten(updated);
console.log('Flattened:', flattened);
const reconstructed = unflatten(flattened);
console.log('Reconstructed:', reconstructed);

const selectivePatch = diffJsonAdvanced(previous, next, {
  ignoreKeys: ['jobs'],
});
console.log('Selective patch (ignore jobs):', selectivePatch);
