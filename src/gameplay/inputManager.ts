const DEFAULT_AXIS_THRESHOLD = 0.4;
const DEFAULT_ACTION_TYPE: InputActionType = 'digital';
const DEFAULT_GAMEPAD_ID = 'default';

type ModifierFlags = {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

export type InputActionType = 'digital' | 'analog';

export interface KeyboardBinding extends ModifierFlags {
  device: 'keyboard';
  key: string;
}

export interface MouseBinding {
  device: 'mouse';
  button: number;
}

export interface GamepadButtonBinding {
  device: 'gamepad-button';
  button: string | number;
  gamepadId?: string;
}

export interface GamepadAxisBinding {
  device: 'gamepad-axis';
  axis: number;
  direction?: 'positive' | 'negative' | 'both';
  threshold?: number;
  gamepadId?: string;
}

export type InputBinding =
  | KeyboardBinding
  | MouseBinding
  | GamepadButtonBinding
  | GamepadAxisBinding;

export interface InputActionDefinition {
  id: string;
  bindings: ReadonlyArray<InputBinding>;
  type?: InputActionType;
  deadzone?: number;
}

export interface InputManagerOptions {
  actions: ReadonlyArray<InputActionDefinition>;
  getTime?: () => number;
  defaultAxisThreshold?: number;
}

export interface InputActionState {
  id: string;
  active: boolean;
  value: number;
  changedAt: number;
  type: InputActionType;
}

export interface KeyInputEvent extends ModifierFlags {
  type: 'down' | 'up';
  key: string;
  time?: number;
}

export interface PointerInputEvent {
  type: 'down' | 'up';
  button: number;
  time?: number;
}

export interface GamepadButtonEvent {
  type: 'down' | 'up';
  button: string | number;
  value?: number;
  gamepadId?: string;
  time?: number;
}

export interface GamepadAxisEvent {
  axis: number;
  value: number;
  gamepadId?: string;
  time?: number;
}

export interface InputManager {
  handleKeyEvent(event: KeyInputEvent): boolean;
  handlePointerEvent(event: PointerInputEvent): boolean;
  handleGamepadButton(event: GamepadButtonEvent): boolean;
  handleGamepadAxis(event: GamepadAxisEvent): boolean;
  isActive(actionId: string): boolean;
  getValue(actionId: string): number;
  getState(actionId: string): InputActionState | undefined;
  getActions(): ReadonlyArray<InputActionState>;
  getBindings(actionId: string): ReadonlyArray<InputBinding>;
  setBindings(actionId: string, bindings: ReadonlyArray<InputBinding>): void;
  reset(): void;
}

interface ActionRecord extends InputActionState {
  bindings: InputBinding[];
  deadzone: number;
  sources: Map<string, number>;
}

interface BindingEntry<TBinding extends InputBinding> {
  action: ActionRecord;
  binding: TBinding;
  sourceKey: string;
}

type KeyboardBindingEntry = BindingEntry<KeyboardBinding>;
type MouseBindingEntry = BindingEntry<MouseBinding>;
type GamepadButtonBindingEntry = BindingEntry<GamepadButtonBinding>;
type GamepadAxisBindingEntry = BindingEntry<GamepadAxisBinding>;

export function createInputManager(options: InputManagerOptions): InputManager {
  const { getTime } = options;
  const axisThreshold = options.defaultAxisThreshold ?? DEFAULT_AXIS_THRESHOLD;

  const actionsById = new Map<string, ActionRecord>();
  const actions: ActionRecord[] = [];

  const keyboardBindings: KeyboardBindingEntry[] = [];
  const mouseBindings: MouseBindingEntry[] = [];
  const gamepadButtonBindings: GamepadButtonBindingEntry[] = [];
  const gamepadAxisBindings: GamepadAxisBindingEntry[] = [];

  function resolveTime(explicit?: number): number {
    if (explicit !== undefined) {
      assertFiniteNumber(explicit, 'time');
      return explicit;
    }
    if (getTime) {
      const value = getTime();
      assertFiniteNumber(value, 'getTime()');
      return value;
    }
    return Date.now() / 1000;
  }

  function registerAction(definition: InputActionDefinition): void {
    validateActionDefinition(definition);
    const normalized: ActionRecord = {
      id: definition.id,
      bindings: [...definition.bindings],
      type: definition.type ?? DEFAULT_ACTION_TYPE,
      deadzone: definition.deadzone ?? axisThreshold,
      active: false,
      value: 0,
      changedAt: 0,
      sources: new Map<string, number>(),
    };
    actionsById.set(normalized.id, normalized);
    actions.push(normalized);
    registerBindings(normalized);
  }

  function clearBindings(action: ActionRecord): void {
    filterInPlace(keyboardBindings, (entry) => entry.action !== action);
    filterInPlace(mouseBindings, (entry) => entry.action !== action);
    filterInPlace(gamepadButtonBindings, (entry) => entry.action !== action);
    filterInPlace(gamepadAxisBindings, (entry) => entry.action !== action);
    action.sources.clear();
    action.active = false;
    action.value = 0;
    action.changedAt = resolveTime();
  }

  function registerBindings(action: ActionRecord): void {
    action.bindings.forEach((binding, index) => {
      validateBinding(binding, action.id);
      const sourceKey = `${action.id}:${index}`;
      switch (binding.device) {
        case 'keyboard':
          keyboardBindings.push({ action, binding, sourceKey });
          break;
        case 'mouse':
          mouseBindings.push({ action, binding, sourceKey });
          break;
        case 'gamepad-button':
          gamepadButtonBindings.push({ action, binding, sourceKey });
          break;
        case 'gamepad-axis':
          gamepadAxisBindings.push({ action, binding, sourceKey });
          break;
      }
    });
  }

  function applySourceValue(action: ActionRecord, sourceKey: string, rawValue: number, timestamp: number): boolean {
    if (rawValue === 0) {
      action.sources.delete(sourceKey);
    } else {
      action.sources.set(sourceKey, rawValue);
    }

    const previousValue = action.value;
    const previousActive = action.active;

    if (action.type === 'digital') {
      action.value = action.sources.size > 0 ? 1 : 0;
      action.active = action.value === 1;
    } else {
      let best = 0;
      for (const candidate of action.sources.values()) {
        if (Math.abs(candidate) > Math.abs(best)) {
          best = candidate;
        }
      }
      action.value = best;
      action.active = action.sources.size > 0;
    }

    if (action.value !== previousValue || action.active !== previousActive) {
      action.changedAt = timestamp;
      return true;
    }
    return false;
  }

  function handleKeyboard(event: KeyInputEvent): boolean {
    const timestamp = resolveTime(event.time);
    let handled = false;
    for (const entry of keyboardBindings) {
      if (!matchesKeyboardBinding(entry.binding, event)) {
        continue;
      }
      const value = event.type === 'down' ? 1 : 0;
      if (applySourceValue(entry.action, entry.sourceKey, value, timestamp)) {
        handled = true;
      }
    }
    return handled;
  }

  function handlePointer(event: PointerInputEvent): boolean {
    const timestamp = resolveTime(event.time);
    let handled = false;
    for (const entry of mouseBindings) {
      if (entry.binding.button !== event.button) {
        continue;
      }
      const value = event.type === 'down' ? 1 : 0;
      if (applySourceValue(entry.action, entry.sourceKey, value, timestamp)) {
        handled = true;
      }
    }
    return handled;
  }

  function handleGamepadButtonEvent(event: GamepadButtonEvent): boolean {
    const timestamp = resolveTime(event.time);
    let handled = false;
    const eventGamepadId = normalizeGamepadId(event.gamepadId);
    const eventButton = normalizeButton(event.button);
    for (const entry of gamepadButtonBindings) {
      const binding = entry.binding;
      if (eventGamepadId !== normalizeGamepadId(binding.gamepadId)) {
        continue;
      }
      if (eventButton !== normalizeButton(binding.button)) {
        continue;
      }
      const value = event.type === 'down' ? clampDigitalValue(event.value ?? 1) : 0;
      if (applySourceValue(entry.action, entry.sourceKey, value, timestamp)) {
        handled = true;
      }
    }
    return handled;
  }

  function handleGamepadAxisEvent(event: GamepadAxisEvent): boolean {
    assertFiniteNumber(event.value, 'value');
    const timestamp = resolveTime(event.time);
    let handled = false;
    const eventGamepadId = normalizeGamepadId(event.gamepadId);
    for (const entry of gamepadAxisBindings) {
      const binding = entry.binding;
      if (binding.axis !== event.axis) {
        continue;
      }
      if (eventGamepadId !== normalizeGamepadId(binding.gamepadId)) {
        continue;
      }
      const threshold = binding.threshold ?? entry.action.deadzone ?? axisThreshold;
      const value = computeAxisValue(binding, event.value, threshold);
      if (applySourceValue(entry.action, entry.sourceKey, value, timestamp)) {
        handled = true;
      }
    }
    return handled;
  }

  function getActionState(actionId: string): ActionRecord {
    const action = actionsById.get(actionId);
    if (!action) {
      throw new Error(`Unknown action: ${actionId}`);
    }
    return action;
  }

  function getBindingsSnapshot(action: ActionRecord): InputBinding[] {
    return action.bindings.map((binding) => ({ ...binding }));
  }

  function setBindingsForAction(actionId: string, bindings: ReadonlyArray<InputBinding>): void {
    const action = getActionState(actionId);
    clearBindings(action);
    action.bindings = bindings.map((binding) => ({ ...binding }));
    registerBindings(action);
  }

  function resetManager(): void {
    const timestamp = resolveTime();
    for (const action of actions) {
      action.sources.clear();
      action.value = 0;
      if (action.active) {
        action.active = false;
        action.changedAt = timestamp;
      }
    }
  }

  const seenIds = new Set<string>();
  for (const definition of options.actions) {
    if (seenIds.has(definition.id)) {
      throw new Error(`Duplicate action id: ${definition.id}`);
    }
    seenIds.add(definition.id);
    registerAction(definition);
  }

  return {
    handleKeyEvent: (event) => handleKeyboard(event),
    handlePointerEvent: (event) => handlePointer(event),
    handleGamepadButton: (event) => handleGamepadButtonEvent(event),
    handleGamepadAxis: (event) => handleGamepadAxisEvent(event),
    isActive: (actionId) => getActionState(actionId).active,
    getValue: (actionId) => getActionState(actionId).value,
    getState: (actionId) => {
      const action = getActionState(actionId);
      return { id: action.id, active: action.active, value: action.value, changedAt: action.changedAt, type: action.type };
    },
    getActions: () => actions.map((action) => ({ id: action.id, active: action.active, value: action.value, changedAt: action.changedAt, type: action.type })),
    getBindings: (actionId) => getBindingsSnapshot(getActionState(actionId)),
    setBindings: (actionId, bindings) => setBindingsForAction(actionId, bindings),
    reset: () => resetManager(),
  };
}

function filterInPlace<T>(array: T[], predicate: (item: T) => boolean): void {
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < array.length; readIndex += 1) {
    const item = array[readIndex];
    if (predicate(item)) {
      array[writeIndex] = item;
      writeIndex += 1;
    }
  }
  array.length = writeIndex;
}

function matchesKeyboardBinding(binding: KeyboardBinding, event: KeyInputEvent): boolean {
  if (binding.key.toLowerCase() !== event.key.toLowerCase()) {
    return false;
  }
  if (!matchesModifier(binding.ctrlKey, event.ctrlKey)) {
    return false;
  }
  if (!matchesModifier(binding.shiftKey, event.shiftKey)) {
    return false;
  }
  if (!matchesModifier(binding.altKey, event.altKey)) {
    return false;
  }
  if (!matchesModifier(binding.metaKey, event.metaKey)) {
    return false;
  }
  return true;
}

function matchesModifier(expected: boolean | undefined, actual: boolean | undefined): boolean {
  if (expected === undefined) {
    return true;
  }
  return Boolean(actual) === expected;
}

function normalizeGamepadId(id: string | undefined): string {
  return id ?? DEFAULT_GAMEPAD_ID;
}

function normalizeButton(value: string | number): string {
  return typeof value === 'number' ? `#${value}` : value;
}

function clampDigitalValue(value: number): number {
  if (value <= 0) {
    return 0;
  }
  return 1;
}

function computeAxisValue(binding: GamepadAxisBinding, rawValue: number, threshold: number): number {
  assertFiniteNumber(rawValue, 'axis value');
  const direction = binding.direction ?? 'both';
  const magnitude = Math.abs(rawValue);
  if (magnitude < threshold) {
    return 0;
  }
  if (direction === 'positive') {
    return rawValue > 0 ? rawValue : 0;
  }
  if (direction === 'negative') {
    return rawValue < 0 ? rawValue : 0;
  }
  return rawValue;
}

function validateActionDefinition(definition: InputActionDefinition): void {
  if (!definition || typeof definition.id !== 'string' || definition.id.length === 0) {
    throw new Error('Action definitions must include a non-empty id.');
  }
  if (!Array.isArray(definition.bindings)) {
    throw new Error(`Action "${definition.id}" must include bindings.`);
  }
  if (definition.type && definition.type !== 'digital' && definition.type !== 'analog') {
    throw new Error(`Action "${definition.id}" has invalid type.`);
  }
  if (definition.deadzone !== undefined) {
    assertFiniteNumber(definition.deadzone, 'deadzone');
    if (definition.deadzone < 0 || definition.deadzone >= 1) {
      throw new Error('deadzone must be between 0 and 1.');
    }
  }
}

function validateBinding(binding: InputBinding, actionId: string): void {
  switch (binding.device) {
    case 'keyboard':
      if (typeof binding.key !== 'string' || binding.key.length === 0) {
        throw new Error(`Keyboard binding for action "${actionId}" requires a key.`);
      }
      break;
    case 'mouse':
      if (!Number.isInteger(binding.button)) {
        throw new Error(`Mouse binding for action "${actionId}" requires a button index.`);
      }
      break;
    case 'gamepad-button':
      if ((typeof binding.button !== 'string' || binding.button.length === 0) && typeof binding.button !== 'number') {
        throw new Error(`Gamepad button binding for action "${actionId}" requires a button identifier.`);
      }
      break;
    case 'gamepad-axis':
      if (!Number.isInteger(binding.axis)) {
        throw new Error(`Gamepad axis binding for action "${actionId}" requires an axis index.`);
      }
      if (binding.threshold !== undefined) {
        assertFiniteNumber(binding.threshold, 'threshold');
        if (binding.threshold < 0 || binding.threshold >= 1) {
          throw new Error('threshold must be between 0 and 1.');
        }
      }
      break;
    default:
      throw new Error(`Unknown binding device for action "${actionId}".`);
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}
