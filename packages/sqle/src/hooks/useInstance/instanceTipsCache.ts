export const instanceTipsStore: {
  data: Map<string, unknown[]>;
  inflight: Map<string, Promise<unknown[]>>;
  listeners: Set<() => void>;
} = {
  data: new Map(),
  inflight: new Map(),
  listeners: new Set()
};

export const getInstanceTipsCacheKey = (params: {
  project_name?: string;
  filter_db_type?: string;
  filter_by_business?: string;
  filter_workflow_template_id?: string;
  functional_module?: string;
}): string => {
  return JSON.stringify({
    project_name: params.project_name,
    filter_db_type: params.filter_db_type ?? '',
    filter_by_business: params.filter_by_business ?? '',
    filter_workflow_template_id: params.filter_workflow_template_id ?? '',
    functional_module: params.functional_module ?? ''
  });
};

export const resetInstanceTipsCacheForTests = () => {
  instanceTipsStore.data.clear();
  instanceTipsStore.inflight.clear();
};

export const notifyInstanceTipsListeners = () => {
  instanceTipsStore.listeners.forEach((listener) => listener());
};
