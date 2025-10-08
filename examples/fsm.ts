import { createFSM } from '../src/index.js';

interface Context {
  mood: string;
}

type Event =
  | { type: 'greet' }
  | { type: 'aggravate' }
  | { type: 'calm' };

const fsm = createFSM<Context, Event>({
  context: { mood: 'neutral' },
  initial: 'idle',
  states: [
    {
      id: 'idle',
      onEnter: (ctx) => {
        ctx.mood = 'neutral';
      },
    },
    {
      id: 'friendly',
      onEnter: (ctx) => {
        ctx.mood = 'happy';
      },
    },
    {
      id: 'angry',
      onEnter: (ctx) => {
        ctx.mood = 'angry';
      },
    },
  ],
  transitions: [
    { from: 'idle', to: 'friendly', event: 'greet' },
    { from: 'friendly', to: 'angry', event: 'aggravate' },
    { from: 'angry', to: 'friendly', event: 'calm' },
    { from: 'friendly', to: 'idle', event: 'calm' },
  ],
});

console.log('Initial state:', fsm.getState(), fsm.getContext().mood);
fsm.send('greet', { type: 'greet' });
console.log('After greet:', fsm.getState(), fsm.getContext().mood);
fsm.send('aggravate', { type: 'aggravate' });
console.log('After aggravate:', fsm.getState(), fsm.getContext().mood);
fsm.send('calm', { type: 'calm' });
console.log('After calm:', fsm.getState(), fsm.getContext().mood);
