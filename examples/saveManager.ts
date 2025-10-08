import { createSaveManager } from '../src/index.js';

interface PlayerState {
  level: number;
  coins: number;
}

let now = 0;

const saves = createSaveManager<PlayerState>({
  prefix: 'campaign',
  version: 1,
  getTime: () => now,
  maxSlots: 2,
});

function advance(seconds: number): void {
  now += seconds;
}

console.log('Saving slot-1');
saves.save('slot-1', { level: 5, coins: 150 });
advance(10);

console.log('Saving slot-2');
saves.save('slot-2', { level: 7, coins: 230 });
advance(5);

console.log('Overwriting slot-1');
saves.save('slot-1', { level: 8, coins: 310 });

for (const metadata of saves.list()) {
  console.log('Slot:', metadata.slotId, 'level size:', metadata.size, 'updated:', metadata.updatedAt);
}

const loaded = saves.load('slot-1');
if (loaded.ok) {
  console.log('Loaded slot-1:', loaded.data);
}
