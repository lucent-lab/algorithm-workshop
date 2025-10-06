/**
 * Returns a debounced version of a function that delays execution until inactivity.
 * Useful for: input validation, resize listeners, API autocomplete.
 */
export function debounce<TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  wait: number
): (...args: TArgs) => void {
  if (typeof func !== 'function') {
    throw new TypeError('func must be a function');
  }
  if (typeof wait !== 'number' || wait < 0) {
    throw new TypeError('wait must be a non-negative number');
  }

  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(this: unknown, ...args: TArgs) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(this, args);
    }, wait);
  };
}
