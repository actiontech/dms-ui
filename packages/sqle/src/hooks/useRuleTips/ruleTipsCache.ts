export const ruleTipsStore: {
  data: Map<string, unknown[]>;
  inflight: Map<string, Promise<unknown[]>>;
  listeners: Set<() => void>;
} = {
  data: new Map(),
  inflight: new Map(),
  listeners: new Set()
};

export const resetRuleTipsCacheForTests = () => {
  ruleTipsStore.data.clear();
  ruleTipsStore.inflight.clear();
};

export const notifyRuleTipsListeners = () => {
  ruleTipsStore.listeners.forEach((listener) => listener());
};
