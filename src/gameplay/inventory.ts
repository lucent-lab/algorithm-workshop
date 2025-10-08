export interface InventoryItem<TMeta = unknown> {
  id: string;
  quantity: number;
  metadata?: TMeta;
}

export interface InventorySlot<TMeta = unknown> {
  item: InventoryItem<TMeta> | null;
}

export interface InventoryOptions<TMeta = unknown> {
  slots: number;
  maxStack?: number;
  filter?: (item: InventoryItem<TMeta>) => boolean;
}

export interface AddItemOptions<TMeta = unknown> {
  id: string;
  quantity: number;
  metadata?: TMeta;
}

export interface InventorySnapshot<TMeta = unknown> {
  slots: Array<InventoryItem<TMeta> | null>;
}

export interface InventoryController<TMeta = unknown> {
  addItem(item: AddItemOptions<TMeta>): number;
  removeItem(id: string, quantity: number): number;
  getTotalQuantity(id: string): number;
  getSlots(): ReadonlyArray<InventorySlot<TMeta>>;
  clear(): void;
  filter(predicate: (item: InventoryItem<TMeta>) => boolean): InventoryItem<TMeta>[];
  toJSON(): InventorySnapshot<TMeta>;
  load(snapshot: InventorySnapshot<TMeta>): void;
}

function assertPositiveInt(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function normalizeOptions<TMeta>(options: InventoryOptions<TMeta>): Required<InventoryOptions<TMeta>> {
  assertPositiveInt(options.slots, 'slots');
  const maxStack = options.maxStack ?? Number.POSITIVE_INFINITY;
  if (maxStack <= 0) {
    throw new Error('maxStack must be greater than 0.');
  }
  const filter = options.filter ?? (() => true);
  return {
    slots: options.slots,
    maxStack,
    filter,
  };
}

function createEmptySlots<TMeta>(count: number): InventorySlot<TMeta>[] {
  return Array.from({ length: count }, () => ({ item: null }));
}

function cloneItem<TMeta>(item: InventoryItem<TMeta>): InventoryItem<TMeta> {
  return {
    id: item.id,
    quantity: item.quantity,
    metadata: item.metadata,
  };
}

/**
 * Creates a stack-based inventory with optional filtering and serialization helpers.
 * Useful for: RPG inventories, loot systems, and crafting components.
 */
export function createInventory<TMeta>(options: InventoryOptions<TMeta>): InventoryController<TMeta> {
  const config = normalizeOptions(options);
  const slots = createEmptySlots<TMeta>(config.slots);

  function addItem(item: AddItemOptions<TMeta>): number {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('quantity must be a positive integer.');
    }
    if (!config.filter({ id: item.id, quantity: item.quantity, metadata: item.metadata })) {
      return item.quantity;
    }

    let remaining = item.quantity;

    for (const slot of slots) {
      if (!slot.item) {
        continue;
      }
      if (slot.item.id !== item.id) {
        continue;
      }
      const available = config.maxStack - slot.item.quantity;
      if (available <= 0) {
        continue;
      }
      const toTransfer = Math.min(available, remaining);
      slot.item.quantity += toTransfer;
      remaining -= toTransfer;
      if (remaining === 0) {
        return 0;
      }
    }

    for (const slot of slots) {
      if (slot.item !== null) {
        continue;
      }
      const toTransfer = Math.min(config.maxStack, remaining);
      slot.item = {
        id: item.id,
        quantity: toTransfer,
        metadata: item.metadata,
      };
      remaining -= toTransfer;
      if (remaining === 0) {
        break;
      }
    }

    return remaining;
  }

  function removeItem(id: string, quantity: number): number {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('quantity must be a positive integer.');
    }

    let remaining = quantity;
    for (const slot of slots) {
      if (!slot.item || slot.item.id !== id) {
        continue;
      }
      const toRemove = Math.min(slot.item.quantity, remaining);
      slot.item.quantity -= toRemove;
      remaining -= toRemove;
      if (slot.item.quantity === 0) {
        slot.item = null;
      }
      if (remaining === 0) {
        break;
      }
    }
    return quantity - remaining;
  }

  function getTotalQuantity(id: string): number {
    let total = 0;
    for (const slot of slots) {
      if (slot.item && slot.item.id === id) {
        total += slot.item.quantity;
      }
    }
    return total;
  }

  function getSlots(): ReadonlyArray<InventorySlot<TMeta>> {
    return slots;
  }

  function clear(): void {
    for (const slot of slots) {
      slot.item = null;
    }
  }

  function filter(predicate: (item: InventoryItem<TMeta>) => boolean): InventoryItem<TMeta>[] {
    const results: InventoryItem<TMeta>[] = [];
    for (const slot of slots) {
      if (slot.item && predicate(slot.item)) {
        results.push(cloneItem(slot.item));
      }
    }
    return results;
  }

  function toJSON(): InventorySnapshot<TMeta> {
    return {
      slots: slots.map((slot) => (slot.item ? cloneItem(slot.item) : null)),
    };
  }

  function load(snapshot: InventorySnapshot<TMeta>): void {
    if (!Array.isArray(snapshot.slots) || snapshot.slots.length !== config.slots) {
      throw new Error('snapshot slots length mismatch.');
    }
    snapshot.slots.forEach((item, index) => {
      if (item) {
        if (!Number.isInteger(item.quantity) || item.quantity < 0) {
          throw new Error('snapshot item quantity must be a non-negative integer.');
        }
        slots[index].item = cloneItem(item);
      } else {
        slots[index].item = null;
      }
    });
  }

  return {
    addItem,
    removeItem,
    getTotalQuantity,
    getSlots,
    clear,
    filter,
    toJSON,
    load,
  };
}
