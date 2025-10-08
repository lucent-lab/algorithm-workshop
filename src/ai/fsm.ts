export interface StateDefinition<TContext, TEvent> {
  id: string;
  onEnter?: (context: TContext, event?: TEvent) => void;
  onExit?: (context: TContext, event?: TEvent) => void;
  onUpdate?: (context: TContext, delta: number) => void;
}

export interface TransitionDefinition<TContext, TEvent> {
  from: string;
  to: string;
  event: string;
  condition?: (context: TContext, event: TEvent) => boolean;
  action?: (context: TContext, event: TEvent) => void;
}

export interface FSMOptions<TContext, TEvent> {
  initial: string;
  context: TContext;
  states: ReadonlyArray<StateDefinition<TContext, TEvent>>;
  transitions?: ReadonlyArray<TransitionDefinition<TContext, TEvent>>;
}

export interface FSMController<TContext, TEvent> {
  send(eventName: string, payload: TEvent): boolean;
  update(delta: number): void;
  getState(): string;
  getContext(): TContext;
  reset(stateId?: string): void;
}

export function createFSM<TContext, TEvent>(options: FSMOptions<TContext, TEvent>): FSMController<TContext, TEvent> {
  validateOptions(options);

  const stateMap = new Map<string, StateDefinition<TContext, TEvent>>();
  const transitions = new Map<string, TransitionDefinition<TContext, TEvent>[]>();

  for (const state of options.states) {
    if (stateMap.has(state.id)) {
      throw new Error(`Duplicate state id: ${state.id}`);
    }
    stateMap.set(state.id, state);
  }

  if (options.transitions) {
    for (const transition of options.transitions) {
      if (!stateMap.has(transition.from)) {
        throw new Error(`Transition references unknown state: ${transition.from}`);
      }
      if (!stateMap.has(transition.to)) {
        throw new Error(`Transition references unknown state: ${transition.to}`);
      }
      const list = transitions.get(transition.event) ?? [];
      list.push(transition);
      transitions.set(transition.event, list);
    }
  }

  const context = options.context;
  let currentState = requireState(stateMap, options.initial);
  currentState.onEnter?.(context);

  function send(eventName: string, payload: TEvent): boolean {
    const candidates = transitions.get(eventName);
    if (!candidates) {
      return false;
    }
    for (const transition of candidates) {
      if (transition.from !== currentState.id) {
        continue;
      }
      if (transition.condition && !transition.condition(context, payload)) {
        continue;
      }
      const nextState = requireState(stateMap, transition.to);
      currentState.onExit?.(context, payload);
      transition.action?.(context, payload);
      currentState = nextState;
      currentState.onEnter?.(context, payload);
      return true;
    }
    return false;
  }

  function update(delta: number): void {
    assertNonNegative(delta, 'delta');
    currentState.onUpdate?.(context, delta);
  }

  function reset(stateId?: string): void {
    const target = stateId ?? options.initial;
    currentState = requireState(stateMap, target);
    currentState.onEnter?.(context);
  }

  return {
    send,
    update,
    getState: () => currentState.id,
    getContext: () => context,
    reset,
  };
}

function requireState<TContext, TEvent>(
  map: Map<string, StateDefinition<TContext, TEvent>>,
  id: string
): StateDefinition<TContext, TEvent> {
  const state = map.get(id);
  if (!state) {
    throw new Error(`Unknown state: ${id}`);
  }
  return state;
}

function validateOptions<TContext, TEvent>(options: FSMOptions<TContext, TEvent>): void {
  if (!options.initial || typeof options.initial !== 'string') {
    throw new Error('initial state must be provided.');
  }
  if (!Array.isArray(options.states) || options.states.length === 0) {
    throw new Error('states must contain at least one entry.');
  }
  if (!options.states.some((state: StateDefinition<TContext, TEvent>) => state.id === options.initial)) {
    throw new Error(`Unknown initial state: ${options.initial}`);
  }
}

function assertNonNegative(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a non-negative number.`);
  }
}
