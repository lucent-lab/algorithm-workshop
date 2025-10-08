import { describe, expect, it } from 'vitest';

import { applyTreeDiff, diffTree } from '../src/index.js';

describe('tree diff utilities', () => {
  it('computes structural changes and applies patches', () => {
    const previous = [
      {
        id: 'root',
        value: { label: 'Root' },
        children: [
          { id: 'a', value: { label: 'A' }, children: [{ id: 'a-1', value: { label: 'Leaf' } }] },
          { id: 'b', value: { label: 'B' } },
        ],
      },
    ];

    const next = [
      {
        id: 'root',
        value: { label: 'Root', version: 2 },
        children: [
          { id: 'b', value: { label: 'B' } },
          {
            id: 'wrapper',
            value: { label: 'Wrapper' },
            children: [{ id: 'a', value: { label: 'A', active: true }, children: [] }],
          },
          { id: 'c', value: { label: 'C' } },
        ],
      },
    ];

    const diff = diffTree(previous, next);

    expect(diff).toEqual([
      { type: 'remove', id: 'a-1', parentId: 'a' },
      {
        type: 'insert',
        id: 'wrapper',
        parentId: 'root',
        index: 1,
        node: { id: 'wrapper', value: { label: 'Wrapper' } },
      },
      { type: 'insert', id: 'c', parentId: 'root', index: 2, node: { id: 'c', value: { label: 'C' } } },
      { type: 'move', id: 'b', parentId: 'root', index: 0 },
      { type: 'move', id: 'a', parentId: 'wrapper', index: 0 },
      { type: 'update', id: 'root', value: { label: 'Root', version: 2 }, hasValue: true },
      { type: 'update', id: 'a', value: { label: 'A', active: true }, hasValue: true },
    ]);

    const patched = applyTreeDiff(previous, diff);
    expect(patched).toEqual(next);
  });

  it('handles moves to newly inserted parents and value removals', () => {
    const previous = [
      {
        id: 'root',
        children: [
          { id: 'orphan', value: { label: 'Orphan' } },
          { id: 'stable', value: { label: 'Stable', meta: { flag: true } } },
        ],
      },
    ];

    const next = [
      {
        id: 'root',
        children: [
          {
            id: 'container',
            children: [{ id: 'orphan' }],
          },
          { id: 'stable', value: { label: 'Stable' } },
        ],
      },
    ];

    const diff = diffTree(previous, next);

    expect(diff).toEqual([
      {
        type: 'insert',
        id: 'container',
        parentId: 'root',
        index: 0,
        node: { id: 'container' },
      },
      { type: 'move', id: 'orphan', parentId: 'container', index: 0 },
      { type: 'update', id: 'stable', value: { label: 'Stable' }, hasValue: true },
      { type: 'update', id: 'orphan', value: undefined, hasValue: false },
    ]);

    const patched = applyTreeDiff(previous, diff);
    expect(patched).toEqual(next);
  });
});
