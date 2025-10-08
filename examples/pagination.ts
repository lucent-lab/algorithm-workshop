import { paginate } from '../src/index.js';

const items = Array.from({ length: 23 }, (_, index) => ({ id: index + 1 }));

const { items: pageItems, metadata } = paginate({ items, page: 2, pageSize: 5 });

console.log('Page metadata:', metadata);
console.log('Page items:', pageItems);
