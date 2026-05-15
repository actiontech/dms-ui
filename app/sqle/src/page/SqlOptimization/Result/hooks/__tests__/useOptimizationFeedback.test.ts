import { act } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import { optimizedSQLFeedbacksMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi/common';
import useOptimizationFeedback from '../useOptimizationFeedback';
import {
  OptimizedSQLFeedbackReqVoteEnum,
  UpdateOptimizedSQLFeedbackReqVoteEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('useOptimizationFeedback', () => {
  let addFeedbackSpy: jest.SpyInstance;
  let deleteFeedbackSpy: jest.SpyInstance;
  let updateFeedbackSpy: jest.SpyInstance;

  const mockParams = {
    optimizationRecordId: 'record-001',
    initialFeedbacks: optimizedSQLFeedbacksMockData,
    onFeedbackChanged: jest.fn()
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    sqlOptimization.mockAllApi();
    addFeedbackSpy = sqlOptimization.addOptimizedSQLFeedback();
    deleteFeedbackSpy = sqlOptimization.deleteOptimizedSQLFeedback();
    updateFeedbackSpy = sqlOptimization.updateOptimizedSQLFeedback();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = superRenderHook(() =>
      useOptimizationFeedback(mockParams)
    );

    expect(result.current.feedbacks).toEqual(optimizedSQLFeedbacksMockData);
    expect(result.current.submitting).toBe(false);
    expect(result.current.deleteLoading).toBe(false);
    expect(typeof result.current.addFeedback).toBe('function');
    expect(typeof result.current.updateFeedback).toBe('function');
    expect(typeof result.current.deleteFeedback).toBe('function');
    expect(typeof result.current.updateLocalFeedbacks).toBe('function');
  });

  it('should initialize with empty feedbacks when initialFeedbacks is not provided', () => {
    const { result } = superRenderHook(() =>
      useOptimizationFeedback({ optimizationRecordId: 'record-001' })
    );

    expect(result.current.feedbacks).toEqual([]);
  });

  it('should call addFeedback API with correct params and trigger onFeedbackChanged on success', async () => {
    const onFeedbackChanged = jest.fn();
    const { result } = superRenderHook(() =>
      useOptimizationFeedback({
        ...mockParams,
        onFeedbackChanged
      })
    );

    await act(async () => {
      result.current.addFeedback({
        vote: OptimizedSQLFeedbackReqVoteEnum.agree,
        reason: '效果很好'
      });
      await jest.advanceTimersByTime(3000);
    });

    expect(addFeedbackSpy).toHaveBeenCalledWith({
      project_name: 'default',
      optimization_record_id: 'record-001',
      vote: OptimizedSQLFeedbackReqVoteEnum.agree,
      reason: '效果很好'
    });
    expect(onFeedbackChanged).toHaveBeenCalledTimes(1);
  });

  it('should call updateFeedback API with correct params and trigger onFeedbackChanged on success', async () => {
    const onFeedbackChanged = jest.fn();
    const { result } = superRenderHook(() =>
      useOptimizationFeedback({
        ...mockParams,
        onFeedbackChanged
      })
    );

    await act(async () => {
      result.current.updateFeedback('feedback-1', {
        vote: UpdateOptimizedSQLFeedbackReqVoteEnum.disagree,
        reason: '重新评估'
      });
      await jest.advanceTimersByTime(3000);
    });

    expect(updateFeedbackSpy).toHaveBeenCalledWith({
      project_name: 'default',
      optimization_record_id: 'record-001',
      feedback_id: 'feedback-1',
      vote: UpdateOptimizedSQLFeedbackReqVoteEnum.disagree,
      reason: '重新评估'
    });
    expect(onFeedbackChanged).toHaveBeenCalledTimes(1);
  });

  it('should call deleteFeedback API with correct params and trigger onFeedbackChanged on success', async () => {
    const onFeedbackChanged = jest.fn();
    const { result } = superRenderHook(() =>
      useOptimizationFeedback({
        ...mockParams,
        onFeedbackChanged
      })
    );

    await act(async () => {
      result.current.deleteFeedback('feedback-2');
      await jest.advanceTimersByTime(3000);
    });

    expect(deleteFeedbackSpy).toHaveBeenCalledWith({
      project_name: 'default',
      optimization_record_id: 'record-001',
      feedback_id: 'feedback-2'
    });
    expect(onFeedbackChanged).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onFeedbackChanged when API fails', async () => {
    const onFeedbackChanged = jest.fn();
    addFeedbackSpy.mockRejectedValue(new Error('Network Error'));

    const { result } = superRenderHook(() =>
      useOptimizationFeedback({
        ...mockParams,
        onFeedbackChanged
      })
    );

    await act(async () => {
      result.current.addFeedback({
        vote: OptimizedSQLFeedbackReqVoteEnum.agree
      });
      await jest.advanceTimersByTime(3000);
    });

    expect(onFeedbackChanged).not.toHaveBeenCalled();
  });

  it('should update local feedbacks via updateLocalFeedbacks', () => {
    const { result } = superRenderHook(() =>
      useOptimizationFeedback(mockParams)
    );

    const newFeedbacks = [optimizedSQLFeedbacksMockData[0]];

    act(() => {
      result.current.updateLocalFeedbacks(newFeedbacks);
    });

    expect(result.current.feedbacks).toEqual(newFeedbacks);
  });

  it('should set submitting to true while addFeedback is loading', async () => {
    let resolveAdd: (value: unknown) => void;
    addFeedbackSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAdd = resolve;
        })
    );

    const { result } = superRenderHook(() =>
      useOptimizationFeedback(mockParams)
    );

    act(() => {
      result.current.addFeedback({
        vote: OptimizedSQLFeedbackReqVoteEnum.agree
      });
    });

    expect(result.current.submitting).toBe(true);

    await act(async () => {
      resolveAdd!({ data: { code: 0 } });
      await jest.advanceTimersByTime(100);
    });

    expect(result.current.submitting).toBe(false);
  });

  it('should set deleteLoading to true while deleteFeedback is loading', async () => {
    let resolveDelete: (value: unknown) => void;
    deleteFeedbackSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDelete = resolve;
        })
    );

    const { result } = superRenderHook(() =>
      useOptimizationFeedback(mockParams)
    );

    act(() => {
      result.current.deleteFeedback('feedback-1');
    });

    expect(result.current.deleteLoading).toBe(true);

    await act(async () => {
      resolveDelete!({ data: { code: 0 } });
      await jest.advanceTimersByTime(100);
    });

    expect(result.current.deleteLoading).toBe(false);
  });

  it('should handle addFeedback without reason', async () => {
    const { result } = superRenderHook(() =>
      useOptimizationFeedback(mockParams)
    );

    await act(async () => {
      result.current.addFeedback({
        vote: OptimizedSQLFeedbackReqVoteEnum.disagree
      });
      await jest.advanceTimersByTime(3000);
    });

    expect(addFeedbackSpy).toHaveBeenCalledWith({
      project_name: 'default',
      optimization_record_id: 'record-001',
      vote: OptimizedSQLFeedbackReqVoteEnum.disagree
    });
  });

  it('should use success response with non-SUCCESS code and not trigger onFeedbackChanged', async () => {
    const onFeedbackChanged = jest.fn();
    addFeedbackSpy.mockImplementation(() =>
      createSpySuccessResponse({ code: 500, message: 'Error' })
    );

    const { result } = superRenderHook(() =>
      useOptimizationFeedback({
        ...mockParams,
        onFeedbackChanged
      })
    );

    await act(async () => {
      result.current.addFeedback({
        vote: OptimizedSQLFeedbackReqVoteEnum.agree
      });
      await jest.advanceTimersByTime(3000);
    });

    expect(onFeedbackChanged).not.toHaveBeenCalled();
  });
});
