import { applyJsonDiff, diffJson } from '../src/index.js';

const previous = { status: 'idle', jobs: ['ingest', 'transform'] };
const next = { status: 'running', jobs: ['ingest', 'transform', 'export'] };

const patch = diffJson(previous, next);
const updated = applyJsonDiff(previous, patch);

console.log(patch);
console.log(updated);
