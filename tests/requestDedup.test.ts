import { describe, it, expect, vi } from 'vitest';
import { deduplicateRequest, clearRequestDedup } from '../src/util/requestDedup.js';

describe('deduplicateRequest', () => {
  it('only invokes fetcher once for concurrent calls', async () => {
    clearRequestDedup();
    const fetcher = vi.fn(() => Promise.resolve(42));

    const [a, b] = await Promise.all([
      deduplicateRequest('answer', fetcher),
      deduplicateRequest('answer', fetcher),
    ]);

    expect(a).toBe(42);
    expect(b).toBe(42);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('allows subsequent calls after resolution', async () => {
    clearRequestDedup('data');
    const fetcher = vi.fn(() => Promise.resolve('ok'));

    await deduplicateRequest('data', fetcher);
    await deduplicateRequest('data', fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
