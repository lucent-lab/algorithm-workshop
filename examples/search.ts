import {
  binarySearch,
  fuzzyScore,
  fuzzySearch,
  Trie,
  levenshteinDistance,
  kmpSearch,
  rabinKarp,
  boyerMooreSearch,
  buildSuffixArray,
  longestCommonSubsequence,
  diffStrings,
  createAhoCorasick,
} from '../src/index.js';

const items = ['alpha', 'beta', 'delta', 'epsilon', 'gamma'];
const matches = fuzzySearch('alp', items);
console.log('Fuzzy search results:', matches);
console.log('Fuzzy score for (kitten, sitting):', fuzzyScore('kitten', 'sitting'));

const trie = new Trie();
items.forEach((value) => trie.insert(value));
console.log('Trie suggestions for "ga":', trie.startsWith('ga'));

const sorted = [...items].sort();
console.log('Binary search for "delta":', binarySearch(sorted, 'delta'));
console.log('Levenshtein distance between "graph" and "giraffe":', levenshteinDistance('graph', 'giraffe'));

const occurrences = kmpSearch({ text: 'abracadabra', pattern: 'abra' });
console.log('KMP matches for "abra" in "abracadabra":', occurrences);

const multiMatches = rabinKarp({ text: 'mississippi', patterns: ['issi', 'ppi'] });
console.log('Rabin–Karp matches:', multiMatches);

const bmMatches = boyerMooreSearch({ text: 'here is a simple example', pattern: 'example' });
console.log('Boyer–Moore matches for "example":', bmMatches);

const suffixResult = buildSuffixArray({ text: 'banana' });
console.log('Suffix array for banana:', suffixResult.suffixArray);
console.log('LCP array for banana:', suffixResult.lcpArray);

const lcs = longestCommonSubsequence({ a: 'dynamic', b: 'programming' });
console.log('LCS of dynamic/programming:', lcs);

const diff = diffStrings({ a: 'kitten', b: 'sitting' });
console.log('Diff between kitten and sitting:', diff);

const automaton = createAhoCorasick({ patterns: ['abra', 'cad'] });
console.log('Aho–Corasick matches in abracadabra:', automaton.search('abracadabra'));
