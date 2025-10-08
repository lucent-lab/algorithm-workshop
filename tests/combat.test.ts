import { describe, expect, it } from 'vitest';

import {
  calculateDamage,
  applyDamage,
  createCooldownController,
  createStatusEffect,
  updateStatusEffects,
} from '../src/index.js';

const baseAttacker = {
  health: 100,
  attack: 20,
  defense: 5,
  resistance: 3,
  critChance: 0.5,
  critMultiplier: 2,
};

const baseDefender = {
  health: 80,
  attack: 10,
  defense: 4,
  resistance: 6,
};

describe('combat helpers', () => {
  it('calculates and applies damage with crits and mitigation', () => {
    const result = calculateDamage(baseAttacker, baseDefender, {
      type: 'physical',
      flat: 2,
      multiplier: 1,
      random: () => 0.1,
    });
    expect(result.isCrit).toBe(true);
    expect(result.damage).toBeGreaterThan(0);

    const updated = applyDamage(baseDefender, result);
    expect(updated.health).toBeLessThan(baseDefender.health);
  });

  it('handles cooldown triggering and updates', () => {
    const cooldowns = createCooldownController();
    expect(cooldowns.trigger('fireball', 3)).toBe(true);
    expect(cooldowns.trigger('fireball', 3)).toBe(false);
    cooldowns.update(1.5);
    expect(cooldowns.getRemaining('fireball')).toBeCloseTo(1.5, 5);
    cooldowns.update(2);
    expect(cooldowns.trigger('fireball', 2)).toBe(true);
  });

  it('applies status effects with ticking and expiry', () => {
    let ticks = 0;
    let expired = false;
    const burn = createStatusEffect({
      id: 'burn',
      duration: 3,
      tickInterval: 1,
      onTick: () => {
        ticks += 1;
      },
      onExpire: () => {
        expired = true;
      },
    });

    let effects = [burn];
    const target = { ...baseDefender };
    effects = updateStatusEffects(target, effects, 1);
    effects = updateStatusEffects(target, effects, 1);
    expect(ticks).toBe(2);
    effects = updateStatusEffects(target, effects, 1);
    expect(expired).toBe(true);
    expect(effects).toHaveLength(0);
  });
});
