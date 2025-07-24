import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';

// 异步重写任务参数
export interface IAsyncRewriteTaskParams {
  taskId: string;
  sqlNumber: number;
}

// 重写任务结果
export interface IRewriteTaskResult {
  rewrittenSql?: string;
  businessDesc?: string;
  logicDesc?: string;
  rewrittenSqlLogicDesc?: string;
  businessNonEquivalentDesc?: string;
  suggestions?: IRewriteSuggestion[];
}

// Hook 配置选项
export interface IUseAsyncRewriteProgressOptions {
  onSuccess?: (data: IRewriteTaskResult) => void;
  onError?: (error: Error) => void;
  pollingInterval?: number; // 轮询间隔，默认2000ms
}
