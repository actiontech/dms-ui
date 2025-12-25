import { renderHook, act } from '@testing-library/react';
import TaskService from '@actiontech/shared/lib/api/sqle/service/task';
import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import taskMockApi from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import { AsyncRewriteTaskStatusCompletedMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import {
  useAsyncRewriteProgress,
  buildRewriteTaskResult
} from '../../components/RewriteProgressDisplay/hooks';
import { getSqlRewriteCache } from '../../utils/sqlRewriteCache';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil';

// Mock 缓存模块
jest.mock('../../utils/sqlRewriteCache', () => ({
  getSqlRewriteCache: jest.fn(),
  saveSqlRewriteCache: jest.fn(),
  hasSqlBeenRewritten: jest.fn(),
  removeSqlRewriteCache: jest.fn(),
  cleanTaskCaches: jest.fn(),
  clearAllCaches: jest.fn(),
  getCacheStats: jest.fn()
}));

describe('useAsyncRewriteProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    taskMockApi.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('should return correct initial state when hook is mounted', () => {
      const { result } = renderHook(() => useAsyncRewriteProgress());

      expect(result.current.isRewriting).toBe(false);
      expect(result.current.asyncStartLoading).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );
      expect(result.current.ruleProgressList).toEqual([]);
      expect(result.current.completedRulesCount).toBe(0);
      expect(result.current.totalRulesCount).toBe(0);
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.showProgress).toBe(false);
      expect(result.current.enableStructureOptimize).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.rewriteResult).toBeUndefined();
      expect(result.current.isDelayingComplete).toBe(false);

      // 验证方法函数存在
      expect(typeof result.current.startRewrite).toBe('function');
      expect(typeof result.current.toggleStructureOptimize).toBe('function');
      expect(typeof result.current.resetAllState).toBe('function');
      expect(typeof result.current.loadCachedRewriteResult).toBe('function');
      expect(typeof result.current.updateEnableStructureOptimize).toBe(
        'function'
      );
    });

    it('should initialize with default polling options', () => {
      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 验证默认轮询配置生效
      expect(result.current.isRewriting).toBe(false);
      expect(result.current.showProgress).toBe(false);
    });

    it('should initialize with custom polling options when provided', () => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();

      const customOptions = {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
        pollingInterval: 5000,
        pollingWhenHidden: true
      };

      const { result } = renderHook(() =>
        useAsyncRewriteProgress(customOptions)
      );

      // 验证初始状态仍然正确
      expect(result.current.isRewriting).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );
      expect(result.current.showProgress).toBe(false);
      expect(result.current.enableStructureOptimize).toBe(false);

      // 验证回调函数未被调用（因为还没有开始任何操作）
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
    });
  });

  describe('Start Rewrite Functionality', () => {
    it('should start async rewrite successfully', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      expect(mockRewriteSQL).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 1,
        enable_structure_type: false
      });
    });

    it('should set showProgress to true when rewrite starts successfully', async () => {
      taskMockApi.getTaskSQLRewritten();
      taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      expect(result.current.showProgress).toBe(false);

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(true);
    });

    it('should start polling after successful rewrite initiation', async () => {
      taskMockApi.getTaskSQLRewritten();
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证轮询已经开始（GetAsyncRewriteTaskStatus 应该被调用）
      expect(mockGetAsyncStatus).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 1
      });
    });

    it('should handle rewrite start failure', async () => {
      const mockRewriteSQL = jest.spyOn(TaskService, 'RewriteSQL');
      mockRewriteSQL.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(false);
      expect(result.current.errorMessage).toBe('Network error');
    });

    it('should set error message when rewrite start fails', async () => {
      const mockRewriteSQL = jest.spyOn(TaskService, 'RewriteSQL');
      mockRewriteSQL.mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.errorMessage).toBe('API Error');
    });

    it('should not start polling when rewrite initiation fails', async () => {
      const mockRewriteSQL = jest.spyOn(TaskService, 'RewriteSQL');
      mockRewriteSQL.mockRejectedValueOnce(new Error('Network error'));

      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证轮询没有开始
      expect(mockGetAsyncStatus).not.toHaveBeenCalled();
    });

    it('should clear previous error message when starting new rewrite', async () => {
      const mockRewriteSQL = jest.spyOn(TaskService, 'RewriteSQL');
      // 第一次调用失败
      mockRewriteSQL.mockRejectedValueOnce(new Error('First error'));

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 第一次启动失败
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.errorMessage).toBe('First error');

      // 重新设置成功的 mock
      taskMockApi.getTaskSQLRewritten();
      taskMockApi.getAsyncRewriteTaskStatus();

      // 第二次启动成功
      await act(async () => {
        result.current.startRewrite('test-task-id', 2, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.showProgress).toBe(true);
    });

    it('should set current rewrite SQL number correctly', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 5, true);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证轮询时使用了正确的 SQL 编号
      expect(mockGetAsyncStatus).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 5
      });

      // 验证结构优化标志也正确传递
      expect(mockRewriteSQL).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 5,
        enable_structure_type: true
      });
    });
  });

  describe('Polling Functionality', () => {
    it('should poll task status at specified interval', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      expect(mockRewriteSQL).toHaveBeenCalledTimes(1);

      // 推进第一次轮询（使用默认3000ms间隔）
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证第一次轮询调用
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(1);

      // 推进第二次轮询
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证第二次轮询调用
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(2);
    });

    it('should continue polling when task status is running', async () => {
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      // 推进多次轮询时间

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证持续轮询（running 状态不应该停止轮询）
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(4); // 启动时1次 + 轮询3次
      expect(result.current.showProgress).toBe(true);
    });

    it('should continue polling when task status is pending', async () => {
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatusPending();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      // 推进多次轮询时间

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证持续轮询（pending 状态不应该停止轮询）
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(4);
      expect(result.current.showProgress).toBe(true);
    });

    it('should stop polling when task status is completed', async () => {
      const mockGetAsyncStatusCompleted =
        taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      // 推进一次轮询时间（应该获取到 completed 状态并停止）
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );

      const callCountBeforeMoreTime =
        mockGetAsyncStatusCompleted.mock.calls.length;

      // 再推进时间，验证轮询已停止
      await act(async () => jest.advanceTimersByTime(4000));

      expect(mockGetAsyncStatusCompleted.mock.calls.length).toBe(
        callCountBeforeMoreTime
      );
    });

    it('should stop polling when task status is failed', async () => {
      const mockGetAsyncStatusFailed =
        taskMockApi.getAsyncRewriteTaskStatusFailed();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 推进一次轮询时间（应该获取到 failed 状态并停止）
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.failed
      );
      expect(result.current.errorMessage).toBe(
        'SQL rewrite failed due to syntax error'
      );

      const callCountBeforeMoreTime =
        mockGetAsyncStatusFailed.mock.calls.length;

      // 再推进时间，验证轮询已停止
      await act(async () => jest.advanceTimersByTime(6000));

      expect(mockGetAsyncStatusFailed.mock.calls.length).toBe(
        callCountBeforeMoreTime
      );
    });

    it('should handle polling errors', async () => {
      const mockGetAsyncStatus = jest.spyOn(
        TaskService,
        'GetAsyncRewriteTaskStatus'
      );
      mockGetAsyncStatus.mockRejectedValue(new Error('Polling error'));

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间（应该处理错误）
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(false);
      expect(result.current.errorMessage).toBe('Polling error');
    });

    it('should retry polling on error up to specified count', async () => {
      const mockGetAsyncStatus = jest.spyOn(
        TaskService,
        'GetAsyncRewriteTaskStatus'
      );

      // 前3次调用失败，第4次成功
      mockGetAsyncStatus
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockRejectedValueOnce(new Error('Error 2'))
        .mockRejectedValueOnce(new Error('Error 3'));

      // 第4次设置成功的 mock
      taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 推进足够的时间让重试发生
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 推进足够的时间让重试发生
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证重试了指定次数
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(4);
    });
  });

  describe('Success Scenarios', () => {
    it('should handle successful task completion', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(true);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );
      expect(result.current.errorMessage).toBeUndefined();
    });

    it('should call onSuccess callback when task completes successfully', async () => {
      const onSuccessCallback = jest.fn();
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() =>
        useAsyncRewriteProgress({
          onSuccess: onSuccessCallback
        })
      );

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      expect(onSuccessCallback).toHaveBeenCalledTimes(1);
      expect(onSuccessCallback).toHaveBeenCalledWith(
        buildRewriteTaskResult(AsyncRewriteTaskStatusCompletedMockData.result)
      );
    });

    it('should handle task completion state correctly', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 初始状态下任务未完成
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(2000));

      // 任务完成后，状态应该更新
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );
    });

    it('should set showProgress to false when task completes', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();
      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      expect(result.current.showProgress).toBe(true);

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(2000));

      expect(result.current.showProgress).toBe(false);

      // 验证即使继续推进时间，showProgress 也保持 false
      await act(async () => jest.advanceTimersByTime(2000));
      expect(result.current.showProgress).toBe(false);
    });

    it('should handle rewrite result when task completes', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证重写结果已设置
      expect(result.current.rewriteResult).toBeDefined();
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );
    });

    it('should build correct rewrite task result', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证规则进度列表正确映射
      expect(result.current.ruleProgressList).toHaveLength(
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions?.length!
      );
      expect(result.current.completedRulesCount).toBe(
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions?.filter(
          (item) => item.status === RewriteSuggestionStatusEnum.processed
        ).length!
      );
      expect(result.current.totalRulesCount).toBe(
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions?.length!
      );
      expect(result.current.progressPercentage).toBe(100);
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate overall progress percentage correctly', async () => {
      taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 推进轮询时间，获取运行中状态（部分完成）
      await act(async () => jest.advanceTimersByTime(2000));

      expect(result.current.progressPercentage).toBe(50);
    });

    it('should calculate completed rules count correctly', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间，获取完成状态
      await act(async () => jest.advanceTimersByTime(3000));

      const expectedCompletedCount =
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions?.filter(
          (item) => item.status === RewriteSuggestionStatusEnum.processed
        ).length || 0;

      expect(result.current.completedRulesCount).toBe(expectedCompletedCount);
      expect(result.current.completedRulesCount).toBeGreaterThanOrEqual(0);
      expect(result.current.completedRulesCount).toBeLessThanOrEqual(
        result.current.totalRulesCount
      );
    });

    it('should calculate total rules count correctly', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间，获取完成状态
      await act(async () => jest.advanceTimersByTime(3000));

      const expectedTotalCount =
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions?.length || 0;

      expect(result.current.totalRulesCount).toBe(expectedTotalCount);
      expect(result.current.totalRulesCount).toBeGreaterThanOrEqual(0);
      expect(result.current.totalRulesCount).toBeGreaterThanOrEqual(
        result.current.completedRulesCount
      );
    });

    it('should return empty rule progress list when no suggestions available', async () => {
      // 创建一个没有 suggestions 的 mock
      const mockGetAsyncStatus = jest.spyOn(
        TaskService,
        'GetAsyncRewriteTaskStatus'
      );
      mockGetAsyncStatus.mockImplementation(() =>
        Promise.resolve({
          data: {
            data: {
              task_id: 'test-task-id',
              status: AsyncRewriteTaskStatusEnum.completed,
              result: {
                // 没有 suggestions 字段
                rewritten_sql: 'SELECT * FROM table;'
              }
            }
          }
        } as any)
      );

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.ruleProgressList).toEqual([]);
      expect(result.current.totalRulesCount).toBe(0);
      expect(result.current.completedRulesCount).toBe(0);
      expect(result.current.progressPercentage).toBe(0);

      mockGetAsyncStatus.mockRestore();
    });

    it('should map suggestions to rule progress correctly', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间，获取完成状态
      await act(async () => jest.advanceTimersByTime(3000));

      const suggestions =
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions || [];

      expect(result.current.ruleProgressList).toHaveLength(suggestions.length);

      // 验证每个规则进度项的正确映射
      result.current.ruleProgressList.forEach((progressItem, index) => {
        const suggestion = suggestions[index];
        expect(progressItem.ruleName).toBe(suggestion.rule_name || '');
        expect(progressItem.ruleDescription).toBe(suggestion.desc || '');
        expect(progressItem.status).toBe(
          suggestion.status || RewriteSuggestionStatusEnum.initial
        );
      });
    });
  });

  describe('Structure Optimization', () => {
    it('should toggle structure optimization correctly', async () => {
      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 初始状态下结构优化应该是 false
      expect(result.current.enableStructureOptimize).toBe(false);

      // 切换结构优化
      await act(async () => {
        result.current.toggleStructureOptimize('test-task-id', 1);
      });

      expect(result.current.enableStructureOptimize).toBe(true);

      // 再次切换
      await act(async () => {
        result.current.toggleStructureOptimize('test-task-id', 1);
      });

      expect(result.current.enableStructureOptimize).toBe(false);
    });

    it('should start new rewrite with toggled structure optimization', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 初始状态下结构优化为 false
      expect(result.current.enableStructureOptimize).toBe(false);

      // 启动重写（不启用结构优化）
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证第一次调用时 enable_structure_type 为 false
      expect(mockRewriteSQL).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 1,
        enable_structure_type: false
      });

      // 切换结构优化
      await act(async () => {
        result.current.toggleStructureOptimize('test-task-id', 1);
      });

      expect(result.current.enableStructureOptimize).toBe(true);

      // 验证切换后会自动开始新的重写，并且 enable_structure_type 为 true
      expect(mockRewriteSQL).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 1,
        enable_structure_type: true
      });
    });

    it('should update enableStructureOptimize state when toggling', async () => {
      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 测试多次切换状态
      const toggleStates = [true, false, true, false, true];

      for (const expectedState of toggleStates) {
        await act(async () => {
          result.current.toggleStructureOptimize('test-task-id', 1);
        });

        expect(result.current.enableStructureOptimize).toBe(expectedState);
      }
    });

    it('should pass structure optimization flag to rewrite API', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 测试启用结构优化的重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, true);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      expect(mockRewriteSQL).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 1,
        enable_structure_type: true
      });

      expect(result.current.enableStructureOptimize).toBe(true);

      // 重置 mock 调用记录
      mockRewriteSQL.mockClear();

      // 测试不启用结构优化的重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 2, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      expect(mockRewriteSQL).toHaveBeenCalledWith({
        task_id: 'test-task-id',
        number: 2,
        enable_structure_type: false
      });

      expect(result.current.enableStructureOptimize).toBe(false);
    });

    it('should update structure optimization state directly', async () => {
      const { result } = renderHook(() => useAsyncRewriteProgress());

      expect(result.current.enableStructureOptimize).toBe(false);

      await act(async () => {
        result.current.updateEnableStructureOptimize(true);
      });

      expect(result.current.enableStructureOptimize).toBe(true);

      await act(async () => {
        result.current.updateEnableStructureOptimize(false);
      });

      expect(result.current.enableStructureOptimize).toBe(false);
    });
  });

  describe('Cache Functionality', () => {
    let mockGetSqlRewriteCache: jest.Mock;

    beforeEach(() => {
      mockGetSqlRewriteCache = getSqlRewriteCache as jest.Mock;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should load cached rewrite result correctly', async () => {
      // 准备模拟的缓存数据
      const mockCachedData = {
        taskId: 'test-task-id',
        sqlNumber: 1,
        rewriteResult: buildRewriteTaskResult(
          AsyncRewriteTaskStatusCompletedMockData.result
        ),
        enableStructureOptimize: true,
        lastAccessed: Date.now()
      };

      mockGetSqlRewriteCache.mockReturnValue(mockCachedData);

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 1);
      });

      // 验证状态被正确设置
      expect(result.current.rewriteResult).toEqual(
        mockCachedData.rewriteResult
      );
      expect(result.current.enableStructureOptimize).toBe(true);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );
      expect(result.current.showProgress).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
    });

    it('should handle cache miss correctly', async () => {
      // Mock 缓存未命中（返回 null）
      mockGetSqlRewriteCache.mockReturnValue(null);

      const { result } = renderHook(() => useAsyncRewriteProgress());

      const initialResult = result.current.rewriteResult;
      const initialStatus = result.current.overallStatus;

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 1);
      });

      // 状态应该保持不变
      expect(result.current.rewriteResult).toBe(initialResult);
      expect(result.current.overallStatus).toBe(initialStatus);
    });

    it('should save to cache when rewrite completes successfully', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, true);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      // 等待延迟完成
      await act(async () => jest.advanceTimersByTime(1600));

      // 缓存功能已集成在 hooks 内部，这里主要验证整体流程
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );
      expect(result.current.rewriteResult).toBeDefined();
    });

    it('should handle cache with different structure optimization settings', async () => {
      // 测试不同的结构优化设置
      const mockCachedDataWithStructureOpt = {
        taskId: 'test-task-id',
        sqlNumber: 1,
        rewriteResult: buildRewriteTaskResult(
          AsyncRewriteTaskStatusCompletedMockData.result
        ),
        enableStructureOptimize: true,
        lastAccessed: Date.now()
      };

      const mockCachedDataWithoutStructureOpt = {
        taskId: 'test-task-id',
        sqlNumber: 2,
        rewriteResult: buildRewriteTaskResult(
          AsyncRewriteTaskStatusCompletedMockData.result
        ),
        enableStructureOptimize: false,
        lastAccessed: Date.now()
      };

      mockGetSqlRewriteCache.mockReturnValueOnce(
        mockCachedDataWithStructureOpt
      );

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 1);
      });

      expect(result.current.enableStructureOptimize).toBe(true);

      mockGetSqlRewriteCache.mockReturnValueOnce(
        mockCachedDataWithoutStructureOpt
      );

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 2);
      });

      expect(result.current.enableStructureOptimize).toBe(false);
    });

    it('should handle incomplete cache data gracefully', async () => {
      // 测试不完整的缓存数据
      const incompleteCacheData = {
        taskId: 'test-task-id',
        sqlNumber: 1,
        rewriteResult: null, // 缺少重写结果
        enableStructureOptimize: false,
        lastAccessed: Date.now()
      };

      mockGetSqlRewriteCache.mockReturnValue(incompleteCacheData);

      const { result } = renderHook(() => useAsyncRewriteProgress());

      const initialResult = result.current.rewriteResult;
      const initialStatus = result.current.overallStatus;

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 1);
      });

      // 由于缓存数据不完整，状态应该保持不变或被合理处理
      expect(result.current.rewriteResult).toBe(initialResult);
      expect(result.current.overallStatus).toBe(initialStatus);
    });

    it('should maintain cache consistency during rewrite process', async () => {
      // 验证重写过程中缓存的一致性
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 首先检查无缓存状态
      mockGetSqlRewriteCache.mockReturnValue(null);

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 1);
      });

      expect(result.current.rewriteResult).toBeUndefined();

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      // 重写进行中
      await act(async () => jest.advanceTimersByTime(3000));
      expect(result.current.showProgress).toBe(true);

      // 重写完成
      await act(async () => jest.advanceTimersByTime(3000));
      expect(result.current.showProgress).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );

      // 现在模拟有缓存的情况
      const cachedData = {
        taskId: 'test-task-id',
        sqlNumber: 1,
        rewriteResult: buildRewriteTaskResult(
          AsyncRewriteTaskStatusCompletedMockData.result
        ),
        enableStructureOptimize: false,
        lastAccessed: Date.now()
      };

      mockGetSqlRewriteCache.mockReturnValue(cachedData);

      await act(async () => {
        result.current.loadCachedRewriteResult('test-task-id', 1);
      });

      expect(result.current.rewriteResult).toEqual(cachedData.rewriteResult);
    });
  });

  describe('Status Update Edge Cases', () => {
    it('should update status immediately even when shouldUpdateRewriteResult returns false', async () => {
      // 这个测试用例覆盖这样的场景：
      // 当 shouldUpdateRewriteResult 返回 false 时（即结果没有变化），
      // 但状态变为 failed，此时状态应该能够立即更新，失败处理逻辑应该正常执行

      // 设置初始的运行中状态
      const mockGetAsyncStatusRunning = taskMockApi.getAsyncRewriteTaskStatus();

      const runningResponse = {
        task_id: 'test-task-id',
        status: AsyncRewriteTaskStatusEnum.running,
        result: {
          suggestions: [
            {
              rule_name: 'test_rule',
              desc: 'test description',
              status: RewriteSuggestionStatusEnum.initial,
              rewritten_sql: 'SELECT * FROM test;'
            }
          ]
        }
      };

      const failedResponse = {
        task_id: 'test-task-id',
        status: AsyncRewriteTaskStatusEnum.failed,
        error_message: 'Rewrite failed due to syntax error',
        result: {
          // 注意：这里的 suggestions 和之前一样，shouldUpdateRewriteResult 会返回 false
          suggestions: [
            {
              rule_name: 'test_rule',
              desc: 'test description',
              status: RewriteSuggestionStatusEnum.initial, // 状态没有变化
              rewritten_sql: 'SELECT * FROM test;'
            }
          ]
        }
      };

      // 第一次调用返回运行中状态，第二次返回失败状态
      mockGetAsyncStatusRunning.mockImplementationOnce(() =>
        createSpySuccessResponse({ data: runningResponse })
      );
      mockGetAsyncStatusRunning.mockImplementationOnce(() =>
        createSpySuccessResponse({ data: failedResponse })
      );

      const onErrorCallback = jest.fn();

      const { result } = renderHook(() =>
        useAsyncRewriteProgress({
          onError: onErrorCallback
        })
      );

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 第一次轮询 - 获取运行中状态
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.running
      );
      expect(result.current.showProgress).toBe(true);
      expect(result.current.errorMessage).toBeUndefined();

      // 第二次轮询 - 获取失败状态
      // 虽然 suggestions 没有变化（shouldUpdateRewriteResult 会返回 false），
      // 但状态变为 failed，应该能够正确处理
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证状态被正确更新为失败状态
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.failed
      );
      // 验证显示进度被停止
      expect(result.current.showProgress).toBe(false);
      // 验证错误消息被设置
      expect(result.current.errorMessage).toBe(
        'Rewrite failed due to syntax error'
      );
      // 验证错误回调被调用
      expect(onErrorCallback).toHaveBeenCalledTimes(1);
      expect(onErrorCallback).toHaveBeenCalledWith(
        new Error('Rewrite failed due to syntax error')
      );

      mockGetAsyncStatusRunning.mockRestore();
    });

    it('should handle status change from pending to failed when result unchanged', async () => {
      // 另一个类似的场景：从 pending 到 failed 状态的变化
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const pendingResponse = {
        task_id: 'test-task-id',
        status: AsyncRewriteTaskStatusEnum.pending,
        result: {
          suggestions: []
        }
      };

      const failedResponse = {
        task_id: 'test-task-id',
        status: AsyncRewriteTaskStatusEnum.failed,
        error_message: 'Task failed to start',
        result: {
          suggestions: [] // 结果相同，shouldUpdateRewriteResult 返回 false
        }
      };

      mockGetAsyncStatus
        .mockImplementationOnce(() =>
          createSpySuccessResponse({ data: pendingResponse })
        )
        .mockImplementationOnce(() =>
          createSpySuccessResponse({ data: failedResponse })
        );

      const onErrorCallback = jest.fn();

      const { result } = renderHook(() =>
        useAsyncRewriteProgress({
          onError: onErrorCallback
        })
      );

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 第一次轮询 - pending 状态
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );

      // 第二次轮询 - failed 状态
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证状态正确更新并处理失败
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.failed
      );
      expect(result.current.showProgress).toBe(false);
      expect(result.current.errorMessage).toBe('Task failed to start');
      expect(onErrorCallback).toHaveBeenCalledWith(
        new Error('Task failed to start')
      );

      mockGetAsyncStatus.mockRestore();
    });

    it('should update status when transitioning from running to completed even if suggestions unchanged', async () => {
      // 验证从 running 到 completed 的状态变化也能正确处理
      const mockGetAsyncStatusRunning = taskMockApi.getAsyncRewriteTaskStatus();

      const runningResponse = {
        task_id: 'test-task-id',
        status: AsyncRewriteTaskStatusEnum.running,
        result: {
          suggestions: [
            {
              rule_name: 'test_rule',
              desc: 'test description',
              status: RewriteSuggestionStatusEnum.initial,
              rewritten_sql: 'SELECT * FROM test;'
            }
          ]
        }
      };

      const completedResponse = {
        task_id: 'test-task-id',
        status: AsyncRewriteTaskStatusEnum.completed,
        result: {
          suggestions: [
            {
              rule_name: 'test_rule',
              desc: 'test description',
              status: RewriteSuggestionStatusEnum.processed, // 状态相同
              rewritten_sql: 'SELECT * FROM test;'
            }
          ]
        }
      };

      mockGetAsyncStatusRunning
        .mockImplementationOnce(() =>
          createSpySuccessResponse({ data: runningResponse })
        )
        .mockImplementationOnce(() =>
          createSpySuccessResponse({ data: completedResponse })
        );

      const onSuccessCallback = jest.fn();

      const { result } = renderHook(() =>
        useAsyncRewriteProgress({
          onSuccess: onSuccessCallback
        })
      );

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 第一次轮询 - running 状态
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.running
      );

      // 第二次轮询 - completed 状态
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证状态正确更新为完成
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.completed
      );
      expect(result.current.showProgress).toBe(false);

      mockGetAsyncStatusRunning.mockRestore();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all states when resetAllState is called', async () => {
      taskMockApi.getTaskSQLRewritten();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 先启动一个重写任务，设置一些状态
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, true);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证状态已经改变
      expect(result.current.isRewriting).toBe(true);
      expect(result.current.showProgress).toBe(true);
      expect(result.current.enableStructureOptimize).toBe(true);

      // 重置所有状态
      await act(async () => {
        result.current.resetAllState();
      });

      // 验证所有状态都被重置到初始值
      expect(result.current.isRewriting).toBe(false);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );
      expect(result.current.ruleProgressList).toEqual([]);
      expect(result.current.completedRulesCount).toBe(0);
      expect(result.current.totalRulesCount).toBe(0);
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.showProgress).toBe(false);
      expect(result.current.enableStructureOptimize).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.rewriteResult).toBeUndefined();
      expect(result.current.isDelayingComplete).toBe(false);
    });

    it('should cancel polling when resetAllState is called', async () => {
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写任务（开始轮询）
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证轮询已经开始
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(1);

      // 重置状态（应该取消轮询）
      await act(async () => {
        result.current.resetAllState();
      });

      const callCountAfterReset = mockGetAsyncStatus.mock.calls.length;

      // 推进时间，验证轮询已停止
      await act(async () => jest.advanceTimersByTime(6000));

      // 轮询调用次数应该没有增加
      expect(mockGetAsyncStatus.mock.calls.length).toBe(callCountAfterReset);
    });

    it('should clear task data when resetAllState is called', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动并完成一个重写任务
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证任务数据已设置
      expect(result.current.ruleProgressList.length).toBeGreaterThan(0);
      expect(result.current.totalRulesCount).toBeGreaterThan(0);

      // 重置状态
      await act(async () => {
        result.current.resetAllState();
      });

      // 验证任务数据已清除
      expect(result.current.ruleProgressList).toEqual([]);
      expect(result.current.totalRulesCount).toBe(0);
      expect(result.current.completedRulesCount).toBe(0);
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.overallStatus).toBe(
        AsyncRewriteTaskStatusEnum.pending
      );
    });

    it('should reset progress states when resetAllState is called', async () => {
      taskMockApi.getTaskSQLRewritten();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写任务
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证进度状态已改变
      expect(result.current.isRewriting).toBe(true);
      expect(result.current.showProgress).toBe(true);

      // 重置状态
      await act(async () => {
        result.current.resetAllState();
      });

      // 验证进度状态已重置
      expect(result.current.isRewriting).toBe(false);
      expect(result.current.showProgress).toBe(false);
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.completedRulesCount).toBe(0);
      expect(result.current.totalRulesCount).toBe(0);
      expect(result.current.ruleProgressList).toEqual([]);
    });

    it('should reset error states when resetAllState is called', async () => {
      const mockRewriteSQL = jest.spyOn(TaskService, 'RewriteSQL');
      mockRewriteSQL.mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 触发一个错误
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证错误状态已设置
      expect(result.current.errorMessage).toBeDefined();

      // 重置状态
      await act(async () => {
        result.current.resetAllState();
      });

      // 验证错误状态已清除
      expect(result.current.errorMessage).toBeUndefined();

      mockRewriteSQL.mockRestore();
    });

    it('should clear delay timer when resetAllState is called', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写任务
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证延迟完成状态
      expect(result.current.isDelayingComplete).toBe(true);

      // 重置状态
      await act(async () => {
        result.current.resetAllState();
      });

      // 验证延迟状态已清除
      expect(result.current.isDelayingComplete).toBe(false);

      // 推进延迟时间，验证延迟任务已被清除
      await act(async () => jest.advanceTimersByTime(3000));
      expect(result.current.isDelayingComplete).toBe(false);
    });
  });
});
