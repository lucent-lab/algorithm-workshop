export interface SuffixArrayOptions {
  text: string;
  caseSensitive?: boolean;
}

export interface SuffixArrayResult {
  suffixArray: number[];
  lcpArray: number[];
}

export function buildSuffixArray(options: SuffixArrayOptions): SuffixArrayResult {
  const text = options.caseSensitive ? options.text : options.text.toLowerCase();
  const n = text.length;
  const suffixArray = new Array<number>(n);
  const ranks = new Array<number>(n);
  const temp = new Array<number>(n);

  for (let i = 0; i < n; i += 1) {
    suffixArray[i] = i;
    ranks[i] = text.charCodeAt(i);
  }

  for (let k = 1; k < n; k <<= 1) {
    suffixArray.sort((a, b) => {
      if (ranks[a] !== ranks[b]) {
        return ranks[a] - ranks[b];
      }
      const rankA = a + k < n ? ranks[a + k] : -1;
      const rankB = b + k < n ? ranks[b + k] : -1;
      return rankA - rankB;
    });

    temp[suffixArray[0]] = 0;
    for (let i = 1; i < n; i += 1) {
      temp[suffixArray[i]] = temp[suffixArray[i - 1]] + (compareSuffix(suffixArray[i - 1], suffixArray[i], k) ? 1 : 0);
    }
    for (let i = 0; i < n; i += 1) {
      ranks[i] = temp[i];
    }
    if (ranks[suffixArray[n - 1]] === n - 1) {
      break;
    }
  }

  const lcpArray = buildLCPArray(text, suffixArray);
  return { suffixArray, lcpArray };

  function compareSuffix(a: number, b: number, k: number): boolean {
    if (ranks[a] !== ranks[b]) {
      return true;
    }
    const rankA = a + k < n ? ranks[a + k] : -1;
    const rankB = b + k < n ? ranks[b + k] : -1;
    return rankA !== rankB;
  }
}

function buildLCPArray(text: string, suffixArray: number[]): number[] {
  const n = text.length;
  const rank = new Array<number>(n);
  for (let i = 0; i < n; i += 1) {
    rank[suffixArray[i]] = i;
  }
  const lcp = new Array<number>(Math.max(0, n - 1)).fill(0);
  let k = 0;
  for (let i = 0; i < n; i += 1) {
    if (rank[i] === n - 1) {
      k = 0;
      continue;
    }
    const j = suffixArray[rank[i] + 1];
    while (i + k < n && j + k < n && text[i + k] === text[j + k]) {
      k += 1;
    }
    lcp[rank[i]] = k;
    if (k > 0) {
      k -= 1;
    }
  }
  return lcp;
}

