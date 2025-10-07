import { describe, it, expect } from 'vitest';
import {
  BehaviorTree,
  action,
  condition,
  sequence,
  selector,
  BehaviorStatus,
} from '../src/ai/behaviorTree.js';

describe('behavior tree', () => {
  it('runs sequence until failure', () => {
    const visited: string[] = [];
    const tree = new BehaviorTree(
      sequence(
        action(() => {
          visited.push('a');
          return 'success';
        }),
        action(() => {
          visited.push('b');
          return 'failure';
        }),
        action(() => {
          visited.push('c');
          return 'success';
        })
      )
    );

    const status = tree.tick({});
    expect(status).toBe('failure');
    expect(visited).toEqual(['a', 'b']);
  });

  it('selector succeeds when any child succeeds', () => {
    const tree = new BehaviorTree(
      selector(
        condition(() => false),
        action(() => 'success')
      )
    );

    expect(tree.tick({})).toBe('success');
  });

  it('resumes sequence from running child', () => {
    let step = 0;
    const tree = new BehaviorTree(
      sequence(
        action(() => 'success'),
        action((): BehaviorStatus => {
          step += 1;
          if (step < 2) {
            return 'running';
          }
          return 'success';
        })
      )
    );

    expect(tree.tick({})).toBe('running');
    expect(tree.tick({})).toBe('success');
  });
});
