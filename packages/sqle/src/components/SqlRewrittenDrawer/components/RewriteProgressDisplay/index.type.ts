import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum,
  RewriteSuggestionTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

// 假进度状态枚举
export enum MockProgressStatusEnum {
  waiting = 'waiting', // 等待中
  preparing = 'preparing', // 准备处理
  analyzing = 'analyzing', // 正在分析
  applying = 'applying', // 正在应用
  completed = 'completed', // 已完成
  failed = 'failed' // 失败
}

// 单个规则的进度信息
export interface IRuleProgressInfo {
  type?: RewriteSuggestionTypeEnum; // 规则类型
  ruleId: string; // 规则ID
  ruleName: string; // 规则名称
  ruleDescription: string; // 规则描述
  status: RewriteSuggestionStatusEnum; // 真实状态 (initial/processed)
  mockStatus?: MockProgressStatusEnum; // 假进度状态
  errorMessage?: string; // 错误信息
  rewrittenSql?: string; // 重写后的SQL
}

// 进度展示组件的 Props
export interface IRewriteProgressDisplayProps {
  visible: boolean; // 是否显示进度展示
  overallStatus: AsyncRewriteTaskStatusEnum; // 总任务状态
  ruleProgressList: IRuleProgressInfo[]; // 规则列表
  errorMessage?: string; // 错误信息
  onComplete?: () => void; // 完成回调
  onError?: (error: string) => void; // 错误回调
  onRetry?: () => void; // 重试回调
  isRetryLoading?: boolean; // 重试是否正在加载
  onCloseConfirm?: () => boolean; // 关闭确认回调，返回 true 表示可以关闭
}
