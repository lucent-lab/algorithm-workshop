import { describe, expect, it } from 'vitest';

import { paginate } from '../src/index.js';

describe('paginate', () => {
  it('returns items for requested page with metadata', () => {
    const items = Array.from({ length: 12 }, (_, index) => index + 1);
    const result = paginate({ items, page: 2, pageSize: 5 });
    expect(result.items).toEqual([6, 7, 8, 9, 10]);
    expect(result.metadata).toMatchObject({
      page: 2,
      pageSize: 5,
      totalItems: 12,
      totalPages: 3,
      hasPrevious: true,
      hasNext: true,
    });
  });

  it('clamps page within valid range and handles small collections', () => {
    const items = [1, 2, 3];
    const result = paginate({ items, page: 10, pageSize: 2 });
    expect(result.items).toEqual([3]);
    expect(result.metadata.page).toBe(2);
    expect(result.metadata.hasNext).toBe(false);
  });

  it('validates options and throws on invalid page inputs', () => {
    const items = [1, 2, 3];
    expect(() => paginate({ items, page: 0, pageSize: 2 })).toThrow('page must be a positive integer');
    expect(() => paginate({ items, page: 1, pageSize: 0 })).toThrow('pageSize must be a positive integer');
  });
});
