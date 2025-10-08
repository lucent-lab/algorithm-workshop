
export type DamageType = 'physical' | 'magical' | 'true';

export interface CombatantStats {
  health: number;
  attack: number;
  defense: number;
  resistance: number;
  critChance?: number;
  critMultiplier?: number;
}

export interface DamageModifiers {
  flat?: number;
  multiplier?: number;
  type?: DamageType;
  random?: () => number;
}

export interface DamageResult {
  damage: number;
  type: DamageType;
  isCrit: boolean;
}

export interface CooldownController {
  trigger(id: string, cooldown: number): boolean;
  update(delta: number): void;
  reset(): void;
  getRemaining(id: string): number;
}

export interface StatusEffect {
  id: string;
  duration: number;
  tickInterval?: number;
  onApply?: (target: CombatantStats) => void;
  onTick?: (target: CombatantStats) => void;
  onExpire?: (target: CombatantStats) => void;
}

export interface ActiveStatusEffect extends StatusEffect {
  remaining: number;
  tickTimer?: number;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertNonNegative(value: number, label: string): void {
  assertFinite(value, label);
  if (value < 0) {
    throw new Error(`${label} must be non-negative.`);
  }
}

function resolveMitigation(type: DamageType, defender: CombatantStats): number {
  if (type === 'true') {
    return 0;
  }
  return type === 'magical' ? defender.resistance : defender.defense;
}

/**
 * Calculates damage between two combatants with optional modifiers.
 */
export function calculateDamage(
  attacker: CombatantStats,
  defender: CombatantStats,
  modifiers: DamageModifiers = {}
): DamageResult {
  assertFinite(attacker.attack, 'attacker.attack');
  assertFinite(defender.health, 'defender.health');

  const type = modifiers.type ?? 'physical';
  const flat = modifiers.flat ?? 0;
  const multiplier = modifiers.multiplier ?? 1;
  const random = modifiers.random ?? Math.random;

  assertNonNegative(flat, 'flat');
  assertNonNegative(multiplier, 'multiplier');

  const mitigation = resolveMitigation(type, defender);
  const base = Math.max(attacker.attack * multiplier + flat - mitigation, 0);
  const critChance = Math.max(0, attacker.critChance ?? 0);
  const critMultiplier = attacker.critMultiplier ?? 1.5;
  const isCrit = random() < critChance;
  const damage = Math.max(0, Math.round(base * (isCrit ? critMultiplier : 1)));

  return { damage, type, isCrit };
}

/**
 * Applies damage to a target and returns a new stat snapshot.
 */
export function applyDamage(target: CombatantStats, result: DamageResult): CombatantStats {
  const nextHealth = Math.max(0, target.health - result.damage);
  return { ...target, health: nextHealth };
}

/**
 * Creates a cooldown controller for managing ability cooldowns.
 */
export function createCooldownController(): CooldownController {
  const timers = new Map<string, number>();

  return {
    trigger(id: string, cooldown: number): boolean {
      assertNonNegative(cooldown, 'cooldown');
      const remaining = timers.get(id) ?? 0;
      if (remaining > 0) {
        return false;
      }
      timers.set(id, cooldown);
      return true;
    },
    update(delta: number): void {
      assertNonNegative(delta, 'delta');
      for (const [id, remaining] of timers.entries()) {
        const next = Math.max(remaining - delta, 0);
        timers.set(id, next);
      }
    },
    reset(): void {
      timers.clear();
    },
    getRemaining(id: string): number {
      return timers.get(id) ?? 0;
    },
  };
}

/**
 * Advances active status effects, invoking tick/expire callbacks.
 */
export function updateStatusEffects(
  target: CombatantStats,
  effects: ActiveStatusEffect[],
  delta: number
): ActiveStatusEffect[] {
  assertNonNegative(delta, 'delta');
  const nextState = effects.map((effect) => ({ ...effect }));

  for (const effect of nextState) {
    if (effect.remaining === effect.duration && effect.onApply) {
      effect.onApply(target);
    }

    effect.remaining = Math.max(effect.remaining - delta, 0);
    if (effect.tickInterval !== undefined) {
      effect.tickTimer = (effect.tickTimer ?? effect.tickInterval) - delta;
      if (effect.tickTimer <= 0 && effect.remaining > 0) {
        effect.onTick?.(target);
        effect.tickTimer = effect.tickInterval;
      }
    }

    if (effect.remaining === 0) {
      effect.onExpire?.(target);
    }
  }

  return nextState.filter((effect) => effect.remaining > 0);
}

/**
 * Creates an active status effect instance with default timers.
 */
export function createStatusEffect(effect: StatusEffect): ActiveStatusEffect {
  assertNonNegative(effect.duration, 'duration');
  return {
    ...effect,
    remaining: effect.duration,
    tickTimer: effect.tickInterval,
  };
}
