import { deduplicateRequest } from '../src/index.js';

async function expensiveFetch(id: string) {
  console.log('Fetching data for', id);
  return { id, timestamp: Date.now() };
}

async function run() {
  const [first, second] = await Promise.all([
    deduplicateRequest('user:1', () => expensiveFetch('user:1')),
    deduplicateRequest('user:1', () => expensiveFetch('user:1')),
  ]);

  console.log(first === second); // true, same promise result
}

run();
