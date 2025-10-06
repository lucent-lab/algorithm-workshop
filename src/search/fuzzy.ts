const BONUS_WORD_START = 10;
const BONUS_CONSECUTIVE = 5;

/**
 * Performs fuzzy search matching with scoring.
 * Useful for: autocomplete suggestions, typo tolerant search, quick filtering.
 */
export function fuzzySearch(query: string, items: string[], limit: number = Infinity): string[] {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array of strings');
  }
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return [];
  }

  const scored: Array<{ item: string; score: number }> = [];
  for (const item of items) {
    const score = fuzzyScore(normalizedQuery, item);
    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.item.localeCompare(b.item));
  return scored.slice(0, limit).map((entry) => entry.item);
}

/**
 * Calculates fuzzy match score between query and target.
 * Useful for: ranking search results, boosting prefix matches, UI filters.
 */
export function fuzzyScore(query: string, target: string): number {
  if (typeof query !== 'string' || typeof target !== 'string') {
    throw new TypeError('query and target must be strings');
  }

  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let score = 0;
  let consecutive = 0;
  let index = 0;

  for (const char of q) {
    const nextIndex = t.indexOf(char, index);
    if (nextIndex === -1) {
      return 0;
    }

    if (nextIndex === 0 || /[^a-z0-9]/i.test(target[nextIndex - 1] ?? '')) {
      score += BONUS_WORD_START;
    }

    if (nextIndex === index) {
      consecutive += 1;
      score += BONUS_CONSECUTIVE * consecutive;
    } else {
      consecutive = 0;
      score += 1 / (nextIndex - index + 1);
    }

    index = nextIndex + 1;
    score += 1;
  }

  return score;
}

export const __internals = { BONUS_WORD_START, BONUS_CONSECUTIVE };
