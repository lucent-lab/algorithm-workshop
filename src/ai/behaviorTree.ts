export type BehaviorStatus = 'success' | 'failure' | 'running';

export interface BehaviorNode<TContext> {
  tick(context: TContext): BehaviorStatus;
  reset?(): void;
}

export type BehaviorAction<TContext> = (context: TContext) => BehaviorStatus;
export type BehaviorCondition<TContext> = (context: TContext) => boolean;

/**
 * Simple behavior tree runner maintaining a root node.
 * Useful for: AI decision making, hierarchical NPC behaviours, modular logic flows.
 */
export class BehaviorTree<TContext> {
  constructor(private readonly root: BehaviorNode<TContext>) {}

  tick(context: TContext): BehaviorStatus {
    const result = this.root.tick(context);
    if (result !== 'running') {
      this.root.reset?.();
    }
    return result;
  }
}

class SequenceNode<TContext> implements BehaviorNode<TContext> {
  private index = 0;

  constructor(private readonly children: BehaviorNode<TContext>[]) {}

  tick(context: TContext): BehaviorStatus {
    while (this.index < this.children.length) {
      const child = this.children[this.index];
      if (!child) {
        break;
      }
      const status = child.tick(context);
      if (status === 'running') {
        return 'running';
      }
      if (status === 'failure') {
        this.reset();
        return 'failure';
      }
      this.index += 1;
    }
    this.reset();
    return 'success';
  }

  reset(): void {
    this.index = 0;
    for (const child of this.children) {
      child.reset?.();
    }
  }
}

class SelectorNode<TContext> implements BehaviorNode<TContext> {
  private index = 0;

  constructor(private readonly children: BehaviorNode<TContext>[]) {}

  tick(context: TContext): BehaviorStatus {
    while (this.index < this.children.length) {
      const child = this.children[this.index];
      if (!child) {
        break;
      }
      const status = child.tick(context);
      if (status === 'running') {
        return 'running';
      }
      if (status === 'success') {
        this.reset();
        return 'success';
      }
      this.index += 1;
    }
    this.reset();
    return 'failure';
  }

  reset(): void {
    this.index = 0;
    for (const child of this.children) {
      child.reset?.();
    }
  }
}

class ActionNode<TContext> implements BehaviorNode<TContext> {
  constructor(private readonly action: BehaviorAction<TContext>) {}

  tick(context: TContext): BehaviorStatus {
    return this.action(context);
  }
}

class ConditionNode<TContext> implements BehaviorNode<TContext> {
  constructor(private readonly condition: BehaviorCondition<TContext>) {}

  tick(context: TContext): BehaviorStatus {
    return this.condition(context) ? 'success' : 'failure';
  }
}

/**
 * Creates a sequence node that succeeds when all children succeed in order.
 * Useful for: chained tasks that must all complete.
 */
export function sequence<TContext>(
  ...children: BehaviorNode<TContext>[]
): BehaviorNode<TContext> {
  return new SequenceNode(children);
}

/**
 * Creates a selector node that succeeds when the first child succeeds.
 * Useful for: fallback behaviours where the first successful option is chosen.
 */
export function selector<TContext>(
  ...children: BehaviorNode<TContext>[]
): BehaviorNode<TContext> {
  return new SelectorNode(children);
}

/**
 * Wraps a synchronous action into a behavior node.
 * Useful for: tasks that modify context and return a status.
 */
export function action<TContext>(fn: BehaviorAction<TContext>): BehaviorNode<TContext> {
  return new ActionNode(fn);
}

/**
 * Wraps a boolean check into a behavior node.
 * Useful for: guard clauses and branching logic.
 */
export function condition<TContext>(fn: BehaviorCondition<TContext>): BehaviorNode<TContext> {
  return new ConditionNode(fn);
}

export const __internals = {
  SequenceNode,
  SelectorNode,
  ActionNode,
  ConditionNode,
};
