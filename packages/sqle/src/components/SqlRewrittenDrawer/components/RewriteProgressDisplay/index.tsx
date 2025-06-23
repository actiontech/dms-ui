import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  RefreshOutlined
} from '@actiontech/icons';
import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IRewriteProgressDisplayProps,
  IRuleProgressInfo,
  MockProgressStatusEnum
} from './index.type';
import {
  RewriteProgressContainerStyleWrapper,
  ProgressHeaderStyleWrapper,
  OverallProgressStyleWrapper,
  RulesListStyleWrapper,
  RuleItemStyleWrapper,
  RuleHeaderStyleWrapper,
  RuleDescriptionStyleWrapper,
  CircularProgressStyleWrapper,
  StatusTextStyleWrapper,
  ErrorMessageStyleWrapper,
  RewriteFailedStyleWrapper,
  RewrittenSqlDisplayStyleWrapper
} from './style';
import {
  BasicButton,
  CopyIcon,
  floatToPercent,
  SQLRenderer
} from '@actiontech/shared';
import classNames from 'classnames';

// 假进度步骤配置
const MOCK_PROGRESS_STEPS = [
  { status: MockProgressStatusEnum.preparing, duration: 8000 },
  { status: MockProgressStatusEnum.analyzing, duration: 10000 },
  { status: MockProgressStatusEnum.applying, duration: 12000 }
];

const RewriteProgressDisplay: React.FC<IRewriteProgressDisplayProps> = ({
  visible,
  overallStatus,
  ruleProgressList,
  errorMessage,
  onComplete,
  onError,
  onRetry,
  isRetryLoading
}) => {
  const { t } = useTranslation();

  // 使用 useRef 来避免依赖循环
  const activeProgressTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 管理每个规则的假进度状态
  const [ruleMockProgress, setRuleMockProgress] = useState<
    Map<
      string,
      {
        currentStepIndex: number;
        mockStatus: MockProgressStatusEnum;
        progress: number;
      }
    >
  >(new Map());

  // 渲染重写后的SQL
  const renderRewrittenSql = useCallback(
    (rule: IRuleProgressInfo) => {
      if (
        !rule.rewrittenSql ||
        rule.status !== RewriteSuggestionStatusEnum.processed
      ) {
        return null;
      }

      return (
        <RewrittenSqlDisplayStyleWrapper className="rewritten-sql-display">
          <div className="rewritten-sql-header">
            <div className="sql-label">{t('sqlRewrite.rewrittenSql')}</div>
            <div className="sql-actions">
              <CopyIcon text={rule.rewrittenSql} />
            </div>
          </div>
          <SQLRenderer.Snippet sql={rule.rewrittenSql} />
        </RewrittenSqlDisplayStyleWrapper>
      );
    },
    [t]
  );

  // 计算总进度
  const overallProgress = useMemo(() => {
    const completedRules = ruleProgressList.filter(
      (rule) => rule.status === RewriteSuggestionStatusEnum.processed
    ).length;
    return ruleProgressList.length > 0
      ? floatToPercent(completedRules / ruleProgressList.length)
      : 0;
  }, [ruleProgressList]);

  // 获取总体状态文本
  const getOverallStatusText = useCallback(() => {
    switch (overallStatus) {
      case AsyncRewriteTaskStatusEnum.pending:
        return t('sqlRewrite.aiIsThinking');
      case AsyncRewriteTaskStatusEnum.running:
        return t('sqlRewrite.generatingResultsWithLLM');
      case AsyncRewriteTaskStatusEnum.completed:
        return t('sqlRewrite.updateRewrittenResult');
      case AsyncRewriteTaskStatusEnum.failed:
        return t('sqlRewrite.rewriteFailed');
      default:
        return t('sqlRewrite.aiIsThinking');
    }
  }, [overallStatus, t]);

  // 获取规则状态的显示文本 - 使用 useMemo 优化
  const getRuleStatusText = useCallback(
    (rule: IRuleProgressInfo) => {
      const mockProgressData = ruleMockProgress.get(rule.ruleId);

      if (rule.status === RewriteSuggestionStatusEnum.processed) {
        return t('sqlRewrite.ruleStatusCompleted');
      }

      if (!mockProgressData) {
        return t('sqlRewrite.ruleStatusWaiting');
      }

      switch (mockProgressData.mockStatus) {
        case MockProgressStatusEnum.preparing:
          return t('sqlRewrite.ruleProcessingPreparing', {
            ruleName: rule.ruleName
          });
        case MockProgressStatusEnum.analyzing:
          return t('sqlRewrite.ruleProcessingAnalyzing', {
            ruleName: rule.ruleName
          });
        case MockProgressStatusEnum.applying:
          return t('sqlRewrite.ruleProcessingApplying', {
            ruleName: rule.ruleName
          });
        default:
          return t('sqlRewrite.ruleStatusWaiting');
      }
    },
    [ruleMockProgress, t]
  );

  // 获取规则的图标 - 优化图标大小和旋转动画
  const getRuleIcon = useCallback(
    (rule: IRuleProgressInfo) => {
      const mockProgressData = ruleMockProgress.get(rule.ruleId);

      if (rule.status === RewriteSuggestionStatusEnum.processed) {
        return (
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: '14px' }} />
        );
      }

      if (rule.errorMessage) {
        return (
          <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '14px' }} />
        );
      }

      if (
        mockProgressData &&
        mockProgressData.mockStatus !== MockProgressStatusEnum.waiting
      ) {
        return (
          <RefreshOutlined
            style={{
              color: '#1890ff',
              fontSize: '14px'
            }}
          />
        );
      }

      return (
        <ClockCircleOutlined style={{ color: '#d9d9d9', fontSize: '14px' }} />
      );
    },
    [ruleMockProgress]
  );

  // 检查规则是否正在处理中（需要旋转动画）
  const isRuleProcessing = useCallback(
    (rule: IRuleProgressInfo) => {
      // 如果规则已经处理完成或有错误，不显示旋转动画
      if (
        rule.status === RewriteSuggestionStatusEnum.processed ||
        rule.errorMessage
      ) {
        return false;
      }

      const mockProgressData = ruleMockProgress.get(rule.ruleId);
      return (
        mockProgressData &&
        mockProgressData.mockStatus !== MockProgressStatusEnum.waiting
      );
    },
    [ruleMockProgress]
  );

  // 获取规则的进度百分比 - 使用 useMemo 优化
  const getRuleProgress = useCallback(
    (rule: IRuleProgressInfo) => {
      if (rule.status === RewriteSuggestionStatusEnum.processed) {
        return 100;
      }

      const mockProgressData = ruleMockProgress.get(rule.ruleId);
      if (!mockProgressData) {
        return 0;
      }

      const baseProgress = mockProgressData.currentStepIndex * 25;
      const stepProgress = mockProgressData.progress * 25;
      return Math.min(baseProgress + stepProgress, 95); // 最多到95%，避免在真实完成前显示100%
    },
    [ruleMockProgress]
  );

  // 获取规则项的状态类名
  const getRuleItemStatus = useCallback(
    (rule: IRuleProgressInfo) => {
      if (rule.status === RewriteSuggestionStatusEnum.processed) {
        return 'completed';
      }
      if (rule.errorMessage) {
        return 'error';
      }
      const mockProgressData = ruleMockProgress.get(rule.ruleId);
      if (
        mockProgressData &&
        mockProgressData.mockStatus !== MockProgressStatusEnum.waiting
      ) {
        return 'processing';
      }
      return 'waiting';
    },
    [ruleMockProgress]
  );

  // 清理特定规则的定时器
  const clearRuleTimer = useCallback((ruleId: string) => {
    const timers = activeProgressTimers.current;
    if (timers.has(ruleId)) {
      clearTimeout(timers.get(ruleId)!);
      timers.delete(ruleId);
    }
  }, []);

  // 管理单个规则的假进度 - 优化更新频率
  const startRuleMockProgress = useCallback(
    (ruleId: string) => {
      // 清理可能存在的旧定时器
      clearRuleTimer(ruleId);

      let currentStepIndex = 0;
      let currentProgress = 0;

      const progressStep = () => {
        if (currentStepIndex >= MOCK_PROGRESS_STEPS.length) {
          return;
        }

        const currentStep = MOCK_PROGRESS_STEPS[currentStepIndex];

        setRuleMockProgress((prev) => {
          const newMap = new Map(prev);
          newMap.set(ruleId, {
            currentStepIndex,
            mockStatus: currentStep.status,
            progress: currentProgress / 100
          });
          return newMap;
        });

        currentProgress += 4; // 减少更新频率，从2%改为4%

        if (currentProgress >= 100) {
          currentProgress = 0;
          currentStepIndex++;

          if (currentStepIndex < MOCK_PROGRESS_STEPS.length) {
            const timer = setTimeout(progressStep, 200); // 增加间隔时间
            activeProgressTimers.current.set(ruleId, timer);
          }
        } else {
          const timer = setTimeout(progressStep, currentStep.duration / 25); // 减少更新频率
          activeProgressTimers.current.set(ruleId, timer);
        }
      };

      progressStep();
    },
    [clearRuleTimer]
  );

  // 监听规则状态变化，启动或停止假进度 - 移除 ruleMockProgress 依赖
  useEffect(() => {
    ruleProgressList.forEach((rule) => {
      const isProcessing = rule.status === RewriteSuggestionStatusEnum.initial;
      const hasExistingTimer = activeProgressTimers.current.has(rule.ruleId);

      if (isProcessing && !hasExistingTimer) {
        // 延迟启动假进度，模拟初始等待时间
        const initialDelay = setTimeout(() => {
          startRuleMockProgress(rule.ruleId);
        }, Math.random() * 1000 + 500); // 减少随机延迟范围：0.5-1.5秒

        activeProgressTimers.current.set(rule.ruleId, initialDelay);
      } else if (!isProcessing && hasExistingTimer) {
        // 规则完成时清除假进度和定时器
        clearRuleTimer(rule.ruleId);
        setRuleMockProgress((prev) => {
          const newMap = new Map(prev);
          newMap.delete(rule.ruleId);
          return newMap;
        });
      }
    });

    // 清理已经不存在的规则的定时器
    const currentRuleIds = new Set(ruleProgressList.map((rule) => rule.ruleId));
    const timers = activeProgressTimers.current;
    for (const [ruleId] of timers) {
      if (!currentRuleIds.has(ruleId)) {
        clearRuleTimer(ruleId);
        setRuleMockProgress((prev) => {
          const newMap = new Map(prev);
          newMap.delete(ruleId);
          return newMap;
        });
      }
    }
  }, [ruleProgressList, startRuleMockProgress, clearRuleTimer]);

  // 监听总体完成状态
  useEffect(() => {
    const clearAllTimers = () => {
      const timers = activeProgressTimers.current;
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
    if (overallStatus === AsyncRewriteTaskStatusEnum.completed && onComplete) {
      clearAllTimers();
      onComplete();
    } else if (overallStatus === AsyncRewriteTaskStatusEnum.failed && onError) {
      clearAllTimers();
      onError(t('sqlRewrite.ruleStatusError'));
    }

    return () => {
      clearAllTimers();
    };
  }, [overallStatus, onComplete, onError, t]);

  if (overallStatus === AsyncRewriteTaskStatusEnum.failed && errorMessage) {
    return (
      <RewriteFailedStyleWrapper>
        <div className="rewrite-failed-title">
          {t('sqlRewrite.rewriteFailed')}
        </div>
        <div className="rewrite-failed-message">{errorMessage}</div>

        <BasicButton onClick={onRetry} loading={isRetryLoading}>
          {t('sqlRewrite.retryRewrite')}
        </BasicButton>
      </RewriteFailedStyleWrapper>
    );
  }

  if (!visible) {
    return null;
  }

  return (
    <RewriteProgressContainerStyleWrapper>
      <ProgressHeaderStyleWrapper>
        <div className="progress-title">
          {t('sqlRewrite.rewriteProgressTitle')}
        </div>
        <div className="progress-status">
          {overallStatus === AsyncRewriteTaskStatusEnum.running && (
            <div className="spinner" />
          )}
          <span
            className={classNames('status-text', {
              completed: overallStatus === AsyncRewriteTaskStatusEnum.completed,
              error: overallStatus === AsyncRewriteTaskStatusEnum.failed
            })}
          >
            {getOverallStatusText()}
          </span>
        </div>
      </ProgressHeaderStyleWrapper>

      <OverallProgressStyleWrapper>
        <div className="overall-progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="progress-text">
          {t('sqlRewrite.progressPercentage', {
            percentage: overallProgress
          })}{' '}
          -{' '}
          {t('sqlRewrite.rulesProcessedProgress', {
            completed: ruleProgressList.filter(
              (r) => r.status === RewriteSuggestionStatusEnum.processed
            ).length,
            total: ruleProgressList.length
          })}
        </div>
      </OverallProgressStyleWrapper>

      <RulesListStyleWrapper>
        {ruleProgressList.map((rule) => (
          <RuleItemStyleWrapper
            key={rule.ruleId}
            status={getRuleItemStatus(rule)}
          >
            <RuleHeaderStyleWrapper>
              <div className="rule-name">{rule.ruleName}</div>
              <div className="rule-status">
                <CircularProgressStyleWrapper>
                  <div
                    className={`circular-progress ${getRuleItemStatus(rule)}`}
                    style={
                      {
                        '--progress': `${
                          (getRuleProgress(rule) / 100) * 360
                        }deg`
                      } as React.CSSProperties
                    }
                  />
                  <div
                    className={classNames('progress-icon', {
                      spinning: isRuleProcessing(rule)
                    })}
                  >
                    {getRuleIcon(rule)}
                  </div>
                </CircularProgressStyleWrapper>
                <StatusTextStyleWrapper status={getRuleItemStatus(rule)}>
                  {getRuleStatusText(rule)}
                </StatusTextStyleWrapper>
              </div>
            </RuleHeaderStyleWrapper>

            <RuleDescriptionStyleWrapper>
              {rule.ruleDescription}
            </RuleDescriptionStyleWrapper>

            {rule.errorMessage && (
              <ErrorMessageStyleWrapper>
                {t('sqlRewrite.ruleStatusError')}: {rule.errorMessage}
              </ErrorMessageStyleWrapper>
            )}

            {renderRewrittenSql(rule)}
          </RuleItemStyleWrapper>
        ))}
      </RulesListStyleWrapper>
    </RewriteProgressContainerStyleWrapper>
  );
};

export default RewriteProgressDisplay;
