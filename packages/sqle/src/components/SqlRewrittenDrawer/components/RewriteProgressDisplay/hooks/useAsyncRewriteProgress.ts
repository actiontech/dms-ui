import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { AsyncRewriteTaskStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import TaskService from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  IAsyncRewriteTaskParams,
  IRewriteTaskResult,
  IUseAsyncRewriteProgressOptions
} from './useAsyncRewriteProgress.type';
import {
  mapSuggestionsToRuleProgress,
  calculateOverallProgress,
  calculateCompletedRulesCount,
  shouldStopPolling,
  buildRewriteTaskResult,
  shouldUpdateRewriteResult
} from './useAsyncRewriteProgress.utils';
import { useTranslation } from 'react-i18next';
import {
  saveSqlRewriteCache,
  getSqlRewriteCache
} from '../../../utils/sqlRewriteCache';

/**
 * 异步重写进度轮询 Hook
 *
 * 基于 useRequest 的轮询功能，用于获取异步重写任务状态和进度
 * 现在也包含了重写启动逻辑和状态管理
 */
export const useAsyncRewriteProgress = (
  options: IUseAsyncRewriteProgressOptions = {}
) => {
  const { t } = useTranslation();
  const { pollingInterval = 2000 } = options;

  const rewriteSqlNumber = useRef<number>();
  const currentTaskId = useRef<string>();
  const [rewriteResult, setRewriteResult] = useState<IRewriteTaskResult>();

  // 添加延迟完成状态管理
  const [isDelayingComplete, setIsDelayingComplete] = useState(false);
  const delayCompleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [overallStatus, setOverallStatus] =
    useState<AsyncRewriteTaskStatusEnum>(AsyncRewriteTaskStatusEnum.pending);

  // 重写相关状态
  const [showProgress, setShowProgress] = useState(false);
  const [enableStructureOptimize, setEnableStructureOptimize] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  // 启动异步重写的请求
  const { loading: asyncStartLoading, run: startAsyncRewrite } = useRequest(
    (taskId: string, number: number, enable: boolean) =>
      TaskService.RewriteSQL({
        task_id: taskId,
        number: number,
        enable_structure_type: enable
      }),
    {
      manual: true,
      onSuccess: (response, [taskId, number]) => {
        // 启动异步重写后，开始显示进度
        if (response.data.code === ResponseCode.SUCCESS) {
          setShowProgress(true);
          setErrorMessage(undefined); // 清除之前的错误信息
          rewriteSqlNumber.current = number;
          currentTaskId.current = taskId;
          // 启动轮询
          run({ taskId, sqlNumber: number });
          setRewriteResult(response.data.data?.result);
          setOverallStatus(AsyncRewriteTaskStatusEnum.pending);
        }
      },
      onError: () => {
        setShowProgress(false);
        setErrorMessage(t('sqlRewrite.rewriteFailed'));
      }
    }
  );

  // 使用 useRequest 进行轮询
  const {
    data: pollingData,
    loading: pollingLoading,
    run,
    cancel,
    mutate
  } = useRequest(
    async (params: IAsyncRewriteTaskParams) => {
      return TaskService.GetAsyncRewriteTaskStatus({
        task_id: params.taskId,
        number: params.sqlNumber
      }).then((res) => res.data.data);
    },
    {
      manual: true,
      pollingInterval,
      pollingErrorRetryCount: 3,
      onSuccess: (response) => {
        if (!response) return;

        const currentRewriteResult = buildRewriteTaskResult(response.result);

        // 检查是否需要停止轮询
        const currentStatus =
          response.status || AsyncRewriteTaskStatusEnum.pending;
        const currentRules = currentRewriteResult?.suggestions
          ? mapSuggestionsToRuleProgress(currentRewriteResult.suggestions)
          : [];
        if (shouldUpdateRewriteResult(rewriteResult, currentRewriteResult)) {
          setRewriteResult(currentRewriteResult);
          setOverallStatus(currentStatus);
        }

        if (shouldStopPolling(currentStatus, currentRules)) {
          cancel();
          setShowProgress(false);

          // 如果任务完成，触发成功回调
          if (
            currentStatus === AsyncRewriteTaskStatusEnum.completed &&
            response.result &&
            rewriteSqlNumber.current !== undefined &&
            currentTaskId.current !== undefined &&
            currentRewriteResult
          ) {
            // 保存到localStorage缓存
            saveSqlRewriteCache(
              currentTaskId.current,
              rewriteSqlNumber.current,
              currentRewriteResult,
              enableStructureOptimize
            );

            // 当重写完成获得结果时，先不立即设置结果
            // 等待进度条展示完成效果后再设置
            if (!isDelayingComplete) {
              setIsDelayingComplete(true);
              // 保存结果，等待延迟完成后使用
              delayCompleteTimerRef.current = setTimeout(() => {
                setRewriteResult(currentRewriteResult);
                setIsDelayingComplete(false);
              }, 1500); // 延迟1.5秒
            }
          }

          // 如果任务失败，触发错误回调
          if (currentStatus === AsyncRewriteTaskStatusEnum.failed) {
            const errorText =
              response.error_message || t('common.unknownError');
            setErrorMessage(errorText);
            // 清理延迟定时器
            if (delayCompleteTimerRef.current) {
              clearTimeout(delayCompleteTimerRef.current);
              delayCompleteTimerRef.current = null;
            }
            setIsDelayingComplete(false);
            setRewriteResult(undefined);
          }
        }
      },
      onError: (err) => {
        setShowProgress(false);
        setErrorMessage(err.message || t('common.unknownError'));
        // 清理延迟定时器
        if (delayCompleteTimerRef.current) {
          clearTimeout(delayCompleteTimerRef.current);
          delayCompleteTimerRef.current = null;
        }
        setIsDelayingComplete(false);
        setRewriteResult(undefined);
      }
    }
  );

  const ruleProgressList = useMemo(() => {
    if (pollingData?.result?.suggestions) {
      return mapSuggestionsToRuleProgress(pollingData.result.suggestions);
    }

    if (rewriteResult?.suggestions) {
      return mapSuggestionsToRuleProgress(rewriteResult.suggestions);
    }

    return [];
  }, [pollingData?.result?.suggestions, rewriteResult?.suggestions]);

  const completedRulesCount = useMemo(
    () => calculateCompletedRulesCount(ruleProgressList),
    [ruleProgressList]
  );

  const totalRulesCount = ruleProgressList.length;

  const progressPercentage = useMemo(
    () => calculateOverallProgress(ruleProgressList),
    [ruleProgressList]
  );

  // 是否正在重写（包括启动和轮询过程）
  const isRewriting = asyncStartLoading || pollingLoading || showProgress;

  // 启动重写
  const startRewrite = useCallback(
    (taskId: string, sqlNumber: number, enableStructure: boolean = false) => {
      setEnableStructureOptimize(enableStructure);
      startAsyncRewrite(taskId, sqlNumber, enableStructure);
    },
    [startAsyncRewrite]
  );

  // 切换结构优化
  const toggleStructureOptimize = useCallback(
    (taskId: string, sqlNumber: number) => {
      const newEnableStructureOptimize = !enableStructureOptimize;
      setEnableStructureOptimize(newEnableStructureOptimize);
      startAsyncRewrite(taskId, sqlNumber, newEnableStructureOptimize);
    },
    [enableStructureOptimize, startAsyncRewrite]
  );

  const loadCachedRewriteResult = useCallback(
    (taskId: string, sqlNumber: number) => {
      const cachedData = getSqlRewriteCache(taskId, sqlNumber);
      if (cachedData) {
        setRewriteResult(cachedData.rewriteResult);
        setEnableStructureOptimize(cachedData.enableStructureOptimize);
        setOverallStatus(AsyncRewriteTaskStatusEnum.completed);
        setShowProgress(false);
        setErrorMessage(undefined);
        currentTaskId.current = taskId;
        rewriteSqlNumber.current = sqlNumber;
      }
    },
    []
  );

  const resetAllState = useCallback(() => {
    cancel();
    mutate(undefined);
    rewriteSqlNumber.current = undefined;
    currentTaskId.current = undefined;
    setRewriteResult(undefined);
    setOverallStatus(AsyncRewriteTaskStatusEnum.pending);
    setShowProgress(false);
    setEnableStructureOptimize(false);
    setErrorMessage(undefined);
    setIsDelayingComplete(false);

    if (delayCompleteTimerRef.current) {
      clearTimeout(delayCompleteTimerRef.current);
      delayCompleteTimerRef.current = null;
    }
  }, [cancel, mutate]);

  // 组件卸载时清理延迟定时器
  useEffect(() => {
    return () => {
      if (delayCompleteTimerRef.current) {
        clearTimeout(delayCompleteTimerRef.current);
        delayCompleteTimerRef.current = null;
      }
    };
  }, []);

  return {
    isRewriting,
    asyncStartLoading,
    overallStatus,
    ruleProgressList,
    completedRulesCount,
    totalRulesCount,
    progressPercentage,
    showProgress,
    enableStructureOptimize,
    errorMessage,
    rewriteResult,
    isDelayingComplete,

    // 操作方法
    startRewrite,
    toggleStructureOptimize,
    resetAllState,
    loadCachedRewriteResult,
    updateEnableStructureOptimize: setEnableStructureOptimize
  };
};
