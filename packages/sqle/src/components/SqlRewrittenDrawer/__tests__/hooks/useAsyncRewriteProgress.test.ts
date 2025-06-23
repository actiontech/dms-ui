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
      expect(result.current.startTime).toBeUndefined();
      expect(result.current.endTime).toBeUndefined();
      expect(result.current.duration).toBeUndefined();

      // 验证方法函数存在
      expect(typeof result.current.startRewrite).toBe('function');
      expect(typeof result.current.toggleStructureOptimize).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.hasSqlBeenRewritten).toBe('function');
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
      expect(result.current.errorMessage).toBe('重写失败');
    });

    it('should set error message when rewrite start fails', async () => {
      const mockRewriteSQL = jest.spyOn(TaskService, 'RewriteSQL');
      mockRewriteSQL.mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useAsyncRewriteProgress());

      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.errorMessage).toBe('重写失败');
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

      expect(result.current.errorMessage).toBe('重写失败');

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

      // 推进足够的时间让重试发生
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(2000));

      // 验证重试了指定次数
      expect(mockGetAsyncStatus).toHaveBeenCalledTimes(5);
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

    it('should mark SQL as rewritten when task completes', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // 初始状态下SQL未被重写
      expect(result.current.hasSqlBeenRewritten(1)).toBe(false);

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      // 任务完成后，SQL应该被标记为已重写
      expect(result.current.hasSqlBeenRewritten(1)).toBe(true);
    });

    it('should set showProgress to false when task completes', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();
      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(true);

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.showProgress).toBe(false);

      // 验证即使继续推进时间，showProgress 也保持 false
      await act(async () => jest.advanceTimersByTime(3000));
      expect(result.current.showProgress).toBe(false);
    });

    it('should update end time when task completes', async () => {
      taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.endTime).toBeUndefined();

      // 推进轮询时间，获取到 completed 状态
      await act(async () => jest.advanceTimersByTime(3000));

      expect(result.current.endTime).toBe('2023-12-01T10:05:30.000Z');
      expect(result.current.duration).toBeGreaterThan(0);
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

      // 推进轮询时间，获取运行中状态（部分完成）
      await act(async () => jest.advanceTimersByTime(3000));

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

    it('should create default rule progress when task is running but no specific rules data', async () => {
      // 创建一个运行中但没有具体规则数据的 mock
      const mockGetAsyncStatus = jest.spyOn(
        TaskService,
        'GetAsyncRewriteTaskStatus'
      );
      mockGetAsyncStatus.mockImplementation(() =>
        Promise.resolve({
          data: {
            data: {
              task_id: 'test-task-id',
              status: AsyncRewriteTaskStatusEnum.running,
              result: undefined // 没有结果数据
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

      // 应该创建默认的规则进度
      expect(result.current.ruleProgressList).toHaveLength(1);
      expect(result.current.ruleProgressList[0]).toEqual(
        expect.objectContaining({
          ruleId: 'default_rule_0',
          ruleName: 'default_rule_1',
          status: RewriteSuggestionStatusEnum.initial,
          ruleDescription: 'loading...'
        })
      );
      expect(result.current.totalRulesCount).toBe(1);
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
  });

  describe('Reset Functionality', () => {
    it('should reset all states when reset is called', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();
      const mockGetAsyncStatus = taskMockApi.getAsyncRewriteTaskStatus();

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
        result.current.reset();
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
      expect(result.current.startTime).toBeUndefined();
      expect(result.current.endTime).toBeUndefined();
      expect(result.current.duration).toBeUndefined();
    });

    it('should cancel polling when reset is called', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();
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
        result.current.reset();
      });

      const callCountAfterReset = mockGetAsyncStatus.mock.calls.length;

      // 推进时间，验证轮询已停止
      await act(async () => jest.advanceTimersByTime(6000));

      // 轮询调用次数应该没有增加
      expect(mockGetAsyncStatus.mock.calls.length).toBe(callCountAfterReset);
    });

    it('should clear task data when reset is called', async () => {
      const mockGetAsyncStatusCompleted =
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
        result.current.reset();
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

    it('should reset time information when reset is called', async () => {
      const mockGetAsyncStatusCompleted =
        taskMockApi.getAsyncRewriteTaskStatusCompleted();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动并完成一个重写任务
      await act(async () => {
        result.current.startRewrite('test-task-id', 1, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      // 验证时间信息已设置
      expect(result.current.startTime).toBeDefined();
      expect(result.current.endTime).toBeDefined();
      expect(result.current.duration).toBeDefined();

      // 重置状态
      await act(async () => {
        result.current.reset();
      });

      // 验证时间信息已清除
      expect(result.current.startTime).toBeUndefined();
      expect(result.current.endTime).toBeUndefined();
      expect(result.current.duration).toBeUndefined();
    });

    it('should reset progress states when reset is called', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();

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
        result.current.reset();
      });

      // 验证进度状态已重置
      expect(result.current.isRewriting).toBe(false);
      expect(result.current.showProgress).toBe(false);
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.completedRulesCount).toBe(0);
      expect(result.current.totalRulesCount).toBe(0);
      expect(result.current.ruleProgressList).toEqual([]);
    });

    it('should reset error states when reset is called', async () => {
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
        result.current.reset();
      });

      // 验证错误状态已清除
      expect(result.current.errorMessage).toBeUndefined();

      mockRewriteSQL.mockRestore();
    });

    it('should reset SQL number reference when reset is called', async () => {
      const mockRewriteSQL = taskMockApi.getTaskSQLRewritten();

      const { result } = renderHook(() => useAsyncRewriteProgress());

      // 启动重写任务
      await act(async () => {
        result.current.startRewrite('test-task-id', 5, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证SQL已被标记为重写过（通过检查内部是否记录了SQL编号）
      expect(result.current.hasSqlBeenRewritten(5)).toBe(false); // 还在进行中，未完成

      // 重置状态
      await act(async () => {
        result.current.reset();
      });

      // 重置后，再次启动相同SQL编号的重写应该能正常进行
      await act(async () => {
        result.current.startRewrite('test-task-id', 5, false);
      });

      await act(async () => jest.advanceTimersByTime(3000));

      // 验证能够正常启动新的重写
      expect(result.current.isRewriting).toBe(true);
      expect(result.current.showProgress).toBe(true);
    });
  });
});
