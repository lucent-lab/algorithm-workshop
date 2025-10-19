import { describe, expect, it } from 'vitest';

import {
  computePointTriangleGap,
  computeEdgeEdgeGap,
  computePointPlaneGap,
} from '../src/physics/fold/gapEvaluators.js';

describe('gap evaluators', () => {
  it('computes point-triangle gap with inside projection', () => {
    const result = computePointTriangleGap(
      { x: 0.1, y: 0.1, z: 0.5 },
      [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
      ]
    );

    expect(result.gap).toBeCloseTo(0.5, 6);
    expect(result.normal.z).toBeCloseTo(1, 6);
  });

  it('computes edge-edge gap and provides closest points', () => {
    const result = computeEdgeEdgeGap(
      [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
      ],
      [
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 1 },
      ]
    );

    expect(result.gap).toBeCloseTo(1, 6);
    expect(result.closestPointA.z).toBeCloseTo(0, 6);
    expect(result.closestPointB.z).toBeCloseTo(1, 6);
  });

  it('computes point-plane gap with normalized normal', () => {
    const result = computePointPlaneGap(
      { x: 0, y: 2, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 2, z: 0 }
    );

    expect(result.gap).toBeCloseTo(2, 6);
    expect(result.projectedPoint.y).toBeCloseTo(0, 6);
  });
});
