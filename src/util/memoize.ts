/**
 * Memoizes the result of a pure function based on its arguments.
 * Useful for: dynamic programming caches, expensive deterministic calculations, React selectors.
 */
export function memoize<TArgs extends unknown[], TResult>(
  func: (...args: TArgs) => TResult
): ((...args: TArgs) => TResult) & { clear(): void } {
  if (typeof func !== 'function') {
    throw new TypeError('func must be a function');
  }

  const cache = new Map<string, TResult>();

  function memoized(this: unknown, ...args: TArgs): TResult {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as TResult;
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  }

  memoized.clear = () => cache.clear();
  return memoized as ((...args: TArgs) => TResult) & { clear(): void };
}
