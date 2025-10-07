import { BehaviorTree, sequence, selector, action, condition } from '../src/index.js';

type Context = {
  enemyVisible: boolean;
  ammo: number;
};

const attack = sequence<Context>(
  condition((ctx) => ctx.enemyVisible),
  condition((ctx) => ctx.ammo > 0),
  action((ctx) => {
    ctx.ammo -= 1;
    console.log('Firing at enemy');
    return 'success';
  })
);

const patrol = action<Context>(() => {
  console.log('Patrolling area');
  return 'success';
});

const tree = new BehaviorTree(selector(attack, patrol));

const context: Context = { enemyVisible: true, ammo: 2 };
console.log('Tick 1:', tree.tick(context));
console.log('Tick 2:', tree.tick(context));
console.log('Tick 3:', tree.tick({ enemyVisible: false, ammo: 0 }));
