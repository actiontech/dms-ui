import { BasicButton, BasicDrawer, EmptyBox } from '@actiontech/shared';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { CollapseProps, Modal } from 'antd';
import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import BusinessRewrittenSuggestion from './components/BusinessRewrittenSuggestion';
import CustomLoadingIndicator from './components/CustomLoadingIndicator';
import DependDatabaseStructure from './components/DependDatabaseStructure';
import OverallRewrittenSuggestion from './components/OverallRewrittenSuggestion';
import RewrittenSuggestionDetails from './components/RewrittenSuggestionDetails';
import RewriteProgressDisplay from './components/RewriteProgressDisplay';
import {
  useAsyncRewriteProgress,
  IRewriteTaskResult
} from './components/RewriteProgressDisplay/hooks';
import { SqlRewrittenDrawerWithBaseProps } from './index.type';
import {
  ModuleHeaderTitleStyleWrapper,
  RewrittenSqlCollapseStyleWrapper
} from './style';
import { AsyncRewriteTaskStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

enum CollapseItemKeyEnum {
  rewritten_sql_details,
  business_rewritten_suggestions,
  overall_rewritten_suggestion,
  depend_database_structure_optimization
}

const SqlRewrittenDrawerEE: React.FC<SqlRewrittenDrawerWithBaseProps> = ({
  open,
  taskID,
  originSqlInfo,
  ...props
}) => {
  const { t } = useTranslation();
  const [rewriteResult, setRewriteResult] = useState<IRewriteTaskResult>();
  const [modal, modalContextHolder] = Modal.useModal();

  // 添加延迟完成状态管理
  const [isDelayingComplete, setIsDelayingComplete] = useState(false);
  const delayCompleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const originSqlNumber = originSqlInfo?.number ?? 0;
  const originalSql = originSqlInfo?.sql ?? '';

  // 使用异步重写进度 hook
  const {
    isRewriting,
    showProgress,
    overallStatus,
    ruleProgressList,
    enableStructureOptimize,
    startRewrite,
    toggleStructureOptimize,
    reset,
    hasSqlBeenRewritten,
    errorMessage,
    updateEnableStructureOptimize
  } = useAsyncRewriteProgress({
    onSuccess: (result) => {
      // 当重写完成获得结果时，先不立即设置结果
      // 等待进度条展示完成效果后再设置
      if (!isDelayingComplete) {
        setIsDelayingComplete(true);
        // 保存结果，等待延迟完成后使用
        delayCompleteTimerRef.current = setTimeout(() => {
          setRewriteResult(result);
          setIsDelayingComplete(false);
        }, 1500); // 延迟1.5秒
      }
    },
    onError: () => {
      // 清理延迟定时器
      if (delayCompleteTimerRef.current) {
        clearTimeout(delayCompleteTimerRef.current);
        delayCompleteTimerRef.current = null;
      }
      setIsDelayingComplete(false);
      setRewriteResult(undefined);
    }
  });

  // 处理启用结构优化
  const toggleEnableStructureOptimizeAction = useCallback(() => {
    toggleStructureOptimize(taskID, originSqlNumber);
  }, [toggleStructureOptimize, taskID, originSqlNumber]);

  // 更新重写结果按钮处理
  const handleUpdateRewriteResult = useCallback(() => {
    updateEnableStructureOptimize(false);
    startRewrite(taskID, originSqlNumber, false);
  }, [startRewrite, taskID, originSqlNumber, updateEnableStructureOptimize]);

  // 重试重写处理
  const handleRetryRewrite = useCallback(() => {
    startRewrite(taskID, originSqlNumber, enableStructureOptimize);
  }, [startRewrite, taskID, originSqlNumber, enableStructureOptimize]);

  // 检查是否有重写任务正在进行
  const isRewriteTaskRunning = useMemo(() => {
    return isRewriting || showProgress || isDelayingComplete;
  }, [isRewriting, showProgress, isDelayingComplete]);

  // 处理抽屉关闭确认
  const handleDrawerClose = useCallback(() => {
    if (isRewriteTaskRunning) {
      modal.confirm({
        title: t('sqlRewrite.closeDrawerConfirm'),
        onOk: () => {
          props.onClose?.();
          reset();
        }
      });
    } else {
      props.onClose?.();
      reset();
    }
  }, [isRewriteTaskRunning, t, props, reset, modal]);

  // 页面离开确认
  usePrompt(t('sqlRewrite.leavePageConfirm'), isRewriteTaskRunning);

  // 处理进度完成的回调
  const handleProgressComplete = useCallback(() => {
    // 这个回调由RewriteProgressDisplay在完成动画后调用
    // 此时才真正隐藏进度条并显示结果
  }, []);

  const collapseItems = useMemo<CollapseProps['items']>(() => {
    // 如果没有重写结果，返回空数组
    if (!rewriteResult?.suggestions) {
      return [];
    }

    const statementTypeSuggestion: IRewriteSuggestion[] = [];
    const structureTypeSuggestion: IRewriteSuggestion[] = [];
    const otherTypeSuggestion: IRewriteSuggestion[] = [];

    rewriteResult.suggestions.forEach((item) => {
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
            businessNonEquivalentDesc={rewriteResult.businessNonEquivalentDesc}
            rewrittenSql={rewriteResult.rewrittenSql}
            suggestions={rewriteResult.suggestions}
            optimizedCount={optimizedSuggestions.length}
            remainingCount={remainingSuggestions.length}
            businessCount={businessSuggestions.length}
            businessDesc={rewriteResult.businessDesc ?? ''}
            sqlLogicDesc={rewriteResult.logicDesc ?? ''}
            rewrittenSqlLogicDesc={rewriteResult.rewrittenSqlLogicDesc ?? ''}
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

            <BasicButton onClick={toggleEnableStructureOptimizeAction}>
              {t('sqlRewrite.enableDatabaseStructureOptimization')}
            </BasicButton>
          </div>
        ),
        children: (
          <DependDatabaseStructure
            dataSource={remainingSuggestions}
            toggleEnableStructureOptimizeAction={
              toggleEnableStructureOptimizeAction
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
    rewriteResult,
    enableStructureOptimize,
    t,
    originalSql,
    taskID,
    originSqlNumber,
    toggleEnableStructureOptimizeAction
  ]);

  useEffect(() => {
    if (open && !hasSqlBeenRewritten(originSqlNumber)) {
      // 初次加载时启动异步重写
      startRewrite(taskID, originSqlNumber, false);
    }
  }, [open, originSqlNumber, hasSqlBeenRewritten, startRewrite, taskID]);

  // 组件卸载时清理延迟定时器
  useEffect(() => {
    return () => {
      if (delayCompleteTimerRef.current) {
        clearTimeout(delayCompleteTimerRef.current);
        delayCompleteTimerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {modalContextHolder}
      <BasicDrawer
        {...props}
        onClose={handleDrawerClose}
        open={open}
        extra={
          <EmptyBox if={hasSqlBeenRewritten(originSqlNumber)}>
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
        <RewriteProgressDisplay
          visible={showProgress || isDelayingComplete}
          overallStatus={overallStatus}
          ruleProgressList={ruleProgressList}
          errorMessage={errorMessage}
          onComplete={handleProgressComplete}
          onRetry={handleRetryRewrite}
          isRetryLoading={isRewriting}
        />

        <EmptyBox
          if={
            !showProgress &&
            !isDelayingComplete &&
            overallStatus !== AsyncRewriteTaskStatusEnum.failed
          }
        >
          <EmptyBox if={!isRewriting} defaultNode={<CustomLoadingIndicator />}>
            <RewrittenSqlCollapseStyleWrapper
              defaultActiveKey={[
                CollapseItemKeyEnum.overall_rewritten_suggestion
              ]}
              items={collapseItems}
            />
          </EmptyBox>
        </EmptyBox>
      </BasicDrawer>
    </>
  );
};

export default SqlRewrittenDrawerEE;
