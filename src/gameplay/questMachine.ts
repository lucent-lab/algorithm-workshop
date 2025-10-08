export interface QuestStateNode<TContext extends Record<string, unknown>> {
  id: string;
  terminal?: boolean;
  onEnter?: (context: TContext, payload?: unknown) => void;
  onExit?: (context: TContext, payload?: unknown) => void;
}

export interface QuestTransition<
  TContext extends Record<string, unknown>,
  TEvent = unknown
> {
  from: string;
  to: string;
  event: string;
  condition?: (context: TContext, event: TEvent) => boolean;
  action?: (context: TContext, event: TEvent) => void;
}

export interface QuestMachineOptions<
  TContext extends Record<string, unknown>,
  TEvent = unknown
> {
  states: ReadonlyArray<QuestStateNode<TContext>>;
  transitions: ReadonlyArray<QuestTransition<TContext, TEvent>>;
  initial: string;
  context: TContext;
}

export interface QuestMachineSnapshot<TContext extends Record<string, unknown>> {
  state: string;
  context: TContext;
}

export interface QuestMachine<
  TContext extends Record<string, unknown>,
  TEvent = unknown
> {
  send(event: string, payload?: TEvent): boolean;
  getState(): string;
  getContext(): TContext;
  isCompleted(): boolean;
  reset(snapshot?: QuestMachineSnapshot<TContext>): void;
  toJSON(): QuestMachineSnapshot<TContext>;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createQuestMachine<TContext extends Record<string, unknown>, TEvent = unknown>(
  options: QuestMachineOptions<TContext, TEvent>
): QuestMachine<TContext, TEvent> {
  if (!Array.isArray(options.states) || options.states.length === 0) {
    throw new Error('states must contain at least one state.');
  }
  if (!Array.isArray(options.transitions)) {
    throw new Error('transitions must be an array.');
  }

  const stateMap = new Map<string, QuestStateNode<TContext>>();
  const states = options.states as ReadonlyArray<QuestStateNode<TContext>>;
  for (const state of states) {
    if (stateMap.has(state.id)) {
      throw new Error(`Duplicate state id: ${state.id}`);
    }
    stateMap.set(state.id, state);
  }
  if (!stateMap.has(options.initial)) {
    throw new Error(`Unknown initial state: ${options.initial}`);
  }

  const transitionsByEvent = new Map<string, QuestTransition<TContext, TEvent>[] >();
  const transitions = options.transitions as ReadonlyArray<QuestTransition<TContext, TEvent>>;
  for (const transition of transitions) {
    if (!stateMap.has(transition.from)) {
      throw new Error(`Transition references unknown state: ${transition.from}`);
    }
    if (!stateMap.has(transition.to)) {
      throw new Error(`Transition references unknown state: ${transition.to}`);
    }
    const list = transitionsByEvent.get(transition.event) ?? [];
    list.push(transition);
    transitionsByEvent.set(transition.event, list);
  }

  const initialContext = deepClone(options.context);
  let context = deepClone(options.context);
  let currentStateId = options.initial;

  stateMap.get(currentStateId)?.onEnter?.(context);

  function getStateNode(id: string): QuestStateNode<TContext> {
    const state = stateMap.get(id);
    if (!state) {
      throw new Error(`Unknown state: ${id}`);
    }
    return state;
  }

  function send(event: string, payload?: TEvent): boolean {
    const candidates = transitionsByEvent.get(event);
    if (!candidates) {
      return false;
    }

    for (const transition of candidates) {
      if (transition.from !== currentStateId) {
        continue;
      }
      if (transition.condition && !transition.condition(context, payload as TEvent)) {
        continue;
      }
      const previousState = getStateNode(currentStateId);
      const nextState = getStateNode(transition.to);

      previousState.onExit?.(context, payload);
      transition.action?.(context, payload as TEvent);
      currentStateId = nextState.id;
      nextState.onEnter?.(context, payload);
      return true;
    }

    return false;
  }

  function reset(snapshot?: QuestMachineSnapshot<TContext>): void {
    const source = snapshot ? snapshot.context : initialContext;
    context = deepClone(source);
    const nextStateId = snapshot ? snapshot.state : options.initial;
    if (!stateMap.has(nextStateId)) {
      throw new Error(`Unknown state in snapshot: ${nextStateId}`);
    }
    currentStateId = nextStateId;
    stateMap.get(currentStateId)?.onEnter?.(context);
  }

  return {
    send,
    getState: () => currentStateId,
    getContext: () => context,
    isCompleted: () => Boolean(stateMap.get(currentStateId)?.terminal),
    reset,
    toJSON: () => ({ state: currentStateId, context: deepClone(context) }),
  };
}
