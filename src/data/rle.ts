/**
 * Run-length encoding for strings.
 * Useful for: simple compression on repetitive text.
 */
export interface RlePair {
  char: string;
  count: number;
}

/**
 * Encodes a string into RLE pairs.
 */
export function runLengthEncode(input: string): RlePair[] {
  if (input.length === 0) return [];
  const out: RlePair[] = [];
  let last = input[0];
  let cnt = 1;
  for (let i = 1; i < input.length; i += 1) {
    const c = input[i];
    if (c === last) cnt += 1;
    else {
      out.push({ char: last, count: cnt });
      last = c;
      cnt = 1;
    }
  }
  out.push({ char: last, count: cnt });
  return out;
}

/**
 * Decodes RLE pairs into a string.
 */
export function runLengthDecode(pairs: ReadonlyArray<RlePair>): string {
  let out = '';
  for (const p of pairs) {
    if (!p || typeof p.count !== 'number' || typeof p.char !== 'string') continue;
    if (p.count <= 0 || p.char.length === 0) continue;
    out += p.char.repeat(p.count);
  }
  return out;
}
