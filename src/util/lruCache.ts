/**
 * Least recently used (LRU) cache with O(1) get/set operations.
 * Useful for: caching API responses, memoizing heavy calculations, resource pools.
 */
export class LRUCache<K, V> {
  private capacity: number;
  private map = new Map<K, V>();

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('capacity must be a positive integer');
    }
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) {
      return undefined;
    }
    const value = this.map.get(key);
    if (value === undefined) {
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      const iterator = this.map.keys().next();
      if (!iterator.done) {
        this.map.delete(iterator.value);
      }
    }
  }
}
