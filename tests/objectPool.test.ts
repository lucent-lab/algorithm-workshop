import { describe, expect, it } from 'vitest';

import { createObjectPool } from '../src/index.js';

describe('createObjectPool', () => {
  it('reuses objects and respects reset', () => {
    let created = 0;
    const pool = createObjectPool({
      factory: () => ({ used: false, id: created += 1 }),
      reset: (item) => {
        item.used = false;
      },
      initialSize: 1,
    });

    const first = pool.acquire();
    first.used = true;
    pool.release(first);

    const second = pool.acquire();
    expect(second).toBe(first);
    expect(second.used).toBe(false);
  });

  it('throws when pool depleted beyond maxSize', () => {
    const pool = createObjectPool({
      factory: () => ({}),
      initialSize: 0,
      maxSize: 1,
    });

    pool.acquire();
    expect(() => pool.acquire()).toThrow();
  });
});
