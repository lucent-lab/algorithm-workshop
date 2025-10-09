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
    expect(examples.performance.createWeightedAliasSampler).toBe('examples/weightedAlias.ts');
    expect(examples.data.applyJsonDiffSelective).toBe('examples/jsonDiff.ts');
    expect(examples.data.diffTree).toBe('examples/treeDiff.ts');
    expect(examples.data.applyTreeDiff).toBe('examples/treeDiff.ts');
    expect(examples.visual.hexToRgb).toBe('examples/color.ts');
    expect(examples.visual.rgbToHex).toBe('examples/color.ts');
    expect(examples.visual.rgbToHsl).toBe('examples/color.ts');
    expect(examples.visual.hslToRgb).toBe('examples/color.ts');
    expect(examples.visual.mixRgbColors).toBe('examples/color.ts');
    expect(examples.visual.computeForceDirectedLayout).toBe('examples/forceDirected.ts');
    expect(examples.visual.computeMarchingSquares).toBe('examples/marchingSquares.ts');
    expect(examples.visual.computeMarchingCubes).toBe('examples/marchingCubes.ts');
    expect(examples.gameplay.createDeltaTimeManager).toBe('examples/deltaTime.ts');
    expect(examples.gameplay.createFixedTimestepLoop).toBe('examples/fixedTimestep.ts');
    expect(examples.gameplay.createCamera2D).toBe('examples/camera2D.ts');
    expect(examples.gameplay.createParticleSystem).toBe('examples/particleSystem.ts');
    expect(examples.gameplay.createSpriteAnimation).toBe('examples/spriteAnimation.ts');
    expect(examples.gameplay.createTweenSystem).toBe('examples/tween.ts');
    expect(examples.gameplay.createPlatformerController).toBe('examples/platformerPhysics.ts');
    expect(examples.gameplay.createTopDownController).toBe('examples/topDownMovement.ts');
    expect(examples.gameplay.createTileMapController).toBe('examples/tileMap.ts');
    expect(examples.gameplay.computeFieldOfView).toBe('examples/shadowcasting.ts');
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
      | 'gameplay'
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
    >();

    expectTypeOf<ExampleName<'data'>>().toEqualTypeOf<
      | 'diff'
      | 'deepClone'
      | 'groupBy'
      | 'diffJson'
      | 'applyJsonDiff'
      | 'applyJsonDiffSelective'
      | 'flatten'
      | 'unflatten'
      | 'paginate'
      | 'diffTree'
      | 'applyTreeDiff'
      | 'UnionFind'
      | 'BinaryHeap'
    >();

    expectTypeOf<ExampleName<'search'>>().toEqualTypeOf<
      | 'fuzzySearch'
      | 'fuzzyScore'
      | 'Trie'
      | 'binarySearch'
      | 'levenshteinDistance'
      | 'kmpSearch'
      | 'rabinKarp'
      | 'boyerMooreSearch'
      | 'buildSuffixArray'
      | 'longestCommonSubsequence'
      | 'diffStrings'
      | 'createAhoCorasick'
    >();

    expectTypeOf<ExampleName<'gameplay'>>().toEqualTypeOf<
      | 'createDeltaTimeManager'
      | 'createFixedTimestepLoop'
      | 'createCamera2D'
      | 'createParticleSystem'
      | 'createSpriteAnimation'
      | 'createTweenSystem'
      | 'createPlatformerController'
      | 'createTopDownController'
      | 'createTileMapController'
      | 'computeFieldOfView'
      | 'createInventory'
      | 'calculateDamage'
      | 'createCooldownController'
      | 'createQuestMachine'
      | 'computeLightingGrid'
      | 'createWaveSpawner'
      | 'createSoundManager'
      | 'createInputManager'
      | 'createSaveManager'
      | 'createScreenTransition'
    >();

    expectTypeOf<ExampleName<'ai'>>().toEqualTypeOf<
      | 'seek'
      | 'flee'
      | 'pursue'
      | 'wander'
      | 'arrive'
      | 'updateBoids'
      | 'BehaviorTree'
      | 'rvoStep'
      | 'createFSM'
      | 'createGeneticAlgorithm'
      | 'computeInfluenceMap'
    >();

    expectTypeOf<ExampleName<'visual'>>().toEqualTypeOf<
      | 'easing'
      | 'quadraticBezier'
      | 'cubicBezier'
      | 'hexToRgb'
      | 'rgbToHex'
      | 'rgbToHsl'
      | 'hslToRgb'
      | 'mixRgbColors'
      | 'computeForceDirectedLayout'
      | 'computeMarchingSquares'
      | 'computeMarchingCubes'
    >();
  });
});
