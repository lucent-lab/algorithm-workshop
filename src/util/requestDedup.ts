const inflight = new Map<string, Promise<unknown>>();

/**
 * Deduplicates concurrent async requests keyed by identifier.
 * Useful for: preventing duplicate API calls, consolidating cache refreshes, batching UI fetches.
 */
export function deduplicateRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('key must be a non-empty string.');
  }
  if (typeof fetcher !== 'function') {
    throw new TypeError('fetcher must be a function returning a promise.');
  }

  if (!inflight.has(key)) {
    const promise = Promise.resolve()
      .then(fetcher)
      .finally(() => {
        inflight.delete(key);
      });
    inflight.set(key, promise);
  }

  return inflight.get(key) as Promise<T>;
}

/**
 * Clears cached inflight promise for a specific key or the entire store.
 * Useful for: retries, cancelling stale requests, testing hooks.
 */
export function clearRequestDedup(key?: string): void {
  if (typeof key === 'string') {
    inflight.delete(key);
    return;
  }
  inflight.clear();
}

export const __internals = {
  inflight,
};
