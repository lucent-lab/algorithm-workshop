import { describe, expect, it } from 'vitest';
import { applyJsonDiff, diffJson, diffJsonAdvanced } from '../src/data/jsonDiff.js';

describe('diffJson', () => {
  it('produces replace operations for primitive changes at root', () => {
    const diff = diffJson(1, 2);
    expect(diff).toEqual([{ op: 'replace', path: [], value: 2 }]);
    const patched = applyJsonDiff(1, diff);
    expect(patched).toBe(2);
  });

  it('diffs nested objects and arrays', () => {
    const previous = {
      user: { name: 'Ada', tags: ['ml', 'ai'] },
      count: 1,
    };
    const next = {
      user: { name: 'Grace', tags: ['ml', 'ai', 'cs'] },
      count: 2,
      active: true,
    };

    const diff = diffJson(previous, next);
    expect(diff).toContainEqual({ op: 'replace', path: ['user', 'name'], value: 'Grace' });
    expect(diff).toContainEqual({ op: 'add', path: ['user', 'tags', 2], value: 'cs' });
    expect(diff).toContainEqual({ op: 'replace', path: ['count'], value: 2 });
    expect(diff).toContainEqual({ op: 'add', path: ['active'], value: true });

    const patched = applyJsonDiff(previous, diff);
    expect(patched).toEqual(next);
    expect(patched).not.toBe(previous);
  });

  it('handles removals and replacements inside arrays and objects', () => {
    const previous = {
      items: [1, 2, 3],
      settings: { theme: 'light', extras: true },
    };
    const next = {
      items: [1, 3],
      settings: { theme: 'dark' },
    };

    const diff = diffJson(previous, next);
    expect(diff).toContainEqual({ op: 'replace', path: ['items', 1], value: 3 });
    expect(diff).toContainEqual({ op: 'remove', path: ['items', 2] });
    expect(diff).toContainEqual({ op: 'replace', path: ['settings', 'theme'], value: 'dark' });
    expect(diff).toContainEqual({ op: 'remove', path: ['settings', 'extras'] });

    const patched = applyJsonDiff(previous, diff);
    expect(patched).toEqual(next);
  });

  it('returns empty diff for equal structures', () => {
    const value = { nested: ['a', { n: 1 }] };
    const diff = diffJson(value, { nested: ['a', { n: 1 }] });
    expect(diff).toEqual([]);
    expect(applyJsonDiff(value, diff)).toEqual(value);
  });

  it('supports ignoreKeys and path filters', () => {
    const previous = { status: 'idle', metrics: { cpu: 10, mem: 20 } };
    const next = { status: 'running', metrics: { cpu: 15, mem: 20 } };
    const diff = diffJsonAdvanced(previous, next, {
      ignoreKeys: ['mem'],
      pathFilter: (path) => !(path.length === 1 && path[0] === 'status'),
    });
    expect(diff).toEqual([{ op: 'replace', path: ['metrics', 'cpu'], value: 15 }]);
  });
});
