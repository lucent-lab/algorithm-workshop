export type DiffOperation<T> =
  | { type: 'insert'; value: T }
  | { type: 'remove'; value: T }
  | { type: 'equal'; value: T };

/**
 * Computes difference operations between two arrays using Longest Common Subsequence.
 * Useful for: UI reconciliation, change detection, synchronization visualisation.
 */
export function diff<T>(
  oldArray: readonly T[],
  newArray: readonly T[],
  keyFn: (item: T) => unknown = (value) => value
): DiffOperation<T>[] {
  const m = oldArray.length;
  const n = newArray.length;
  const table = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      const oldValue = oldArray[i];
      const newValue = newArray[j];
      if (oldValue === undefined || newValue === undefined) {
        continue;
      }

      if (keyFn(oldValue) === keyFn(newValue)) {
        table[i][j] = table[i + 1][j + 1] + 1;
      } else {
        table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }

  const result: DiffOperation<T>[] = [];
  let i = 0;
  let j = 0;

  while (i < m && j < n) {
    const oldValue = oldArray[i];
    const newValue = newArray[j];
    if (oldValue !== undefined && newValue !== undefined && keyFn(oldValue) === keyFn(newValue)) {
      result.push({ type: 'equal', value: oldValue });
      i += 1;
      j += 1;
      continue;
    }

    if (table[i + 1][j] >= table[i][j + 1]) {
      if (oldValue !== undefined) {
        result.push({ type: 'remove', value: oldValue });
      }
      i += 1;
    } else {
      if (newValue !== undefined) {
        result.push({ type: 'insert', value: newValue });
      }
      j += 1;
    }
  }

  while (i < m) {
    const remaining = oldArray[i];
    if (remaining !== undefined) {
      result.push({ type: 'remove', value: remaining });
    }
    i += 1;
  }

  while (j < n) {
    const remaining = newArray[j];
    if (remaining !== undefined) {
      result.push({ type: 'insert', value: remaining });
    }
    j += 1;
  }

  return result;
}
