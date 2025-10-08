import { createInventory } from '../src/index.js';

const inventory = createInventory<{ rarity: string }>({
  slots: 4,
  maxStack: 5,
  filter: (item) => item.metadata?.rarity !== 'cursed',
});

inventory.addItem({ id: 'potion', quantity: 3, metadata: { rarity: 'common' } });
inventory.addItem({ id: 'potion', quantity: 4, metadata: { rarity: 'common' } });
inventory.addItem({ id: 'elixir', quantity: 2, metadata: { rarity: 'rare' } });

console.log('inventory:', inventory.toJSON());
