export interface KMPSearchOptions {
  text: string;
  pattern: string;
  caseSensitive?: boolean;
}

export function kmpSearch(options: KMPSearchOptions): number[] {
  const pattern: string = options.caseSensitive ? options.pattern : options.pattern.toLowerCase();
  const text: string = options.caseSensitive ? options.text : options.text.toLowerCase();

  if (pattern.length === 0) {
    return Array.from({ length: options.text.length + 1 }, (_, index): number => index);
  }

  const lps = buildLps(pattern);
  const matches: number[] = [];

  let i = 0;
  let j = 0;
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i += 1;
      j += 1;
      if (j === pattern.length) {
        matches.push(i - j);
        j = lps[j - 1];
      }
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i += 1;
    }
  }

  return matches;
}

function buildLps(pattern: string): number[] {
  const lps = new Array<number>(pattern.length).fill(0);
  let length = 0;
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      length += 1;
      lps[i] = length;
      i += 1;
    } else if (length > 0) {
      length = lps[length - 1];
    } else {
      lps[i] = 0;
      i += 1;
    }
  }
  return lps;
}
