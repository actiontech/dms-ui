import { renderHook, act } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { sqlOptimization } from '@actiontech/shared/lib/testUtil/mockApi/sqle';
import useOptimizationResult from '../useOptimizationResult';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OptimizationResultStatus } from '../../index.type';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi/common';

describe('useOptimizationResult', () => {
  let getOptimizationSQLDetailV2Spy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    sqlOptimization.mockAllApi();
    getOptimizationSQLDetailV2Spy = sqlOptimization.getOptimizationSQLDetail();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = superRenderHook(() => useOptimizationResult());

    expect(result.current.optimizationResultStatus).toBeUndefined();
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.optimizationResult).toBeUndefined();
    expect(result.current.optimizationResultLoading).toBe(false);
    expect(typeof result.current.getOptimizationResult).toBe('function');
    expect(typeof result.current.cancelOptimizationRequestPolling).toBe(
      'function'
    );
  });

  it('should handle successful API response', async () => {
    const mockData = {
      status: OptimizationSQLDetailStatusEnum.finish,
      origin_sql: 'SELECT * FROM test',
      optimize: {
        steps: []
      }
    };

    getOptimizationSQLDetailV2Spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockData })
    );

    const { result } = superRenderHook(() => useOptimizationResult());

    await act(async () => {
      result.current.getOptimizationResult('test-id');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResultLoading).toBe(false);
    expect(result.current.optimizationResultStatus).toBe(
      OptimizationResultStatus.RESOLVED
    );
    expect(result.current.optimizationResult).toEqual(mockData);
    expect(result.current.errorMessage).toBeUndefined();

    expect(getOptimizationSQLDetailV2Spy).toHaveBeenCalledWith({
      project_name: 'default',
      optimization_record_id: 'test-id'
    });
  });

  it('should handle API error response', async () => {
    const mockError = new Error('Network Error');
    getOptimizationSQLDetailV2Spy.mockRejectedValue(mockError);

    const { result } = superRenderHook(() => useOptimizationResult());

    await act(async () => {
      result.current.getOptimizationResult('test-id');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResultLoading).toBe(false);
    expect(result.current.optimizationResultStatus).toBe(
      OptimizationResultStatus.FAILED
    );
    expect(result.current.errorMessage).toBe('Network Error');
    expect(result.current.optimizationResult).toBeUndefined();
  });

  it('should continue polling when status is optimizing', async () => {
    const mockOptimizingData = {
      status: OptimizationSQLDetailStatusEnum.optimizing,
      origin_sql: 'SELECT * FROM test'
    };

    const mockCompletedData = {
      status: OptimizationSQLDetailStatusEnum.finish,
      origin_sql: 'SELECT * FROM test',
      optimize: {
        steps: []
      }
    };

    getOptimizationSQLDetailV2Spy
      .mockResolvedValueOnce({
        data: {
          code: ResponseCode.SUCCESS,
          data: mockOptimizingData
        }
      })
      .mockResolvedValueOnce({
        data: {
          code: ResponseCode.SUCCESS,
          data: mockCompletedData
        }
      });

    const { result } = superRenderHook(() =>
      useOptimizationResult({ pollingInterval: 1000 })
    );

    await act(async () => {
      result.current.getOptimizationResult('test-id');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResult).toEqual(mockOptimizingData);
    expect(result.current.optimizationResultStatus).toBe(
      OptimizationResultStatus.RESOLVED
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.optimizationResult).toEqual(mockCompletedData);

    expect(getOptimizationSQLDetailV2Spy).toHaveBeenCalledTimes(2);
  });

  it('should stop polling when status is not optimizing', async () => {
    const mockData = {
      status: OptimizationSQLDetailStatusEnum.finish,
      origin_sql: 'SELECT * FROM test'
    };

    getOptimizationSQLDetailV2Spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockData })
    );

    const { result } = superRenderHook(() =>
      useOptimizationResult({ pollingInterval: 1000 })
    );

    await act(async () => {
      result.current.getOptimizationResult('test-id');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResult).toEqual(mockData);

    await act(async () => jest.advanceTimersByTime(1000));

    expect(getOptimizationSQLDetailV2Spy).toHaveBeenCalledTimes(1);
  });

  it('should handle cancel polling manually', async () => {
    const mockData = {
      status: OptimizationSQLDetailStatusEnum.optimizing,
      origin_sql: 'SELECT * FROM test'
    };

    getOptimizationSQLDetailV2Spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockData })
    );

    const { result } = superRenderHook(() =>
      useOptimizationResult({ pollingInterval: 1000 })
    );

    await act(async () => {
      result.current.getOptimizationResult('test-id');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResult).toEqual(mockData);

    await act(async () => {
      result.current.cancelOptimizationRequestPolling();
      await jest.advanceTimersByTime(1000);
    });

    expect(getOptimizationSQLDetailV2Spy).toHaveBeenCalledTimes(1);
  });

  it('should handle API response with non-success code', async () => {
    getOptimizationSQLDetailV2Spy.mockImplementation(() =>
      createSpyFailResponse({
        data: {
          code: 500,
          message: 'Something went wrong'
        }
      })
    );

    const { result } = superRenderHook(() => useOptimizationResult());

    await act(async () => {
      result.current.getOptimizationResult('test-id');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResultLoading).toBe(false);
    expect(result.current.optimizationResult).toBeUndefined();
  });

  it('should handle multiple consecutive API calls', async () => {
    const mockData1 = {
      status: OptimizationSQLDetailStatusEnum.finish,
      origin_sql: 'SELECT * FROM test1'
    };

    const mockData2 = {
      status: OptimizationSQLDetailStatusEnum.finish,
      origin_sql: 'SELECT * FROM test2'
    };

    getOptimizationSQLDetailV2Spy
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockData1 })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockData2 })
      );

    const { result } = superRenderHook(() => useOptimizationResult());

    await act(async () => {
      result.current.getOptimizationResult('test-id-1');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResult).toEqual(mockData1);

    await act(async () => {
      result.current.getOptimizationResult('test-id-2');
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationResult).toEqual(mockData2);

    expect(getOptimizationSQLDetailV2Spy).toHaveBeenCalledTimes(2);
    expect(getOptimizationSQLDetailV2Spy).toHaveBeenNthCalledWith(1, {
      project_name: 'default',
      optimization_record_id: 'test-id-1'
    });
    expect(getOptimizationSQLDetailV2Spy).toHaveBeenNthCalledWith(2, {
      project_name: 'default',
      optimization_record_id: 'test-id-2'
    });
  });

  it('should handle empty params correctly', () => {
    const { result } = superRenderHook(() => useOptimizationResult(undefined));

    expect(result.current.optimizationResultStatus).toBeUndefined();
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.optimizationResult).toBeUndefined();
    expect(result.current.optimizationResultLoading).toBe(false);
  });
});
