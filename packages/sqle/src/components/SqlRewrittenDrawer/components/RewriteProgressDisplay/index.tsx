import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  StatusTextStyleWrapper,
  ErrorMessageStyleWrapper,
  RewriteFailedStyleWrapper,
  RewrittenSqlDisplayStyleWrapper,
  CompactProgressStyleWrapper,
  RuleItemAnimationStyleWrapper,
  WaveProgressStyleWrapper
} from './style';
import {
  BasicButton,
  CopyIcon,
  floatToPercent,
  SQLRenderer
} from '@actiontech/shared';
import classNames from 'classnames';
import { MOCK_PROCESSING_STAGES } from './index.data';
import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@actiontech/icons';

const RewriteProgressDisplay: React.FC<IRewriteProgressDisplayProps> = ({
  isProgressActive,
  overallStatus,
  ruleProgressList,
  errorMessage,
  onComplete,
  onError,
  onRetry,
  isRetryLoading
}) => {
  const { t } = useTranslation();

  // 用户手动控制的展开/折叠状态
  const [isUserExpanded, setIsUserExpanded] = useState<boolean | null>(null);

  // 计算最终的展开状态：优先使用用户设置，否则根据进度活跃状态决定
  const isExpanded = useMemo(() => {
    if (isUserExpanded !== null) {
      return isUserExpanded;
    }
    return isProgressActive;
  }, [isUserExpanded, isProgressActive]);

  // 用户点击展开/折叠按钮
  const handleToggleExpanded = useCallback(() => {
    setIsUserExpanded((prev) => (prev === null ? !isProgressActive : !prev));
  }, [isProgressActive]);

  // 使用 useRef 来避免依赖循环
  const activeProgressTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 管理每个规则的当前阶段状态
  const [ruleProcessingStages, setRuleProcessingStages] = useState<
    Map<
      string,
      {
        currentStageIndex: number;
        mockStatus: MockProgressStatusEnum;
      }
    >
  >(new Map());

  // 完成的规则动画状态
  const [completedRuleAnimations, setCompletedRuleAnimations] = useState<
    Set<string>
  >(new Set());

  // 排序后的规则列表：已完成的在前，未完成的在后
  const sortedRuleList = useMemo(() => {
    const completed = ruleProgressList.filter(
      (rule) => rule.status === RewriteSuggestionStatusEnum.processed
    );
    const processing = ruleProgressList.filter(
      (rule) => rule.status !== RewriteSuggestionStatusEnum.processed
    );
    return [...completed, ...processing];
  }, [ruleProgressList]);

  // 监听规则完成状态变化，触发动画
  useEffect(() => {
    const newCompletedRules = new Set<string>();
    sortedRuleList.forEach((rule) => {
      if (
        rule.status === RewriteSuggestionStatusEnum.processed &&
        !completedRuleAnimations.has(rule.ruleId)
      ) {
        newCompletedRules.add(rule.ruleId);
      }
    });

    if (newCompletedRules.size > 0) {
      setCompletedRuleAnimations(
        (prev) => new Set([...prev, ...newCompletedRules])
      );
      // 动画结束后移除动画状态
      setTimeout(() => {
        setCompletedRuleAnimations((prev) => {
          const newSet = new Set(prev);
          newCompletedRules.forEach((ruleId) => newSet.delete(ruleId));
          return newSet;
        });
      }, 600);
    }
  }, [sortedRuleList, completedRuleAnimations]);

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
          <SQLRenderer.Snippet
            sql={rule.rewrittenSql}
            rows={10}
            tooltip={false}
          />
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
        return t('sqlRewrite.rewriteCompleted');
      case AsyncRewriteTaskStatusEnum.failed:
        return t('sqlRewrite.rewriteFailed');
      default:
        return t('sqlRewrite.aiIsThinking');
    }
  }, [overallStatus, t]);

  // 获取规则状态的显示文本
  const getRuleStatusText = useCallback(
    (rule: IRuleProgressInfo) => {
      const stageData = ruleProcessingStages.get(rule.ruleId);

      if (rule.status === RewriteSuggestionStatusEnum.processed) {
        return t('sqlRewrite.ruleStatusCompleted');
      }

      if (!stageData) {
        return t('sqlRewrite.ruleStatusWaiting');
      }

      const currentStage = MOCK_PROCESSING_STAGES[stageData.currentStageIndex];
      return currentStage.label;
    },
    [ruleProcessingStages, t]
  );

  // 获取规则的当前阶段
  const getRuleCurrentStage = useCallback(
    (rule: IRuleProgressInfo) => {
      const stageData = ruleProcessingStages.get(rule.ruleId);
      if (!stageData) return null;

      return {
        stage: MOCK_PROCESSING_STAGES[stageData.currentStageIndex]
      };
    },
    [ruleProcessingStages]
  );

  // 获取规则项的状态类名
  const getRuleItemStatus = useCallback(
    (
      rule: IRuleProgressInfo
    ): 'processing' | 'completed' | 'error' | 'waiting' => {
      if (rule.status === RewriteSuggestionStatusEnum.processed) {
        return 'completed';
      }
      if (rule.errorMessage) {
        return 'error';
      }
      if (ruleProcessingStages.has(rule.ruleId)) {
        return 'processing';
      }
      return 'waiting';
    },
    [ruleProcessingStages]
  );

  // 清理特定规则的定时器
  const clearRuleTimer = useCallback((ruleId: string) => {
    const timers = activeProgressTimers.current;
    if (timers.has(ruleId)) {
      clearTimeout(timers.get(ruleId)!);
      timers.delete(ruleId);
    }
  }, []);

  // 生成随机阶段持续时间
  const getRandomDuration = useCallback(
    (duration: [number, number]): number => {
      const [min, max] = duration;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    []
  );

  // 管理单个规则的阶段循环
  const startRuleStageProgress = useCallback(
    (ruleId: string) => {
      clearRuleTimer(ruleId);

      let currentStageIndex = 0;

      const stageStep = () => {
        const currentStage = MOCK_PROCESSING_STAGES[currentStageIndex];

        setRuleProcessingStages((prev) => {
          const newMap = new Map(prev);
          newMap.set(ruleId, {
            currentStageIndex,
            mockStatus: currentStage.status
          });
          return newMap;
        });

        // 如果不是最后一个阶段，在延迟后移动到下一个阶段
        if (currentStageIndex < MOCK_PROCESSING_STAGES.length - 1) {
          const randomDuration = getRandomDuration(currentStage.duration);
          const timer = setTimeout(() => {
            currentStageIndex++;
            stageStep();
          }, randomDuration);
          activeProgressTimers.current.set(ruleId, timer);
        }
        // 如果是最后一个阶段，保持在当前阶段不再变化
      };

      stageStep();
    },
    [clearRuleTimer, getRandomDuration]
  );

  // 监听规则状态变化，启动或停止阶段进度
  useEffect(() => {
    ruleProgressList.forEach((rule) => {
      const isProcessing = rule.status === RewriteSuggestionStatusEnum.initial;
      const hasExistingTimer = activeProgressTimers.current.has(rule.ruleId);

      if (isProcessing && !hasExistingTimer) {
        const initialDelay = setTimeout(() => {
          startRuleStageProgress(rule.ruleId);
        }, Math.random() * 1000 + 500);

        activeProgressTimers.current.set(rule.ruleId, initialDelay);
      } else if (!isProcessing && hasExistingTimer) {
        clearRuleTimer(rule.ruleId);
        setRuleProcessingStages((prev) => {
          const newMap = new Map(prev);
          newMap.delete(rule.ruleId);
          return newMap;
        });
      }
    });

    const currentRuleIds = new Set(ruleProgressList.map((rule) => rule.ruleId));
    const timers = activeProgressTimers.current;
    for (const [ruleId] of timers) {
      if (!currentRuleIds.has(ruleId)) {
        clearRuleTimer(ruleId);
        setRuleProcessingStages((prev) => {
          const newMap = new Map(prev);
          newMap.delete(ruleId);
          return newMap;
        });
      }
    }
  }, [ruleProgressList, startRuleStageProgress, clearRuleTimer]);

  // 监听总体完成状态
  useEffect(() => {
    const clearAllTimers = () => {
      const timers = activeProgressTimers.current;
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
    if (overallStatus === AsyncRewriteTaskStatusEnum.completed) {
      clearAllTimers();
      setIsUserExpanded(false);
      onComplete?.();
    } else if (overallStatus === AsyncRewriteTaskStatusEnum.failed) {
      clearAllTimers();
      onError?.(t('sqlRewrite.ruleStatusError'));
    }

    return () => {
      clearAllTimers();
    };
  }, [overallStatus, onComplete, onError, t]);

  // 渲染折叠状态的简洁进度条
  const renderCompactProgress = useCallback(() => {
    return (
      <CompactProgressStyleWrapper>
        <div className="compact-left">
          <span className="compact-title">
            {t('sqlRewrite.rewriteProgressTitle')}
          </span>
          <div className="compact-progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        <div className="compact-right">
          <span>
            {t('sqlRewrite.rulesProcessedProgress', {
              completed: ruleProgressList.filter(
                (r) => r.status === RewriteSuggestionStatusEnum.processed
              ).length,
              total: ruleProgressList.length
            })}
          </span>
          <Button
            className="progress-toggle-button"
            type="text"
            icon={<DownOutlined width={22} height={22} />}
            onClick={handleToggleExpanded}
            size="small"
            title={t('sqlRewrite.expandProgress')}
          />
        </div>
      </CompactProgressStyleWrapper>
    );
  }, [overallProgress, ruleProgressList, t, handleToggleExpanded]);

  if (errorMessage) {
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

  return (
    <RewriteProgressContainerStyleWrapper
      className={classNames({ completed: !isExpanded })}
    >
      {!isExpanded ? (
        renderCompactProgress()
      ) : (
        <>
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
                  completed:
                    overallStatus === AsyncRewriteTaskStatusEnum.completed,
                  error: overallStatus === AsyncRewriteTaskStatusEnum.failed
                })}
              >
                {getOverallStatusText()}
              </span>
            </div>
            <Button
              className="progress-toggle-button"
              type="text"
              icon={<UpOutlined width={22} height={22} />}
              onClick={handleToggleExpanded}
              size="small"
              title={t('sqlRewrite.expandProgress')}
            />
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

          <RuleItemAnimationStyleWrapper>
            <RulesListStyleWrapper>
              {sortedRuleList.map((rule) => {
                return (
                  <RuleItemStyleWrapper
                    key={rule.ruleId}
                    className={classNames('rule-item', 'rule-item-move', {
                      'rule-item-processing':
                        getRuleItemStatus(rule) === 'processing',
                      'rule-item-completed':
                        getRuleItemStatus(rule) === 'completed',
                      'rule-item-error': getRuleItemStatus(rule) === 'error',
                      'rule-completed': completedRuleAnimations.has(rule.ruleId)
                    })}
                  >
                    <RuleHeaderStyleWrapper>
                      <div className="rule-name">{rule.ruleName}</div>
                      <div className="rule-status">
                        <WaveProgressStyleWrapper
                          hidden={
                            rule.status ===
                            RewriteSuggestionStatusEnum.processed
                          }
                          className={`wave-progress ${getRuleItemStatus(rule)}`}
                        >
                          {/* 波浪动画容器 */}
                          <div className="wave-container">
                            <div className="wave-background" />
                            <div className="wave wave1" />
                            <div className="wave wave2" />
                            <div className="wave wave3" />
                          </div>

                          {/* 状态指示器 */}
                          <div className="stage-indicator">
                            {getRuleCurrentStage(rule) && (
                              <div className="stage-dots">
                                {MOCK_PROCESSING_STAGES.map((item, index) => {
                                  const currentStage =
                                    getRuleCurrentStage(rule);
                                  const currentStageIndex = currentStage
                                    ? MOCK_PROCESSING_STAGES.findIndex(
                                        (s) =>
                                          s.status === currentStage.stage.status
                                      )
                                    : -1;

                                  return (
                                    <div
                                      key={item.status}
                                      className={classNames('stage-dot', {
                                        active: index === currentStageIndex,
                                        completed: index < currentStageIndex
                                      })}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </WaveProgressStyleWrapper>

                        <StatusTextStyleWrapper
                          className={classNames('rule-item-status-text', {
                            completed: getRuleItemStatus(rule) === 'completed',
                            error: getRuleItemStatus(rule) === 'error',
                            processing: getRuleItemStatus(rule) === 'processing'
                          })}
                        >
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
                );
              })}
            </RulesListStyleWrapper>
          </RuleItemAnimationStyleWrapper>
        </>
      )}
    </RewriteProgressContainerStyleWrapper>
  );
};

export default RewriteProgressDisplay;
