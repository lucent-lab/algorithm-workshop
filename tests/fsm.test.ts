import { describe, expect, it, vi } from 'vitest';

import { createFSM } from '../src/index.js';

describe('createFSM', () => {
  it('transitions states based on events and conditions', () => {
    const context = { energy: 0 };
    const enterIdle = vi.fn();
    const enterActive = vi.fn();
    const exitActive = vi.fn();

    const fsm = createFSM<typeof context, { type: 'start' | 'stop' }>({
      context,
      initial: 'idle',
      states: [
        { id: 'idle', onEnter: enterIdle },
        {
          id: 'active',
          onEnter: () => {
            enterActive();
          },
          onExit: () => {
            exitActive();
          },
          onUpdate: (ctx, delta) => {
            ctx.energy += delta;
          },
        },
      ],
      transitions: [
        { from: 'idle', to: 'active', event: 'start' },
        {
          from: 'active',
          to: 'idle',
          event: 'stop',
          condition: (ctx) => ctx.energy >= 1,
        },
      ],
    });

    expect(fsm.getState()).toBe('idle');
    expect(enterIdle).toHaveBeenCalledTimes(1);

    expect(fsm.send('start', { type: 'start' })).toBe(true);
    expect(fsm.getState()).toBe('active');
    expect(enterActive).toHaveBeenCalledTimes(1);

    fsm.update(0.5);
    expect(context.energy).toBeCloseTo(0.5, 5);
    expect(fsm.send('stop', { type: 'stop' })).toBe(false);

    fsm.update(0.6);
    expect(context.energy).toBeCloseTo(1.1, 5);
    expect(fsm.send('stop', { type: 'stop' })).toBe(true);
    expect(exitActive).toHaveBeenCalledTimes(1);
    expect(fsm.getState()).toBe('idle');
  });

  it('supports reset to explicit state', () => {
    const context = { status: 'idle' };
    const fsm = createFSM<typeof context, { type: 'advance' }>({
      context,
      initial: 'idle',
      states: [
        {
          id: 'idle',
          onEnter: (ctx) => {
            ctx.status = 'idle';
          },
        },
        {
          id: 'busy',
          onEnter: (ctx) => {
            ctx.status = 'busy';
          },
        },
      ],
      transitions: [{ from: 'idle', to: 'busy', event: 'advance' }],
    });

    fsm.send('advance', { type: 'advance' });
    expect(fsm.getState()).toBe('busy');
    expect(context.status).toBe('busy');

    fsm.reset('idle');
    expect(fsm.getState()).toBe('idle');
    expect(context.status).toBe('idle');
  });
});
