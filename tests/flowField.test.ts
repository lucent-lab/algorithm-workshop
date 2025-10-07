import { describe, expect, it } from 'vitest';
import { computeFlowField } from '../src/pathfinding/flowField.js';

const grid = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

describe('computeFlowField', () => {
  it('produces lower cost near the goal', () => {
    const { cost } = computeFlowField({ grid, goal: { x: 3, y: 3 } });
    expect(cost[3][3]).toBe(0);
    expect(cost[0][0]).toBeGreaterThan(cost[2][2]);
  });

  it('returns normalized flow vectors pointing toward the goal', () => {
    const { flow } = computeFlowField({ grid, goal: { x: 3, y: 3 } });
    const startFlow = flow[0][0];
    const vectorToGoal = { x: 3, y: 3 };
    const dot = startFlow.x * vectorToGoal.x + startFlow.y * vectorToGoal.y;
    expect(dot).toBeGreaterThan(0);
    const magnitude = Math.hypot(startFlow.x, startFlow.y);
    expect(Math.abs(magnitude - 1)).toBeLessThan(1e-6);
  });

  it('gives zero vectors to unreachable tiles', () => {
    const blocked = [
      [0, 0],
      [1, 1],
    ];
    const { flow } = computeFlowField({ grid: blocked, goal: { x: 0, y: 0 } });
    expect(flow[1][1]).toEqual({ x: 0, y: 0 });
  });
});
