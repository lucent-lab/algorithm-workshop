import { describe, expect, it } from 'vitest';

import { createQuestMachine } from '../src/index.js';

describe('createQuestMachine', () => {
  it('advances states based on events and conditions', () => {
    const context = { reputation: 0, reward: 0 };

    const machine = createQuestMachine<{ reputation: number; reward: number }, { hasItem?: boolean }>({
      context,
      initial: 'start',
      states: [
        { id: 'start' },
        {
          id: 'accepted',
          onEnter: (ctx) => {
            ctx.reputation += 10;
          },
        },
        {
          id: 'completed',
          terminal: true,
          onEnter: (ctx) => {
            ctx.reward = 100;
          },
        },
      ],
      transitions: [
        {
          from: 'start',
          to: 'accepted',
          event: 'accept',
        },
        {
          from: 'accepted',
          to: 'completed',
          event: 'turn-in',
          condition: (ctx, payload) => Boolean(payload?.hasItem) && ctx.reputation >= 10,
        },
      ],
    });

    expect(machine.getState()).toBe('start');
    expect(machine.send('turn-in', { hasItem: true })).toBe(false);
    expect(machine.send('accept')).toBe(true);
    expect(machine.getState()).toBe('accepted');
    expect(machine.send('turn-in', { hasItem: true })).toBe(true);
    expect(machine.isCompleted()).toBe(true);
    expect(machine.getContext().reward).toBe(100);
  });

  it('serializes and resets state', () => {
    const machine = createQuestMachine<{ progress: number }, unknown>({
      context: { progress: 0 },
      initial: 'start',
      states: [{ id: 'start' }, { id: 'end', terminal: true }],
      transitions: [
        {
          from: 'start',
          to: 'end',
          event: 'finish',
          action: (ctx) => {
            ctx.progress = 1;
          },
        },
      ],
    });

    machine.send('finish');
    const snapshot = machine.toJSON();
    expect(snapshot.state).toBe('end');
    expect(snapshot.context.progress).toBe(1);

    machine.reset();
    expect(machine.getState()).toBe('start');
    expect(machine.getContext().progress).toBe(0);

    machine.reset(snapshot);
    expect(machine.getState()).toBe('end');
    expect(machine.getContext().progress).toBe(1);
  });
});
