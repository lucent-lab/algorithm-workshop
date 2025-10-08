const DEFAULT_CHANNEL = 'master';

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function assertNonNegativeNumber(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
  if (value < 0) {
    throw new Error(`${label} must be non-negative.`);
  }
}

function assertPositiveNumber(value: number, label: string): void {
  assertNonNegativeNumber(value, label);
  if (value === 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
}

export interface SoundManagerOptions {
  maxChannels: number;
  channelLimits?: Record<string, number>;
  getTime?: () => number;
}

export interface PlaySoundOptions<TMetadata = unknown> {
  soundId: string;
  duration: number;
  priority?: number;
  channel?: string;
  metadata?: TMetadata;
  time?: number;
}

export interface SoundHandle<TMetadata = unknown> {
  handleId: number;
  soundId: string;
  channel: string;
  priority: number;
  startedAt: number;
  endsAt: number;
  metadata?: TMetadata;
}

export interface PlaySoundResult<TMetadata = unknown> {
  accepted: boolean;
  handle?: SoundHandle<TMetadata>;
  evicted?: SoundHandle<TMetadata>;
  reason?: 'channel-limit';
}

export interface SoundManager<TMetadata = unknown> {
  play(options: PlaySoundOptions<TMetadata>): PlaySoundResult<TMetadata>;
  stop(handleId: number): SoundHandle<TMetadata> | null;
  update(time?: number): SoundHandle<TMetadata>[];
  getActive(): ReadonlyArray<SoundHandle<TMetadata>>;
  setMaxChannels(count: number): void;
  getMaxChannels(): number;
  reset(): SoundHandle<TMetadata>[];
}

export function createSoundManager<TMetadata = unknown>(
  options: SoundManagerOptions
): SoundManager<TMetadata> {
  assertPositiveInteger(options.maxChannels, 'maxChannels');

  const getTime = options.getTime;
  const channelLimits = new Map<string, number>();
  if (options.channelLimits) {
    for (const [channel, limit] of Object.entries(options.channelLimits)) {
      assertPositiveInteger(limit, `channelLimits.${channel}`);
      channelLimits.set(channel, limit);
    }
  }

  let maxChannels = options.maxChannels;
  let handleCounter = 0;
  const active: SoundHandle<TMetadata>[] = [];

  function resolveTime(explicit?: number): number {
    if (explicit !== undefined) {
      assertNonNegativeNumber(explicit, 'time');
      return explicit;
    }
    if (getTime) {
      const value = getTime();
      assertNonNegativeNumber(value, 'getTime()');
      return value;
    }
    return Date.now() / 1000;
  }

  function getChannelLimit(channel: string): number {
    return channelLimits.get(channel) ?? maxChannels;
  }

  function removeHandle(handle: SoundHandle<TMetadata>): void {
    const index = active.findIndex((entry) => entry.handleId === handle.handleId);
    if (index >= 0) {
      active.splice(index, 1);
    }
  }

  function capacityReached(channel: string): boolean {
    if (active.length >= maxChannels) {
      return true;
    }
    const perChannelLimit = getChannelLimit(channel);
    if (perChannelLimit <= 0) {
      return true;
    }
    let channelCount = 0;
    for (const handle of active) {
      if (handle.channel === channel) {
        channelCount += 1;
        if (channelCount >= perChannelLimit) {
          return true;
        }
      }
    }
    return false;
  }

  function update(time?: number): SoundHandle<TMetadata>[] {
    const expiresAt = resolveTime(time);
    const removed: SoundHandle<TMetadata>[] = [];
    for (let index = active.length - 1; index >= 0; index -= 1) {
      if (active[index].endsAt <= expiresAt) {
        removed.push(active[index]);
        active.splice(index, 1);
      }
    }
    return removed;
  }

  function play(options: PlaySoundOptions<TMetadata>): PlaySoundResult<TMetadata> {
    const channel = options.channel ?? DEFAULT_CHANNEL;
    const priority = options.priority ?? 0;
    assertNonNegativeNumber(priority, 'priority');
    assertPositiveNumber(options.duration, 'duration');

    const currentTime = resolveTime(options.time);
    update(currentTime);

    let evicted: SoundHandle<TMetadata> | undefined;

    if (capacityReached(channel)) {
      const victims: SoundHandle<TMetadata>[] = [];
      if (active.length >= maxChannels) {
        victims.push(...active);
      }
      const channelLimit = getChannelLimit(channel);
      if (channelLimit <= 0) {
        return { accepted: false, reason: 'channel-limit' };
      }
      if (victims.length === 0) {
        for (const handle of active) {
          if (handle.channel === channel) {
            victims.push(handle);
          }
        }
      }

      let candidate: SoundHandle<TMetadata> | null = null;
      for (const handle of victims) {
        if (!candidate || handle.priority < candidate.priority) {
          candidate = handle;
          continue;
        }
        if (candidate && handle.priority === candidate.priority && handle.startedAt < candidate.startedAt) {
          candidate = handle;
        }
      }

      if (!candidate || candidate.priority >= priority) {
        return { accepted: false, reason: 'channel-limit' };
      }

      removeHandle(candidate);
      evicted = candidate;
    }

    const handle: SoundHandle<TMetadata> = {
      handleId: ++handleCounter,
      soundId: options.soundId,
      channel,
      priority,
      startedAt: currentTime,
      endsAt: currentTime + options.duration,
      metadata: options.metadata,
    };

    active.push(handle);

    return { accepted: true, handle, evicted };
  }

  function stop(handleId: number): SoundHandle<TMetadata> | null {
    const index = active.findIndex((handle) => handle.handleId === handleId);
    if (index === -1) {
      return null;
    }
    const [removed] = active.splice(index, 1);
    return removed;
  }

  function getActive(): ReadonlyArray<SoundHandle<TMetadata>> {
    return active.map((handle) => ({ ...handle }));
  }

  function setMaxChannels(count: number): void {
    assertPositiveInteger(count, 'maxChannels');
    maxChannels = count;
    if (active.length > maxChannels) {
      active
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return a.startedAt - b.startedAt;
        })
        .splice(0, active.length - maxChannels);
    }
  }

  function getMaxChannels(): number {
    return maxChannels;
  }

  function reset(): SoundHandle<TMetadata>[] {
    const removed = active.splice(0, active.length);
    return removed;
  }

  return {
    play,
    stop,
    update,
    getActive,
    setMaxChannels,
    getMaxChannels,
    reset,
  };
}
