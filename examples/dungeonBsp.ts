import { generateBspDungeon } from '../src/index.js';

const dungeon = generateBspDungeon({
  width: 40,
  height: 24,
  seed: 2024,
  minimumRoomSize: 4,
  maximumRoomSize: 8,
  maxDepth: 4,
});

console.log('Rooms:', dungeon.rooms.length);
console.log('Corridors:', dungeon.corridors.length);
console.log('Sample grid row:', dungeon.grid[12]?.join(''));
