/**
 * Computes Levenshtein edit distance between two strings.
 * Useful for: spell correction, fuzzy matching, DNA sequence analysis.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('Both inputs must be strings');
  }

  if (a === b) {
    return 0;
  }

  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i += 1) {
    const current = new Array<number>(b.length + 1);
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const insertion = current[j - 1] !== undefined ? current[j - 1] + 1 : Number.POSITIVE_INFINITY;
      const deletion = previous[j] !== undefined ? previous[j] + 1 : Number.POSITIVE_INFINITY;
      const substitution =
        previous[j - 1] !== undefined ? previous[j - 1] + cost : Number.POSITIVE_INFINITY;
      current[j] = Math.min(insertion, deletion, substitution);
    }
    previous = current;
  }

  const result = previous[b.length];
  if (result === undefined) {
    throw new Error('Levenshtein computation failed to produce a result.');
  }
  return result;
}
