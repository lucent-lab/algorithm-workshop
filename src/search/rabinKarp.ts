export interface RabinKarpOptions {
  text: string;
  patterns: ReadonlyArray<string>;
  prime?: number;
  base?: number;
  caseSensitive?: boolean;
}

export function rabinKarp(options: RabinKarpOptions): Record<string, number[]> {
  validateOptions(options);
  const base = options.base ?? 257;
  const prime = options.prime ?? 1_000_000_007;
  const texts = options.caseSensitive ? options.text : options.text.toLowerCase();
  const patterns = options.caseSensitive
    ? options.patterns
    : options.patterns.map((pattern) => pattern.toLowerCase());

  const uniqueLengths = new Set(patterns.map((pattern) => pattern.length).filter((length) => length > 0));
  const results: Record<string, number[]> = {};
  for (const pattern of options.patterns) {
    results[pattern] = [];
  }

  const groupedPatterns = groupPatterns(patterns, options.patterns);

  for (const length of uniqueLengths) {
    const group = groupedPatterns.get(length);
    if (!group) {
      continue;
    }
    const power = modPow(base, length - 1, prime);
    const targetHashes = new Map<number, string[]>();
    for (const { normalized, original } of group) {
      const hash = rollingHash(normalized, base, prime);
      const list = targetHashes.get(hash) ?? [];
      list.push(original);
      targetHashes.set(hash, list);
    }

    let windowHash = rollingHash(texts.slice(0, length), base, prime);
    compareWindow(0, length, windowHash, targetHashes, options.text, options.caseSensitive, results);

    for (let i = length; i < texts.length; i += 1) {
      const outgoing = texts.charCodeAt(i - length);
      const incoming = texts.charCodeAt(i);
      windowHash = roll(windowHash, outgoing, incoming, base, prime, power);
      compareWindow(i - length + 1, length, windowHash, targetHashes, options.text, options.caseSensitive, results);
    }
  }

  if (patterns.some((pattern) => pattern.length === 0)) {
    const allPositions = Array.from({ length: options.text.length + 1 }, (_, index) => index);
    for (const pattern of options.patterns) {
      if (pattern.length === 0) {
        results[pattern] = allPositions.slice();
      }
    }
  }

  return results;
}

function compareWindow(
  start: number,
  size: number,
  hash: number,
  targetHashes?: Map<number, string[]>,
  text?: string,
  caseSensitive?: boolean,
  results?: Record<string, number[]>
): void {
  if (!targetHashes || !text || !results) {
    return;
  }
  const candidates = targetHashes.get(hash);
  if (!candidates) {
    return;
  }
  const fragment = text.substr(start, size);
  for (const pattern of candidates) {
    if (match(fragment, pattern, caseSensitive ?? true)) {
      results[pattern].push(start);
    }
  }
}

function groupPatterns(
  patterns: ReadonlyArray<string>,
  originals: ReadonlyArray<string>
): Map<number, Array<{ normalized: string; original: string }>> {
  const groups = new Map<number, Array<{ normalized: string; original: string }>>();
  patterns.forEach((pattern, index) => {
    if (pattern.length === 0) {
      return;
    }
    const list = groups.get(pattern.length) ?? [];
    list.push({ normalized: pattern, original: originals[index] });
    groups.set(pattern.length, list);
  });
  return groups;
}

function rollingHash(value: string, base: number, prime: number): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * base + value.charCodeAt(i)) % prime;
  }
  return hash;
}

function roll(hash: number, outgoing: number, incoming: number, base: number, prime: number, power: number): number {
  let next = (hash + prime - (outgoing * power) % prime) % prime;
  next = (next * base + incoming) % prime;
  return next;
}

function modPow(base: number, exponent: number, prime: number): number {
  let result = 1;
  let b = base % prime;
  let e = exponent;
  while (e > 0) {
    if (e & 1) {
      result = (result * b) % prime;
    }
    b = (b * b) % prime;
    e >>= 1;
  }
  return result;
}

function match(fragment: string, pattern: string, caseSensitive: boolean): boolean {
  if (!caseSensitive) {
    return fragment.toLowerCase() === pattern.toLowerCase();
  }
  return fragment === pattern;
}

function validateOptions(options: RabinKarpOptions): void {
  if (typeof options.text !== 'string') {
    throw new Error('text must be a string.');
  }
  if (!Array.isArray(options.patterns) || options.patterns.length === 0) {
    throw new Error('patterns must contain at least one pattern.');
  }
  if (options.base !== undefined && options.base <= 1) {
    throw new Error('base must be greater than 1.');
  }
  if (options.prime !== undefined && options.prime <= 0) {
    throw new Error('prime must be positive.');
  }
}
