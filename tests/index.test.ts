import { describe, expect, expectTypeOf, it } from 'vitest';

import { examples } from '../src/index.js';
import type { ExampleCategory, ExampleName } from '../src/index.js';

describe('package entry point', () => {
  it('exposes an examples registry with stable paths', () => {
    expect(examples.pathfinding.astar).toBe('examples/astar.ts');
    expect(examples.performance.calculateVirtualRange).toBe('examples/virtualScroll.ts');
    expect(examples.procedural.SimplexNoise).toBe('examples/simplex.ts');
    expect(examples.procedural.cellularAutomataCave).toBe('examples/cellularAutomata.ts');
    expect(examples.procedural.poissonDiskSampling).toBe('examples/poissonDisk.ts');
    expect(examples.procedural.computeVoronoiDiagram).toBe('examples/voronoi.ts');
    expect(examples.procedural.diamondSquare).toBe('examples/diamondSquare.ts');
    expect(examples.procedural.generateLSystem).toBe('examples/lSystem.ts');
    expect(examples.procedural.generateBspDungeon).toBe('examples/dungeonBsp.ts');
    expect(examples.procedural.generateRecursiveMaze).toBe('examples/mazeRecursive.ts');
    expect(examples.procedural.generatePrimMaze).toBe('examples/mazePrim.ts');
    expect(examples.procedural.generateKruskalMaze).toBe('examples/mazeKruskal.ts');
    expect(examples.procedural.generateWilsonMaze).toBe('examples/mazeWilson.ts');
    expect(examples.procedural.generateAldousBroderMaze).toBe('examples/mazeAldous.ts');
    expect(examples.procedural.generateRecursiveDivisionMaze).toBe('examples/mazeDivision.ts');
    expect(examples.performance.createWeightedAliasSampler).toBe('examples/weightedAlias.ts');
    expect(examples.performance.createObjectPool).toBe('examples/objectPool.ts');
    expect(examples.performance.fisherYatesShuffle).toBe('examples/fisherYates.ts');
    expect(examples.performance.createFixedTimestepLoop).toBe('examples/fixedTimestep.ts');
    expect(examples.performance.createWeightedAliasSampler).toBe('examples/weightedAlias.ts');
    expect(examples.search.Trie).toBe('examples/search.ts');
    expect(examples.pathfinding.buildNavMesh).toBe('examples/navMesh.ts');
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
      | 'buildNavMesh'
      | 'findNavMeshPath'
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
      | 'cellularAutomataCave'
      | 'poissonDiskSampling'
      | 'computeVoronoiDiagram'
      | 'diamondSquare'
      | 'generateLSystem'
      | 'generateBspDungeon'
      | 'generateRecursiveMaze'
      | 'generatePrimMaze'
      | 'generateKruskalMaze'
      | 'generateWilsonMaze'
      | 'generateAldousBroderMaze'
      | 'generateRecursiveDivisionMaze'
    >();

    expectTypeOf<ExampleName<'performance'>>().toEqualTypeOf<
      | 'debounce'
      | 'throttle'
      | 'LRUCache'
      | 'memoize'
      | 'deduplicateRequest'
      | 'clearRequestDedup'
      | 'calculateVirtualRange'
      | 'createWeightedAliasSampler'
      | 'createObjectPool'
      | 'fisherYatesShuffle'
      | 'createFixedTimestepLoop'
    >();
  });
});
