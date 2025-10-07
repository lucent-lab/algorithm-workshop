/**
 * Creates a deterministic linear congruential generator.
 * Useful for: reproducible procedural content, seeded simulations.
 */
export function createLinearCongruentialGenerator(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
}
