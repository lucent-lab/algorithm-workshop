/**
 * Creates a throttled version of a function that enforces execution rate.
 * Useful for: scroll events, pointer tracking, real-time analytics streaming.
 */
export function throttle<TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  limit: number
): (...args: TArgs) => void {
  if (typeof func !== 'function') {
    throw new TypeError('func must be a function');
  }
  if (typeof limit !== 'number' || limit < 0) {
    throw new TypeError('limit must be a non-negative number');
  }

  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let trailingArgs: TArgs | null = null;

  const invoke = (context: unknown, args: TArgs) => {
    lastCall = Date.now();
    timeoutId = null;
    trailingArgs = null;
    func.apply(context, args);
  };

  return function throttled(this: unknown, ...args: TArgs) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      invoke(this, args);
      return;
    }

    trailingArgs = args;
    if (!timeoutId) {
      timeoutId = setTimeout(() => invoke(this, trailingArgs ?? args), remaining);
    }
  };
}
