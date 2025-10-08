import { describe, expect, it } from 'vitest';

import { createInventory } from '../src/index.js';

describe('createInventory', () => {
  it('stacks items and reports leftovers', () => {
    const inventory = createInventory({ slots: 2, maxStack: 5 });
    expect(inventory.addItem({ id: 'potion', quantity: 3 })).toBe(0);
    expect(inventory.addItem({ id: 'potion', quantity: 4 })).toBe(0);
    expect(inventory.getTotalQuantity('potion')).toBe(7);
  });

  it('supports filters and removal', () => {
    const inventory = createInventory<{ rarity: string }>({
      slots: 3,
      maxStack: 10,
      filter: (item) => item.metadata?.rarity !== 'cursed',
    });

    expect(inventory.addItem({ id: 'gem', quantity: 1, metadata: { rarity: 'cursed' } })).toBe(1);
    expect(inventory.addItem({ id: 'gem', quantity: 2, metadata: { rarity: 'rare' } })).toBe(0);
    expect(inventory.getTotalQuantity('gem')).toBe(2);

    expect(inventory.removeItem('gem', 1)).toBe(1);
    expect(inventory.getTotalQuantity('gem')).toBe(1);
  });

  it('serializes and restores state', () => {
    const inventory = createInventory({ slots: 2, maxStack: 5 });
    inventory.addItem({ id: 'arrow', quantity: 3 });

    const snapshot = inventory.toJSON();
    inventory.clear();
    expect(inventory.getTotalQuantity('arrow')).toBe(0);

    inventory.load(snapshot);
    expect(inventory.getTotalQuantity('arrow')).toBe(3);
  });
});
