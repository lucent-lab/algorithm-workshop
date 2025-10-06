/**
 * Groups array items by property or selector function.
 * Useful for: aggregating datasets, building lookup tables, data visualisations.
 */
export function groupBy<T extends Record<string, unknown>>(
  array: readonly T[],
  key: keyof T
): Record<string, T[]>;
export function groupBy<T>(array: readonly T[], selector: (item: T) => string): Record<string, T[]>;
export function groupBy<T>(
  array: readonly T[],
  selectorOrKey: keyof T | ((item: T) => string)
): Record<string, T[]> {
  if (!Array.isArray(array)) {
    throw new TypeError('array must be an array');
  }

  const selector: (item: T) => string =
    typeof selectorOrKey === 'function'
      ? selectorOrKey
      : (item: T) => String((item as Record<PropertyKey, unknown>)[selectorOrKey as PropertyKey]);

  return groupByInternal(array, selector);
}

function groupByInternal<T>(array: readonly T[], selector: (item: T) => string): Record<string, T[]> {
  const groupedMap = new Map<string, T[]>();

  for (const item of array) {
    const groupKey = selector(item);
    const bucket = groupedMap.get(groupKey);
    if (bucket) {
      bucket.push(item);
    } else {
      groupedMap.set(groupKey, [item]);
    }
  }

  const result: Record<string, T[]> = {};
  for (const [groupKey, values] of groupedMap.entries()) {
    result[groupKey] = values;
  }

  return result;
}
