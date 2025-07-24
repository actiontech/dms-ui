import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum,
  RewriteSuggestionTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

// 假进度状态枚举
export enum MockProgressStatusEnum {
  waiting = 'waiting', // 等待中
  applyingRule = 'applyingRule', // 应用规则
  modelEvaluating = 'modelEvaluating', // 模型评估
  analyzing = 'analyzing', // 分析与其他规则关系
  applyRewrite = 'applyRewrite', // 应用重写
  verifying = 'verifying', // 验证结果
  failed = 'failed' // 失败
}

// 处理阶段定义
export interface IProcessingStage {
  status: MockProgressStatusEnum;
  label: string;
  duration: [number, number]; // [最小时长, 最大时长] 毫秒
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

// 内容预告项
export interface IContentPreviewItem {
  key: string;
  title: string;
  description?: string;
}

// 进度展示组件的 Props
export interface IRewriteProgressDisplayProps {
  isProgressActive: boolean; // 进度是否处于活跃状态（正在进行或刚完成）
  overallStatus: AsyncRewriteTaskStatusEnum; // 总任务状态
  ruleProgressList: IRuleProgressInfo[]; // 规则列表
  errorMessage?: string; // 错误信息
  onComplete?: () => void; // 完成回调
  onError?: (error: string) => void; // 错误回调
  onRetry?: () => void; // 重试回调
  isRetryLoading?: boolean; // 重试是否正在加载
  onCloseConfirm?: () => boolean; // 关闭确认回调，返回 true 表示可以关闭
}
