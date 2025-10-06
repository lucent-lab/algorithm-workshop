interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
}

/**
 * Prefix tree for efficient string lookup and autocomplete.
 * Useful for: dictionary search, suggestions, prefix-based filtering.
 */
export class Trie {
  private root: TrieNode = { children: new Map(), isWord: false };

  insert(word: string): void {
    if (typeof word !== 'string') {
      throw new TypeError('word must be a string');
    }
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), isWord: false });
      }
      node = node.children.get(char)!;
    }
    node.isWord = true;
  }

  search(word: string): boolean {
    const node = this.traverse(word);
    return !!node?.isWord;
  }

  startsWith(prefix: string): string[] {
    const node = this.traverse(prefix);
    if (!node) {
      return [];
    }
    const results: string[] = [];
    this.collect(node, prefix, results);
    return results;
  }

  private traverse(sequence: string): TrieNode | null {
    if (typeof sequence !== 'string') {
      throw new TypeError('sequence must be a string');
    }
    let node: TrieNode | undefined = this.root;
    for (const char of sequence) {
      node = node.children.get(char);
      if (!node) {
        return null;
      }
    }
    return node;
  }

  private collect(node: TrieNode, prefix: string, results: string[]): void {
    if (node.isWord) {
      results.push(prefix);
    }
    for (const [char, child] of node.children.entries()) {
      this.collect(child, prefix + char, results);
    }
  }
}
