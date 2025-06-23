// Hook 导出
export { useAsyncRewriteProgress } from './useAsyncRewriteProgress';

// 类型导出
export type {
  IAsyncRewriteTaskParams,
  IRewriteTaskResult,
  IUseAsyncRewriteProgressOptions,
  IUseAsyncRewriteProgressReturn
} from './useAsyncRewriteProgress.type';

// 工具函数导出
export {
  mapSuggestionsToRuleProgress,
  calculateOverallProgress,
  calculateCompletedRulesCount,
  isTaskCompleted,
  isTaskFailed,
  calculateDuration,
  shouldStopPolling,
  createDefaultRuleProgress,
  buildRewriteTaskResult
} from './useAsyncRewriteProgress.utils';
