import { describe, it, expect } from 'vitest';
import { raycastSegment, raycastAabb } from '../src/index.js';

describe('raycasting utilities', () => {
  it('raycastSegment hits segment in front of origin', () => {
    const hit = raycastSegment(
      { origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 } },
      { x: 5, y: -1 },
      { x: 5, y: 1 }
    );
    expect(hit).toBeTruthy();
    expect(hit && Math.round(hit.distance)).toBe(5);
  });

  it('raycastSegment misses parallel/behind segments', () => {
    // Parallel segment
    const miss1 = raycastSegment(
      { origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 } },
      { x: 0, y: 5 },
      { x: 5, y: 5 }
    );
    expect(miss1).toBeNull();

    // Segment behind the origin
    const miss2 = raycastSegment(
      { origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 } },
      { x: -5, y: -1 },
      { x: -5, y: 1 }
    );
    expect(miss2).toBeNull();
  });

  it('raycastAabb detects nearest hit', () => {
    const hit = raycastAabb(
      { origin: { x: -5, y: 0 }, direction: { x: 1, y: 0 } },
      { x: 0, y: -1, width: 2, height: 2 }
    );
    expect(hit).toBeTruthy();
    expect(hit && Math.round(hit.distance)).toBe(5);
  });
});

