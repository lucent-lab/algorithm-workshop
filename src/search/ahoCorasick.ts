export interface AhoBuildOptions {
  patterns: ReadonlyArray<string>;
  caseSensitive?: boolean;
}

export interface AhoAutomaton {
  search(text: string): Record<string, number[]>;
}

interface Node {
  next: Map<string, number>;
  fail: number;
  out: number[]; // indices into originalPatterns
}

export function createAhoCorasick(options: AhoBuildOptions): AhoAutomaton {
  validateOptions(options);
  const caseSensitive = options.caseSensitive ?? true;
  const originalPatterns = options.patterns.slice();
  const normalizedPatterns = caseSensitive
    ? originalPatterns
    : originalPatterns.map((p) => p.toLowerCase());

  const nodes: Node[] = [{ next: new Map(), fail: 0, out: [] }];

  // Build trie
  normalizedPatterns.forEach((pattern, idx) => {
    if (pattern.length === 0) return;
    let state = 0;
    for (const ch of pattern) {
      let to = nodes[state].next.get(ch);
      if (to === undefined) {
        to = nodes.length;
        nodes[state].next.set(ch, to);
        nodes.push({ next: new Map(), fail: 0, out: [] });
      }
      state = to;
    }
    nodes[state].out.push(idx);
  });

  // Build fail links via BFS
  const queue: number[] = [];
  for (const [, to] of nodes[0].next.entries()) {
    nodes[to].fail = 0;
    queue.push(to);
  }
  while (queue.length > 0) {
    const v = queue.shift()!;
    for (const [ch, to] of nodes[v].next.entries()) {
      queue.push(to);
      let f = nodes[v].fail;
      while (f !== 0 && !nodes[f].next.has(ch)) {
        f = nodes[f].fail;
      }
      if (nodes[f].next.has(ch)) {
        f = nodes[f].next.get(ch)!;
      }
      nodes[to].fail = f;
      nodes[to].out.push(...nodes[f].out);
    }
  }

  function search(text: string): Record<string, number[]> {
    const t = caseSensitive ? text : text.toLowerCase();
    const results: Record<string, number[]> = {};
    // Handle empty patterns returning all positions
    for (let i = 0; i < originalPatterns.length; i += 1) {
      if (normalizedPatterns[i].length === 0) {
        results[originalPatterns[i]] = Array.from({ length: text.length + 1 }, (_, p) => p);
      }
    }

    let state = 0;
    for (let i = 0; i < t.length; i += 1) {
      const ch = t[i];
      while (state !== 0 && !nodes[state].next.has(ch)) {
        state = nodes[state].fail;
      }
      if (nodes[state].next.has(ch)) {
        state = nodes[state].next.get(ch)!;
      }
      if (nodes[state].out.length > 0) {
        for (const patIdx of nodes[state].out) {
          const pat = originalPatterns[patIdx];
          const len = normalizedPatterns[patIdx].length;
          const pos = i - len + 1;
          if (!results[pat]) results[pat] = [];
          results[pat].push(pos);
        }
      }
    }
    for (const pat of originalPatterns) {
      if (!results[pat]) results[pat] = [];
    }
    return results;
  }

  return { search };
}

function validateOptions(options: AhoBuildOptions): void {
  if (!Array.isArray(options.patterns) || options.patterns.length === 0) {
    throw new Error('patterns must contain at least one pattern.');
  }
}
