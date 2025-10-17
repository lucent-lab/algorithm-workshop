export interface Lz77Token {
  offset: number;
  length: number;
  next: string;
}

export interface Lz77Options {
  windowSize?: number;
  lookaheadSize?: number;
}

export function lz77Compress(input: string, options: Lz77Options = {}): Lz77Token[] {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string.');
  }
  const windowSize = Math.max(1, Math.floor(options.windowSize ?? 32));
  const lookaheadSize = Math.max(1, Math.floor(options.lookaheadSize ?? 16));
  const tokens: Lz77Token[] = [];
  let position = 0;

  while (position < input.length) {
    const windowStart = Math.max(0, position - windowSize);
    const window = input.slice(windowStart, position);
    let bestOffset = 0;
    let bestLength = 0;

    for (let offset = 1; offset <= window.length; offset += 1) {
      let matchLength = 0;
      while (
        matchLength < lookaheadSize &&
        position + matchLength < input.length &&
        window[window.length - offset + (matchLength % offset)] === input[position + matchLength]
      ) {
        matchLength += 1;
      }
      if (matchLength > bestLength) {
        bestLength = matchLength;
        bestOffset = offset;
      }
    }

    const nextChar = input[position + bestLength] ?? '';
    tokens.push({ offset: bestOffset, length: bestLength, next: nextChar });
    position += bestLength + 1;
  }

  return tokens;
}

export function lz77Decompress(tokens: ReadonlyArray<Lz77Token>): string {
  let output = '';
  for (const token of tokens) {
    if (!token) continue;
    const { offset, length, next } = token;
    if (offset < 0 || length < 0) {
      throw new Error('offset and length must be non-negative.');
    }
    if (offset === 0 || length === 0) {
      if (next) {
        output += next;
      }
      continue;
    }
    if (offset > output.length) {
      throw new Error('offset exceeds output length.');
    }
    let copied = '';
    for (let i = 0; i < length; i += 1) {
      const char = output[output.length - offset + (i % offset)];
      if (char === undefined) {
        throw new Error('Invalid offset/length combination.');
      }
      copied += char;
    }
    output += copied;
    if (next) {
      output += next;
    }
  }
  return output;
}

export const __internals = { lz77Compress, lz77Decompress };
