export interface ObjectPoolOptions<T> {
  factory: () => T;
  reset?: (item: T) => void;
  initialSize?: number;
  maxSize?: number;
}

export interface ObjectPool<T> {
  acquire(): T;
  release(item: T): void;
  available(): number;
  size(): number;
}

/**
 * Creates an object pool for reusing allocations.
 * Useful for: performance-critical loops, game entities, temporary buffers.
 */
export function createObjectPool<T>({
  factory,
  reset,
  initialSize = 0,
  maxSize = Number.POSITIVE_INFINITY,
}: ObjectPoolOptions<T>): ObjectPool<T> {
  if (typeof factory !== 'function') {
    throw new Error('factory must be a function.');
  }
  if (initialSize < 0) {
    throw new Error('initialSize must be >= 0.');
  }
  if (maxSize < initialSize) {
    throw new Error('maxSize must be >= initialSize.');
  }

  const freeList: T[] = [];
  for (let i = 0; i < initialSize; i += 1) {
    freeList.push(factory());
  }

  let totalCreated = initialSize;

  function acquire(): T {
    if (freeList.length > 0) {
      return freeList.pop()!;
    }
    if (totalCreated >= maxSize) {
      throw new Error('Object pool depleted and reached maxSize.');
    }
    totalCreated += 1;
    return factory();
  }

  function release(item: T): void {
    if (reset) {
      reset(item);
    }
    freeList.push(item);
  }

  function available(): number {
    return freeList.length;
  }

  function size(): number {
    return totalCreated;
  }

  return { acquire, release, available, size };
}
