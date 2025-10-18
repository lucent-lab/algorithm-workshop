import { describe, expect, it } from 'vitest';

import { assembleContactMatrix } from '../src/physics/fold/matrixAssembly.js';

describe('assembleContactMatrix', () => {
  it('allocates sequential blocks and caches indices', () => {
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
      { size: 12 }
    );

    expect(result.matrix.length).toBe(12);
    expect(result.cache).toHaveLength(1);
    expect(result.cache[0]?.baseIndices).toHaveLength(2);
    expect(result.matrix[0]?.[0]).toBe(1);
    expect(result.matrix[3]?.[3]).toBe(2);
    expect(result.matrix[3]?.[0]).toBe(0);
  });

  it('reuses cached indices for repeated constraints', () => {
    const result = assembleContactMatrix(
      [
        {
          contactId: 'contact-1',
          blocks: [
            {
              constraintId: 'shared',
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
              constraintId: 'shared',
              matrix: [
                [0.5, 0, 0],
                [0, 0.5, 0],
                [0, 0, 0.5],
              ],
            },
          ],
        },
      ]
    );

    expect(result.matrix.length).toBeGreaterThan(0);
    expect(result.cache[0]?.baseIndices[0]).toBe(result.cache[1]?.baseIndices[0]);
  });
});
