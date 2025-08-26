import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { IRuleProgressInfo } from '../index.type';
import { IRewriteTaskResult } from './useAsyncRewriteProgress.type';
import { floatToPercent } from '@actiontech/dms-kit/es/utils/Math';

/**
 * 将后端返回的 IRewriteSuggestion[] 转换为前端进度展示所需的 IRuleProgressInfo[]
 */
export const mapSuggestionsToRuleProgress = (
  suggestions: IRewriteSuggestion[]
): IRuleProgressInfo[] => {
  if (!suggestions || !Array.isArray(suggestions)) {
    return [];
  }

  return suggestions.map((suggestion, index) => ({
    type: suggestion.type,
    ruleId: `rule_${index}_${suggestion.rule_name || 'unknown'}`,
    ruleName: suggestion.rule_name || `rule_${index + 1}`,
    ruleDescription: suggestion.desc || '',
    status: suggestion.status || RewriteSuggestionStatusEnum.initial,
    errorMessage: undefined, // 可以在后续处理错误时设置
    rewrittenSql: suggestion.rewritten_sql // 添加重写后的SQL
  }));
};

/**
 * 计算整体进度百分比
 */
export const calculateOverallProgress = (
  rules: IRuleProgressInfo[]
): number => {
  if (!rules || rules.length === 0) {
    return 0;
  }

  const completedCount = rules.filter(
    (rule) => rule.status === RewriteSuggestionStatusEnum.processed
  ).length;
  return floatToPercent(completedCount / rules.length);
};

/**
 * 计算已完成规则数量
 */
export const calculateCompletedRulesCount = (
  rules: IRuleProgressInfo[]
): number => {
  if (!rules || rules.length === 0) {
    return 0;
  }

  return rules.filter(
    (rule) => rule.status === RewriteSuggestionStatusEnum.processed
  ).length;
};

/**
 * 检查任务是否已完成
 */
export const isTaskCompleted = (
  overallStatus: AsyncRewriteTaskStatusEnum,
  rules: IRuleProgressInfo[]
): boolean => {
  // 任务状态为完成
  if (overallStatus === AsyncRewriteTaskStatusEnum.completed) {
    return true;
  }

  // 或者所有规则都已处理完毕
  if (rules && rules.length > 0) {
    return rules.every(
      (rule) => rule.status === RewriteSuggestionStatusEnum.processed
    );
  }

  return false;
};

/**
 * 检查任务是否失败
 */
export const isTaskFailed = (
  overallStatus: AsyncRewriteTaskStatusEnum
): boolean => {
  return overallStatus === AsyncRewriteTaskStatusEnum.failed;
};

/**
 * 检查是否需要停止轮询
 */
export const shouldStopPolling = (
  overallStatus: AsyncRewriteTaskStatusEnum,
  rules: IRuleProgressInfo[]
): boolean => {
  // 任务失败
  if (overallStatus === AsyncRewriteTaskStatusEnum.failed) {
    return true;
  }

  // 所有规则都已处理完毕
  if (
    overallStatus === AsyncRewriteTaskStatusEnum.completed &&
    isTaskCompleted(overallStatus, rules)
  ) {
    return true;
  }

  return false;
};

/**
 * 构建重写任务结果
 */
export const buildRewriteTaskResult = (
  rewriteData: any
): IRewriteTaskResult | undefined => {
  if (!rewriteData) {
    return undefined;
  }

  return {
    rewrittenSql: rewriteData.rewritten_sql,
    businessDesc: rewriteData.business_desc,
    logicDesc: rewriteData.logic_desc,
    rewrittenSqlLogicDesc: rewriteData.rewritten_sql_logic_desc,
    businessNonEquivalentDesc: rewriteData.business_non_equivalent_desc,
    suggestions: rewriteData.suggestions
  };
};

export const shouldUpdateRewriteResult = (
  oldResult: IRewriteTaskResult | undefined,
  newResult: IRewriteTaskResult | undefined
): boolean => {
  if (!oldResult || !newResult) {
    return true;
  }

  const oldSuggestionsProcessCount =
    oldResult.suggestions?.filter(
      (s) => s.status === RewriteSuggestionStatusEnum.processed
    ).length ?? 0;
  const newSuggestionsProcessCount =
    newResult.suggestions?.filter(
      (s) => s.status === RewriteSuggestionStatusEnum.processed
    ).length ?? 0;

  if (oldSuggestionsProcessCount !== newSuggestionsProcessCount) {
    return true;
  }

  return false;
};
