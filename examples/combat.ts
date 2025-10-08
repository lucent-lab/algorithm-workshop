import {
  calculateDamage,
  applyDamage,
  createCooldownController,
  createStatusEffect,
  updateStatusEffects,
} from '../src/index.js';

const attacker = {
  health: 120,
  attack: 30,
  defense: 8,
  resistance: 4,
  critChance: 0.25,
  critMultiplier: 2,
};

const defender = {
  health: 100,
  attack: 15,
  defense: 10,
  resistance: 6,
};

const damage = calculateDamage(attacker, defender, { type: 'physical', flat: 5 });
const afterHit = applyDamage(defender, damage);
console.log('Damage dealt:', damage.damage, 'Remaining health:', afterHit.health);

const cooldowns = createCooldownController();
console.log('Trigger fireball:', cooldowns.trigger('fireball', 3));
cooldowns.update(1);
console.log('Remaining cooldown:', cooldowns.getRemaining('fireball').toFixed(2));

const burn = createStatusEffect({ id: 'burn', duration: 3, tickInterval: 1, onTick: () => console.log('Burn ticks') });
let effects = [burn];
effects = updateStatusEffects(attacker, effects, 1);
effects = updateStatusEffects(attacker, effects, 1);
effects = updateStatusEffects(attacker, effects, 1);
