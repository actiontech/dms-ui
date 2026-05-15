/**
 * 详情接口内各模块的 state（与后端约定一致，大小写不敏感）
 */
export type NormalizedOptimizationModuleState = 'running' | 'done' | 'failed';

export const normalizeOptimizationModuleState = (
  state?: string
): NormalizedOptimizationModuleState | undefined => {
  if (!state) {
    return undefined;
  }
  if (state === 'running' || state === 'done' || state === 'failed') {
    return state;
  }
  return undefined;
};
