export interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  scrollOffset: number;
  viewportHeight: number;
  overscan?: number;
  measurements?: ReadonlyArray<number | undefined>;
}

export interface VirtualItem {
  index: number;
  offset: number;
  size: number;
}

export interface VirtualRange {
  startIndex: number;
  endIndex: number;
  padFront: number;
  padEnd: number;
  totalSize: number;
  items: VirtualItem[];
}

/**
 * Calculates the visible window for fixed-height virtual scrolling.
 * Useful for: list virtualization, large table rendering, incremental rendering strategies.
 */
export function calculateVirtualRange(options: VirtualScrollOptions): VirtualRange {
  validateOptions(options);

  const {
    itemCount,
    itemHeight,
    viewportHeight,
    measurements = [],
  } = options;
  let { scrollOffset, overscan = 1 } = options;

  if (itemCount === 0) {
    return {
      startIndex: 0,
      endIndex: -1,
      padFront: 0,
      padEnd: 0,
      totalSize: 0,
      items: [],
    };
  }

  overscan = clampInteger(overscan, 0);
  scrollOffset = Math.max(0, scrollOffset);

  const totalSize = computeTotalSize(itemCount, itemHeight, measurements);
  const maxOffset = Math.max(0, totalSize - viewportHeight);
  const normalizedOffset = Math.min(scrollOffset, maxOffset);

  const baseVisible = Math.max(1, Math.ceil(viewportHeight / itemHeight));
  let startIndex = Math.floor(normalizedOffset / itemHeight) - overscan;
  startIndex = clampInteger(startIndex, 0, itemCount - 1);
  const desiredCount = baseVisible + overscan * 2;
  let endIndex = startIndex + desiredCount - 1;
  endIndex = clampInteger(endIndex, startIndex, itemCount - 1);

  const padFront = computePadFront(startIndex, itemHeight, measurements);
  const items = buildItems(startIndex, endIndex, padFront, itemHeight, measurements);
  const lastItem = items.length > 0 ? items[items.length - 1] : undefined;
  const renderedSize = lastItem ? lastItem.offset + lastItem.size - padFront : 0;
  const padEnd = Math.max(0, totalSize - padFront - renderedSize);

  return {
    startIndex,
    endIndex,
    padFront,
    padEnd,
    totalSize,
    items,
  };
}

function validateOptions(options: VirtualScrollOptions): void {
  const { itemCount, itemHeight, viewportHeight, scrollOffset, overscan, measurements } = options;
  if (!Number.isInteger(itemCount) || itemCount < 0) {
    throw new TypeError('itemCount must be a non-negative integer');
  }
  if (!Number.isFinite(itemHeight) || itemHeight <= 0) {
    throw new TypeError('itemHeight must be a positive number');
  }
  if (!Number.isFinite(viewportHeight) || viewportHeight < 0) {
    throw new TypeError('viewportHeight must be a non-negative number');
  }
  if (!Number.isFinite(scrollOffset) || scrollOffset < 0) {
    throw new TypeError('scrollOffset must be a non-negative number');
  }
  if (overscan !== undefined && (!Number.isFinite(overscan) || overscan < 0)) {
    throw new TypeError('overscan must be a non-negative number');
  }
  if (measurements) {
    measurements.forEach((value, index) => {
      if (value === undefined) {
        return;
      }
      if (!Number.isFinite(value) || value <= 0) {
        throw new TypeError(`measurements[${index}] must be a positive number when defined`);
      }
    });
  }
}

function computeTotalSize(
  itemCount: number,
  itemHeight: number,
  measurements: ReadonlyArray<number | undefined>
): number {
  let total = itemCount * itemHeight;
  for (let index = 0; index < measurements.length && index < itemCount; index += 1) {
    const override = measurements[index];
    if (override !== undefined) {
      total += override - itemHeight;
    }
  }
  return total;
}

function computePadFront(
  startIndex: number,
  itemHeight: number,
  measurements: ReadonlyArray<number | undefined>
): number {
  if (startIndex === 0) {
    return 0;
  }
  let pad = startIndex * itemHeight;
  for (let index = 0; index < measurements.length && index < startIndex; index += 1) {
    const override = measurements[index];
    if (override !== undefined) {
      pad += override - itemHeight;
    }
  }
  return pad;
}

function buildItems(
  startIndex: number,
  endIndex: number,
  initialOffset: number,
  itemHeight: number,
  measurements: ReadonlyArray<number | undefined>
): VirtualItem[] {
  if (endIndex < startIndex) {
    return [];
  }
  const items: VirtualItem[] = [];
  let offset = initialOffset;
  for (let index = startIndex; index <= endIndex; index += 1) {
    const measurement = index < measurements.length ? measurements[index] : undefined;
    const size = measurement ?? itemHeight;
    items.push({ index, offset, size });
    offset += size;
  }
  return items;
}

function clampInteger(value: number, min: number, max?: number): number {
  const integer = Math.floor(value);
  if (max === undefined) {
    return Math.max(min, integer);
  }
  return Math.min(Math.max(min, integer), max);
}
