import { createLinearCongruentialGenerator } from '../util/prng.js';
import type { Point, Rect } from '../types.js';

export interface DungeonGeneratorOptions {
  width: number;
  height: number;
  minimumRoomSize?: number;
  maximumRoomSize?: number;
  maxDepth?: number;
  corridorWidth?: number;
  seed?: number;
}

export interface DungeonRoom extends Rect {
  id: number;
  center: Point;
}

export interface DungeonCorridor {
  path: Point[];
}

export interface DungeonBspResult {
  grid: number[][];
  rooms: DungeonRoom[];
  corridors: DungeonCorridor[];
}

interface Node {
  bounds: Rect;
  depth: number;
  left?: Node;
  right?: Node;
  room?: DungeonRoom;
}

const DEFAULT_MIN_ROOM = 4;
const DEFAULT_MAX_ROOM = 10;
const DEFAULT_MAX_DEPTH = 5;

/**
 * Generates a dungeon layout using binary space partitioning (BSP).
 * Useful for: roguelike level layouts, room-and-corridor maps.
 * Performance: O(width × height) for carving plus O(nodes) splitting.
 */
export function generateBspDungeon({
  width,
  height,
  minimumRoomSize = DEFAULT_MIN_ROOM,
  maximumRoomSize = DEFAULT_MAX_ROOM,
  maxDepth = DEFAULT_MAX_DEPTH,
  corridorWidth = 1,
  seed = Date.now(),
}: DungeonGeneratorOptions): DungeonBspResult {
  if (width <= 0 || height <= 0) {
    throw new Error('width and height must be positive integers.');
  }
  if (minimumRoomSize < 3) {
    throw new Error('minimumRoomSize must be >= 3.');
  }
  if (maximumRoomSize < minimumRoomSize) {
    throw new Error('maximumRoomSize must be >= minimumRoomSize.');
  }

  const random = createLinearCongruentialGenerator(seed);
  const root: Node = {
    bounds: { x: 0, y: 0, width, height },
    depth: 0,
  };

  splitNode(root, minimumRoomSize, maxDepth, random);
  const rooms: DungeonRoom[] = [];
  carveRooms(root, random, minimumRoomSize, maximumRoomSize, rooms);

  const corridors: DungeonCorridor[] = [];
  connectRooms(root, corridors);

  const grid = Array.from({ length: height }, () => Array<number>(width).fill(1));
  for (const room of rooms) {
    carveRectangle(grid, room, 0);
  }
  for (const corridor of corridors) {
    for (const { x, y } of corridor.path) {
      for (let dx = -Math.floor(corridorWidth / 2); dx <= Math.floor(corridorWidth / 2); dx += 1) {
        for (let dy = -Math.floor(corridorWidth / 2); dy <= Math.floor(corridorWidth / 2); dy += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            grid[ny][nx] = 0;
          }
        }
      }
    }
  }

  return { grid, rooms, corridors };
}

function splitNode(node: Node, minRoomSize: number, maxDepth: number, random: () => number): void {
  if (node.depth >= maxDepth) {
    return;
  }

  const { bounds } = node;
  const canSplitHorizontally = bounds.height >= minRoomSize * 2;
  const canSplitVertically = bounds.width >= minRoomSize * 2;

  if (!canSplitHorizontally && !canSplitVertically) {
    return;
  }

  let splitHorizontally = false;
  if (canSplitHorizontally && canSplitVertically) {
    splitHorizontally = random() < 0.5;
  } else {
    splitHorizontally = canSplitHorizontally;
  }

  if (splitHorizontally) {
    const split = randomRange(random, minRoomSize, bounds.height - minRoomSize);
    node.left = {
      bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: split },
      depth: node.depth + 1,
    };
    node.right = {
      bounds: {
        x: bounds.x,
        y: bounds.y + split,
        width: bounds.width,
        height: bounds.height - split,
      },
      depth: node.depth + 1,
    };
  } else {
    const split = randomRange(random, minRoomSize, bounds.width - minRoomSize);
    node.left = {
      bounds: { x: bounds.x, y: bounds.y, width: split, height: bounds.height },
      depth: node.depth + 1,
    };
    node.right = {
      bounds: {
        x: bounds.x + split,
        y: bounds.y,
        width: bounds.width - split,
        height: bounds.height,
      },
      depth: node.depth + 1,
    };
  }

  if (node.left) {
    splitNode(node.left, minRoomSize, maxDepth, random);
  }
  if (node.right) {
    splitNode(node.right, minRoomSize, maxDepth, random);
  }
}

function carveRooms(
  node: Node,
  random: () => number,
  minRoom: number,
  maxRoom: number,
  rooms: DungeonRoom[],
  nextId: { value: number } = { value: 0 }
): void {
  if (!node.left && !node.right) {
    const maxRoomWidth = Math.min(node.bounds.width - 2, maxRoom);
    const maxRoomHeight = Math.min(node.bounds.height - 2, maxRoom);
    const roomWidth = randomRange(random, minRoom, maxRoomWidth);
    const roomHeight = randomRange(random, minRoom, maxRoomHeight);
    const roomX = node.bounds.x + randomRange(random, 1, node.bounds.width - roomWidth - 1);
    const roomY = node.bounds.y + randomRange(random, 1, node.bounds.height - roomHeight - 1);
    nextId.value += 1;
    const room: DungeonRoom = {
      id: nextId.value,
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
      center: { x: Math.floor(roomX + roomWidth / 2), y: Math.floor(roomY + roomHeight / 2) },
    };
    node.room = room;
    rooms.push(room);
    return;
  }

  if (node.left) {
    carveRooms(node.left, random, minRoom, maxRoom, rooms, nextId);
  }
  if (node.right) {
    carveRooms(node.right, random, minRoom, maxRoom, rooms, nextId);
  }
}

function connectRooms(node: Node, corridors: DungeonCorridor[]): void {
  if (!node.left || !node.right) {
    return;
  }

  const leftRoom = findRoom(node.left);
  const rightRoom = findRoom(node.right);
  if (leftRoom && rightRoom) {
    const path = carveCorridor(leftRoom.center, rightRoom.center);
    corridors.push({ path });
  }

  connectRooms(node.left, corridors);
  connectRooms(node.right, corridors);
}

function findRoom(node: Node): DungeonRoom | null {
  if (node.room) {
    return node.room;
  }
  const left = node.left ? findRoom(node.left) : null;
  if (left) {
    return left;
  }
  return node.right ? findRoom(node.right) : null;
}

function carveCorridor(from: Point, to: Point): Point[] {
  const path: Point[] = [];
  let x = from.x;
  let y = from.y;
  while (x !== to.x) {
    path.push({ x, y });
    x += x < to.x ? 1 : -1;
  }
  while (y !== to.y) {
    path.push({ x, y });
    y += y < to.y ? 1 : -1;
  }
  path.push({ x: to.x, y: to.y });
  return path;
}

function carveRectangle(grid: number[][], rect: Rect, value: number): void {
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      if (grid[y] && grid[y][x] !== undefined) {
        grid[y][x] = value;
      }
    }
  }
}

function randomRange(random: () => number, min: number, max: number): number {
  if (max <= min) {
    return min;
  }
  return Math.floor(random() * (max - min + 1)) + min;
}
