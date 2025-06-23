import { useCallback, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { AsyncRewriteTaskStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import TaskService from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  IAsyncRewriteTaskParams,
  IUseAsyncRewriteProgressOptions,
  IUseAsyncRewriteProgressReturn
} from './useAsyncRewriteProgress.type';
import {
  mapSuggestionsToRuleProgress,
  calculateOverallProgress,
  calculateCompletedRulesCount,
  calculateDuration,
  shouldStopPolling,
  createDefaultRuleProgress,
  buildRewriteTaskResult
} from './useAsyncRewriteProgress.utils';
import { useTranslation } from 'react-i18next';

/**
 * 异步重写进度轮询 Hook
 *
 * 基于 useRequest 的轮询功能，用于获取异步重写任务状态和进度
 * 现在也包含了重写启动逻辑和状态管理
 */
export const useAsyncRewriteProgress = (
  options: IUseAsyncRewriteProgressOptions = {}
): IUseAsyncRewriteProgressReturn => {
  const { t } = useTranslation();
  const {
    onSuccess,
    onError,
    pollingInterval = 2000,
    pollingWhenHidden = false
  } = options;

  const rewriteSqlNumber = useRef<number>();

  // 任务时间信息
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  // 重写相关状态
  const [showProgress, setShowProgress] = useState(false);
  const [enableStructureOptimize, setEnableStructureOptimize] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const sqlNumberToRewriteStatusMap = useRef<Map<number, boolean>>(new Map());

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
          // 启动轮询
          run({ taskId, sqlNumber: number });
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
    data: taskData,
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
      pollingWhenHidden,
      pollingErrorRetryCount: 3,
      onSuccess: (response) => {
        if (!response) return;

        // 更新时间信息
        if (response.start_time && !startTime) {
          setStartTime(response.start_time);
        }

        if (response.end_time && !endTime) {
          setEndTime(response.end_time);
        }

        // 检查是否需要停止轮询
        const currentStatus =
          response.status || AsyncRewriteTaskStatusEnum.pending;
        const currentRules = response.result?.suggestions
          ? mapSuggestionsToRuleProgress(response.result.suggestions)
          : [];

        if (shouldStopPolling(currentStatus, currentRules)) {
          cancel();
          setShowProgress(false);

          // 如果任务完成，触发成功回调
          if (
            currentStatus === AsyncRewriteTaskStatusEnum.completed &&
            response.result &&
            rewriteSqlNumber.current !== undefined
          ) {
            sqlNumberToRewriteStatusMap.current.set(
              rewriteSqlNumber.current,
              true
            );
            const result = buildRewriteTaskResult(response.result);
            if (result) {
              onSuccess?.(result);
            }
          }

          // 如果任务失败，触发错误回调
          if (currentStatus === AsyncRewriteTaskStatusEnum.failed) {
            const errorText =
              response.error_message || t('common.unknownError');
            setErrorMessage(errorText);
            onError?.(new Error(errorText));
          }
        }
      },
      onError: (err) => {
        setShowProgress(false);
        setErrorMessage(err.message || t('common.unknownError'));
        onError?.(err);
      }
    }
  );

  // 计算派生状态
  const overallStatus = useMemo(
    () => taskData?.status || AsyncRewriteTaskStatusEnum.pending,
    [taskData?.status]
  );

  const ruleProgressList = useMemo(() => {
    if (taskData?.result?.suggestions) {
      return mapSuggestionsToRuleProgress(taskData.result.suggestions);
    }

    // 如果任务正在运行但还没有具体规则数据，创建默认规则
    if (overallStatus === AsyncRewriteTaskStatusEnum.running) {
      return createDefaultRuleProgress(1);
    }

    return [];
  }, [taskData?.result?.suggestions, overallStatus]);

  const completedRulesCount = useMemo(
    () => calculateCompletedRulesCount(ruleProgressList),
    [ruleProgressList]
  );

  const totalRulesCount = ruleProgressList.length;

  const progressPercentage = useMemo(
    () => calculateOverallProgress(ruleProgressList),
    [ruleProgressList]
  );

  const duration = useMemo(
    () => calculateDuration(startTime, endTime),
    [startTime, endTime]
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

  const reset = useCallback(() => {
    cancel();
    mutate(undefined);
    rewriteSqlNumber.current = undefined;
    setStartTime(undefined);
    setEndTime(undefined);
    setShowProgress(false);
    setEnableStructureOptimize(false);
    setErrorMessage(undefined);
  }, [cancel, mutate]);

  // 检查 SQL 是否已经重写过
  const hasSqlBeenRewritten = useCallback((sqlNumber: number) => {
    return sqlNumberToRewriteStatusMap.current.has(sqlNumber);
  }, []);

  return {
    isRewriting,
    overallStatus,
    ruleProgressList,
    completedRulesCount,
    totalRulesCount,
    progressPercentage,
    showProgress,
    enableStructureOptimize,
    errorMessage,

    // 时间信息
    startTime: taskData?.start_time || startTime,
    endTime: taskData?.end_time || endTime,
    duration,

    // 操作方法
    startRewrite,
    toggleStructureOptimize,
    reset,
    hasSqlBeenRewritten,
    updateEnableStructureOptimize: setEnableStructureOptimize
  };
};
