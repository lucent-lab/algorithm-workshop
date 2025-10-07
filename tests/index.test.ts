import { describe, expect, expectTypeOf, it } from 'vitest';

import { examples } from '../src/index.js';
import type { ExampleCategory, ExampleName } from '../src/index.js';

describe('package entry point', () => {
  it('exposes an examples registry with stable paths', () => {
    expect(examples.pathfinding.astar).toBe('examples/astar.ts');
    expect(examples.performance.calculateVirtualRange).toBe('examples/virtualScroll.ts');
    expect(examples.procedural.SimplexNoise).toBe('examples/simplex.ts');
    expect(examples.search.Trie).toBe('examples/search.ts');
  });

  it('provides strong typing for example categories and names', () => {
    expectTypeOf<ExampleCategory>().toEqualTypeOf<
      | 'pathfinding'
      | 'procedural'
      | 'spatial'
      | 'search'
      | 'ai'
      | 'data'
      | 'performance'
      | 'graph'
      | 'geometry'
      | 'visual'
    >();

    expectTypeOf<ExampleName<'pathfinding'>>().toEqualTypeOf<
      | 'astar'
      | 'manhattanDistance'
      | 'gridFromString'
      | 'dijkstra'
      | 'jumpPointSearch'
      | 'computeFlowField'
    >();

    expectTypeOf<ExampleName<'procedural'>>().toEqualTypeOf<
      | 'perlin'
      | 'perlin3D'
      | 'simplex2D'
      | 'simplex3D'
      | 'SimplexNoise'
      | 'worley'
      | 'worleySample'
      | 'waveFunctionCollapse'
    >();
  });
});
