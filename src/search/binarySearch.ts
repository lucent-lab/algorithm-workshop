/**
 * Binary search on sorted arrays.
 * Useful for: fast membership tests, ordered data lookups, lower/upper bound queries.
 */
export function binarySearch<T>(
  array: readonly T[],
  target: T,
  compareFn: (a: T, b: T) => number = defaultComparator
): number {
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const candidate = array[mid];
    if (candidate === undefined) {
      break;
    }
    const cmp = compareFn(candidate, target);
    if (cmp === 0) {
      return mid;
    }
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

function defaultComparator<T>(a: T, b: T): number {
  if (a === b) {
    return 0;
  }
  const valueA = a as unknown;
  const valueB = b as unknown;

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA < valueB ? -1 : 1;
  }
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA < valueB ? -1 : 1;
  }

  const stringA = String(valueA);
  const stringB = String(valueB);
  if (stringA === stringB) {
    return 0;
  }
  return stringA < stringB ? -1 : 1;
}

export const __internals = { defaultComparator };
