import { createQuestMachine } from '../src/index.js';

const quest = createQuestMachine<{ reputation: number; reward: number }, { hasItem?: boolean }>({
  initial: 'start',
  context: { reputation: 0, reward: 0 },
  states: [
    { id: 'start' },
    {
      id: 'accepted',
      onEnter: (ctx) => {
        ctx.reputation += 5;
        console.log('Quest accepted');
      },
    },
    {
      id: 'completed',
      terminal: true,
      onEnter: (ctx) => {
        ctx.reward = 150;
        console.log('Quest completed!');
      },
    },
  ],
  transitions: [
    { from: 'start', to: 'accepted', event: 'accept' },
    {
      from: 'accepted',
      to: 'completed',
      event: 'turn-in',
      condition: (_ctx, payload) => Boolean(payload?.hasItem),
    },
  ],
});

quest.send('accept');
quest.send('turn-in', { hasItem: true });
console.log('Final context:', quest.getContext());
