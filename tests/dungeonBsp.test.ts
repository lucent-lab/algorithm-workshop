import { describe, expect, it } from 'vitest';

import { generateBspDungeon } from '../src/index.js';

describe('generateBspDungeon', () => {
  it('produces deterministic layouts for identical seeds', () => {
    const options = {
      width: 40,
      height: 24,
      minimumRoomSize: 4,
      maximumRoomSize: 8,
      maxDepth: 4,
      seed: 111,
    } as const;

    const a = generateBspDungeon(options);
    const b = generateBspDungeon(options);

    expect(a.rooms).toEqual(b.rooms);
    expect(a.corridors).toEqual(b.corridors);
    expect(a.grid).toEqual(b.grid);
  });

  it('creates walkable tiles and rooms within bounds', () => {
    const dungeon = generateBspDungeon({
      width: 32,
      height: 20,
      seed: 7,
    });

    const floorTiles = dungeon.grid.flat().filter((cell) => cell === 0).length;
    expect(floorTiles).toBeGreaterThan(0);

    for (const room of dungeon.rooms) {
      expect(room.x).toBeGreaterThanOrEqual(0);
      expect(room.y).toBeGreaterThanOrEqual(0);
      expect(room.x + room.width).toBeLessThanOrEqual(32);
      expect(room.y + room.height).toBeLessThanOrEqual(20);
    }

    expect(dungeon.corridors.every((corridor) => corridor.path.length > 0)).toBe(true);
  });
});
