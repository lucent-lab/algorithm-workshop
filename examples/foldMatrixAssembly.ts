import { assembleContactMatrix } from '../src/index.js';

const result = assembleContactMatrix(
  [
    {
      contactId: 'contact-1',
      blocks: [
        {
          constraintId: 'c1',
          matrix: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ],
        },
      ],
    },
    {
      contactId: 'contact-2',
      blocks: [
        {
          constraintId: 'c2',
          matrix: [
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2],
          ],
        },
      ],
    },
  ],
  { size: 9 }
);

console.log(result.matrix.length, result.cache.length);
