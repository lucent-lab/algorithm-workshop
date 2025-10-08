export interface BoyerMooreOptions {
  text: string;
  pattern: string;
  caseSensitive?: boolean;
}

export function boyerMooreSearch(options: BoyerMooreOptions): number[] {
  const pattern = options.caseSensitive ? options.pattern : options.pattern.toLowerCase();
  const text = options.caseSensitive ? options.text : options.text.toLowerCase();

  if (pattern.length === 0) {
    return Array.from({ length: text.length + 1 }, (_, index) => index);
  }
  if (pattern.length > text.length) {
    return [];
  }

  const badChar = buildBadCharacterTable(pattern);
  const goodSuffix = buildGoodSuffixTable(pattern);
  const matches: number[] = [];

  let shift = 0;
  while (shift <= text.length - pattern.length) {
    let index = pattern.length - 1;
    while (index >= 0 && pattern[index] === text[shift + index]) {
      index -= 1;
    }
    if (index < 0) {
      matches.push(shift);
      shift += goodSuffix[0];
    } else {
      const badCharShift = index - (badChar.get(text[shift + index]) ?? -1);
      const goodSuffixShift = goodSuffix[index];
      shift += Math.max(1, Math.max(badCharShift, goodSuffixShift));
    }
  }

  return matches;
}

function buildBadCharacterTable(pattern: string): Map<string, number> {
  const table = new Map<string, number>();
  for (let i = 0; i < pattern.length; i += 1) {
    table.set(pattern[i], i);
  }
  return table;
}

function buildGoodSuffixTable(pattern: string): number[] {
  const length = pattern.length;
  const table = new Array<number>(length).fill(0);
  const suffixes = buildSuffixes(pattern);

  for (let i = 0; i < length; i += 1) {
    table[i] = length - suffixes[0];
  }
  for (let i = 0; i < length - 1; i += 1) {
    const j = length - 1 - suffixes[i];
    table[j] = length - 1 - i;
  }

  return table;
}

function buildSuffixes(pattern: string): number[] {
  const length = pattern.length;
  const suffixes = new Array<number>(length).fill(0);
  suffixes[length - 1] = length;
  let g = length - 1;
  let f = 0;
  for (let i = length - 2; i >= 0; i -= 1) {
    if (i > g && suffixes[i + length - 1 - f] < i - g) {
      suffixes[i] = suffixes[i + length - 1 - f];
    } else {
      if (i < g) {
        g = i;
      }
      f = i;
      while (g >= 0 && pattern[g] === pattern[g + length - 1 - f]) {
        g -= 1;
      }
      suffixes[i] = f - g;
    }
  }
  return suffixes;
}

