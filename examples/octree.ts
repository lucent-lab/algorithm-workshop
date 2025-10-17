import { Octree } from '../src/index.js';

const tree = new Octree<{ id: string }>({
  x: 0,
  y: 0,
  z: 0,
  width: 64,
  height: 64,
  depth: 64,
}, 4);

tree.insert({ x: 4, y: 8, z: 2 }, { id: 'player' });
tree.insert({ x: 30, y: 32, z: 20 }, { id: 'npc' });
tree.insert({ x: 16, y: 12, z: 40 }, { id: 'pickup' });

const nearby = tree.querySphere({ x: 6, y: 9, z: 4 }, 6);
console.log(nearby.map((point) => point.data?.id));
