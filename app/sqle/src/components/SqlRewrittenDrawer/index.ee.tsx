import { BasicButton, BasicDrawer, EmptyBox } from '@actiontech/dms-kit';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { CollapseProps, Modal } from 'antd';
import { useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import BusinessRewrittenSuggestion from './components/BusinessRewrittenSuggestion';
import CustomLoadingIndicator from './components/CustomLoadingIndicator';
import DependDatabaseStructure from './components/DependDatabaseStructure';
import OverallRewrittenSuggestion from './components/OverallRewrittenSuggestion';
import RewrittenSuggestionDetails from './components/RewrittenSuggestionDetails';
import RewriteProgressDisplay from './components/RewriteProgressDisplay';
import { useAsyncRewriteProgress } from './components/RewriteProgressDisplay/hooks';
import { SqlRewrittenDrawerWithBaseProps } from './index.type';
import {
  ModuleHeaderTitleStyleWrapper,
  RewrittenSqlCollapseStyleWrapper
} from './style';
import { CollapseItemKeyEnum } from './index.enum';
import { hasSqlBeenRewritten } from './utils/sqlRewriteCache';
import useSqlRewrittenDrawerMockData from './hooks/useSqlRewrittenDrawerMockData';
const SqlRewrittenDrawerEE: React.FC<SqlRewrittenDrawerWithBaseProps> = ({
  open,
  taskID,
  originSqlInfo,
  mockData,
  ...props
}) => {
  const { t } = useTranslation();
  const [modal, modalContextHolder] = Modal.useModal();
  const originSqlNumber = originSqlInfo?.number ?? 0;
  const originalSql = originSqlInfo?.sql ?? '';
  const {
    isMockMode,
    mockRewriteResult,
    mockRuleProgressList,
    mockOverallStatus,
    isMockProgressActive
  } = useSqlRewrittenDrawerMockData(mockData);

  // 使用异步重写进度 hook
  const {
    isRewriting,
    asyncStartLoading,
    showProgress,
    overallStatus,
    ruleProgressList,
    enableStructureOptimize,
    rewriteResult,
    isDelayingComplete,
    startRewrite,
    toggleStructureOptimize,
    resetAllState,
    loadCachedRewriteResult,
    errorMessage,
    updateEnableStructureOptimize
  } = useAsyncRewriteProgress({});
  const currentRewriteResult = isMockMode ? mockRewriteResult : rewriteResult;
  const toggleEnableStructureOptimizeAction = useCallback(() => {
    if (isMockMode) {
      return;
    }
    toggleStructureOptimize(taskID, originSqlNumber);
  }, [isMockMode, toggleStructureOptimize, taskID, originSqlNumber]);

  // 更新重写结果按钮处理
  const handleUpdateRewriteResult = useCallback(() => {
    if (isMockMode) {
      return;
    }
    updateEnableStructureOptimize(false);
    startRewrite(taskID, originSqlNumber, false);
  }, [
    isMockMode,
    startRewrite,
    taskID,
    originSqlNumber,
    updateEnableStructureOptimize
  ]);

  // 重试重写处理
  const handleRetryRewrite = useCallback(() => {
    if (isMockMode) {
      return;
    }
    startRewrite(taskID, originSqlNumber, enableStructureOptimize);
  }, [
    isMockMode,
    startRewrite,
    taskID,
    originSqlNumber,
    enableStructureOptimize
  ]);

  // 检查是否有重写任务正在进行
  const isRewriteTaskRunning = useMemo(() => {
    if (isMockMode) {
      return false;
    }
    return isRewriting || showProgress || isDelayingComplete;
  }, [isMockMode, isRewriting, showProgress, isDelayingComplete]);

  // 处理抽屉关闭确认
  const handleDrawerClose = useCallback(() => {
    if (isMockMode) {
      props.onClose?.();
      resetAllState();
      return;
    }
    if (isRewriteTaskRunning) {
      modal.confirm({
        title: t('sqlRewrite.closeDrawerConfirm'),
        onOk: () => {
          props.onClose?.();
          resetAllState();
        }
      });
    } else {
      props.onClose?.();
      resetAllState();
    }
  }, [isMockMode, isRewriteTaskRunning, t, props, resetAllState, modal]);

  // 页面离开确认
  usePrompt(
    t('sqlRewrite.leavePageConfirm'),
    !isMockMode && isRewriteTaskRunning
  );
  const collapseItems = useMemo<CollapseProps['items']>(() => {
    // 如果没有重写结果，返回空数组
    if (!currentRewriteResult?.suggestions) {
      return [];
    }
    const statementTypeSuggestion: IRewriteSuggestion[] = [];
    const structureTypeSuggestion: IRewriteSuggestion[] = [];
    const otherTypeSuggestion: IRewriteSuggestion[] = [];
    currentRewriteResult.suggestions.forEach((item) => {
      if (item.type === RewriteSuggestionTypeEnum.statement) {
        statementTypeSuggestion.push(item);
      } else if (item.type === RewriteSuggestionTypeEnum.structure) {
        structureTypeSuggestion.push(item);
      } else if (item.type === RewriteSuggestionTypeEnum.other) {
        otherTypeSuggestion.push(item);
      }
    });
    const optimizedSuggestions = enableStructureOptimize
      ? [...statementTypeSuggestion, ...structureTypeSuggestion]
      : statementTypeSuggestion;
    const remainingSuggestions = enableStructureOptimize
      ? []
      : structureTypeSuggestion;
    const businessSuggestions = otherTypeSuggestion;
    return [
      {
        key: CollapseItemKeyEnum.overall_rewritten_suggestion,
        label: (
          <ModuleHeaderTitleStyleWrapper>
            <span className="title">
              {t('sqlRewrite.overallRewriteSuggestions')}
            </span>
          </ModuleHeaderTitleStyleWrapper>
        ),
        children: (
          <OverallRewrittenSuggestion
            originalSql={originalSql}
            businessNonEquivalentDesc={
              currentRewriteResult.businessNonEquivalentDesc
            }
            rewrittenSql={currentRewriteResult.rewrittenSql}
            suggestions={currentRewriteResult.suggestions}
            optimizedCount={optimizedSuggestions.length}
            remainingCount={remainingSuggestions.length}
            businessCount={businessSuggestions.length}
            businessDesc={currentRewriteResult.businessDesc ?? ''}
            sqlLogicDesc={currentRewriteResult.logicDesc ?? ''}
            rewrittenSqlLogicDesc={
              currentRewriteResult.rewrittenSqlLogicDesc ?? ''
            }
            isRewriting={isRewriteTaskRunning}
          />
        )
      },
      {
        key: CollapseItemKeyEnum.rewritten_sql_details,
        label: (
          <ModuleHeaderTitleStyleWrapper>
            <span className="title">
              {t('sqlRewrite.alreadyRewrittenRules')}
            </span>
            <span className="optimized-count count">
              {optimizedSuggestions.length}
            </span>
          </ModuleHeaderTitleStyleWrapper>
        ),
        children: (
          <RewrittenSuggestionDetails
            taskID={taskID}
            sqlNumber={originSqlNumber}
            originalSql={originalSql}
            dataSource={optimizedSuggestions}
            instanceName={originSqlInfo?.instanceName}
            schema={originSqlInfo?.schema}
            showAnalyzeLink={!isMockMode}
          />
        )
      },
      {
        key: CollapseItemKeyEnum.depend_database_structure_optimization,
        label: (
          <div className="flex-space-between">
            <ModuleHeaderTitleStyleWrapper>
              <span className="title">
                {t('sqlRewrite.pendingRewriteRules')}
              </span>
              <span className="remaining-count count">
                {remainingSuggestions.length}
              </span>
            </ModuleHeaderTitleStyleWrapper>

            <EmptyBox if={!isMockMode}>
              <BasicButton onClick={toggleEnableStructureOptimizeAction}>
                {t('sqlRewrite.enableDatabaseStructureOptimization')}
              </BasicButton>
            </EmptyBox>
          </div>
        ),
        children: (
          <DependDatabaseStructure
            dataSource={remainingSuggestions}
            toggleEnableStructureOptimizeAction={
              isMockMode ? undefined : toggleEnableStructureOptimizeAction
            }
          />
        )
      },
      {
        key: CollapseItemKeyEnum.business_rewritten_suggestions,
        label: (
          <ModuleHeaderTitleStyleWrapper>
            <span className="title">
              {t('sqlRewrite.businessInterventionRequired')}
            </span>
            <span className="business-count count">
              {businessSuggestions.length}
            </span>
          </ModuleHeaderTitleStyleWrapper>
        ),
        children: (
          <BusinessRewrittenSuggestion dataSource={businessSuggestions} />
        )
      }
    ].filter((item) => {
      if (remainingSuggestions.length === 0) {
        return (
          item.key !==
          CollapseItemKeyEnum.depend_database_structure_optimization
        );
      }
      return true;
    });
  }, [
    currentRewriteResult?.suggestions,
    currentRewriteResult?.businessNonEquivalentDesc,
    currentRewriteResult?.rewrittenSql,
    currentRewriteResult?.businessDesc,
    currentRewriteResult?.logicDesc,
    currentRewriteResult?.rewrittenSqlLogicDesc,
    enableStructureOptimize,
    t,
    originalSql,
    isRewriteTaskRunning,
    taskID,
    originSqlNumber,
    toggleEnableStructureOptimizeAction,
    isMockMode,
    originSqlInfo?.instanceName,
    originSqlInfo?.schema
  ]);
  useEffect(() => {
    if (isMockMode) {
      return;
    }
    if (open) {
      if (!hasSqlBeenRewritten(taskID, originSqlNumber)) {
        // 初次加载时启动异步重写
        startRewrite(taskID, originSqlNumber, false);
      } else {
        // 加载缓存的重写结果
        loadCachedRewriteResult(taskID, originSqlNumber);
      }
    }
  }, [
    open,
    isMockMode,
    originSqlNumber,
    startRewrite,
    taskID,
    resetAllState,
    loadCachedRewriteResult
  ]);
  const shouldShowUpdateButton =
    !isMockMode && hasSqlBeenRewritten(taskID, originSqlNumber);
  return (
    <BasicDrawer
      {...props}
      onClose={handleDrawerClose}
      open={open}
      extra={
        <EmptyBox if={shouldShowUpdateButton}>
          <BasicButton
            loading={isRewriting}
            type="primary"
            onClick={handleUpdateRewriteResult}
            disabled={isRewriting}
          >
            {isRewriting
              ? t('sqlRewrite.rewriteInProgress')
              : t('sqlRewrite.updateRewrittenResult')}
          </BasicButton>
        </EmptyBox>
      }
    >
      <section>
        {modalContextHolder}

        <EmptyBox if={!isMockMode}>
          <EmptyBox
            if={!asyncStartLoading}
            defaultNode={<CustomLoadingIndicator />}
          >
            <RewriteProgressDisplay
              isProgressActive={showProgress || isDelayingComplete}
              overallStatus={overallStatus}
              ruleProgressList={ruleProgressList}
              errorMessage={errorMessage}
              onRetry={handleRetryRewrite}
              isRetryLoading={isRewriting}
            />

            <RewrittenSqlCollapseStyleWrapper
              defaultActiveKey={[
                CollapseItemKeyEnum.overall_rewritten_suggestion
              ]}
              items={collapseItems}
            />
          </EmptyBox>
        </EmptyBox>
        <EmptyBox if={isMockMode}>
          <RewriteProgressDisplay
            isProgressActive={isMockProgressActive}
            overallStatus={mockOverallStatus}
            ruleProgressList={mockRuleProgressList}
          />
          <RewrittenSqlCollapseStyleWrapper
            defaultActiveKey={[
              CollapseItemKeyEnum.overall_rewritten_suggestion
            ]}
            items={collapseItems}
          />
        </EmptyBox>
      </section>
    </BasicDrawer>
  );
};
export default SqlRewrittenDrawerEE;
