interface HuffmanNode {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

export type HuffmanTable = Record<string, string>;

function buildFrequencyMap(input: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const char of input) {
    freq.set(char, (freq.get(char) ?? 0) + 1);
  }
  return freq;
}

function buildTree(freq: Map<string, number>): HuffmanNode | null {
  const nodes: HuffmanNode[] = Array.from(freq.entries(), ([char, count]) => ({
    char,
    freq: count,
  }));

  if (nodes.length === 0) {
    return null;
  }

  if (nodes.length === 1) {
    return nodes[0];
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({ freq: left.freq + right.freq, left, right });
  }

  return nodes[0] ?? null;
}

function generateCodes(node: HuffmanNode | null): HuffmanTable {
  const codes: HuffmanTable = {};
  if (!node) {
    return codes;
  }

  const traverse = (current: HuffmanNode, prefix: string) => {
    if (!current.left && !current.right) {
      if (current.char === undefined) {
        throw new Error('Huffman leaf node missing symbol.');
      }
      codes[current.char] = prefix.length === 0 ? '0' : prefix;
      return;
    }
    if (current.left) traverse(current.left, `${prefix}0`);
    if (current.right) traverse(current.right, `${prefix}1`);
  };

  traverse(node, '');
  return codes;
}

export function createHuffmanTable(input: string): HuffmanTable {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string.');
  }
  const tree = buildTree(buildFrequencyMap(input));
  return generateCodes(tree);
}

export interface HuffmanEncodedResult {
  bitString: string;
  table: HuffmanTable;
}

export function huffmanEncode(input: string): HuffmanEncodedResult {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string.');
  }
  if (input.length === 0) {
    return { bitString: '', table: {} };
  }

  const table = createHuffmanTable(input);
  let bitString = '';
  for (const char of input) {
    const code = table[char];
    if (!code) {
      throw new Error(`Missing Huffman code for character: ${char}`);
    }
    bitString += code;
  }
  return { bitString, table };
}

export function huffmanDecode(encoded: string, table: Readonly<HuffmanTable>): string {
  if (typeof encoded !== 'string') {
    throw new TypeError('encoded must be a string of bits.');
  }

  if (encoded.length === 0) {
    return '';
  }

  if (!table || Object.keys(table).length === 0) {
    throw new Error('table must contain at least one Huffman code.');
  }

  const reverse = new Map<string, string>();
  for (const [char, code] of Object.entries(table)) {
    if (typeof code !== 'string' || code.length === 0) {
      throw new Error(`Invalid Huffman code for character: ${char}`);
    }
    reverse.set(code, char);
  }

  let current = '';
  let result = '';
  for (const bit of encoded) {
    if (bit !== '0' && bit !== '1') {
      throw new Error('Encoded string must contain only 0 or 1 characters.');
    }
    current += bit;
    const char = reverse.get(current);
    if (char !== undefined) {
      result += char;
      current = '';
    }
  }

  if (current.length > 0) {
    throw new Error('Encoded string ended with an incomplete Huffman code.');
  }

  return result;
}

export const __internals = { buildFrequencyMap, buildTree, generateCodes };
