import { binarySearch, fuzzyScore, fuzzySearch, Trie, levenshteinDistance } from '../src/index.js';

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
