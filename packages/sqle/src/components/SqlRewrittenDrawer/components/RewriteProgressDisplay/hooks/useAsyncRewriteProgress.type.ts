import { AsyncRewriteTaskStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { IRuleProgressInfo } from '../index.type';

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
  pollingWhenHidden?: boolean; // 页面隐藏时是否继续轮询
}

// Hook 返回的状态和方法
export interface IUseAsyncRewriteProgressReturn {
  // 状态
  isRewriting: boolean; // 是否正在重写（包括启动和轮询过程）
  overallStatus: AsyncRewriteTaskStatusEnum; // 总体任务状态
  ruleProgressList: IRuleProgressInfo[]; // 规则进度信息列表
  completedRulesCount: number; // 已完成规则数量
  totalRulesCount: number; // 总规则数量
  progressPercentage: number; // 完成百分比
  showProgress: boolean; // 是否显示进度组件
  enableStructureOptimize: boolean; // 是否启用结构优化
  errorMessage?: string; // 具体的错误信息文本

  // 时间信息
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  duration?: number; // 持续时间（毫秒）

  // 操作方法
  startRewrite: (
    taskId: string,
    sqlNumber: number,
    enableStructure?: boolean
  ) => void;
  toggleStructureOptimize: (taskId: string, sqlNumber: number) => void;
  reset: () => void; // 重置所有状态并停止轮询
  updateEnableStructureOptimize: (enable: boolean) => void;
  hasSqlBeenRewritten: (sqlNumber: number) => boolean; // 检查 SQL 是否已经重写过
}
