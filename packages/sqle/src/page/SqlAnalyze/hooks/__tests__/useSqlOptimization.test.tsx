import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import useSqlOptimization from '../useSqlOptimization';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSqlAnalyzeModalStatus,
  initSqlAnalyzeModalStatus,
  updateResultDrawerData
} from '../../../../store/sqlAnalyze';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('SqlAnalyze/useSqlOptimization', () => {
  const mockDispatch = jest.fn();
  let sqlOptimizeSpy: jest.SpyInstance;
  const currentTime = dayjs('2025-01-09 12:00:00');

  beforeEach(() => {
    MockDate.set(currentTime.valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      {
        useSpyOnMockHooks: true
      }
    );
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    sqlOptimizeSpy = sqlOptimization.optimizeSQLReq();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('should initialize modal status on mount', () => {
    renderHook(() => useSqlOptimization());

    expect(mockDispatch).toHaveBeenCalledWith(
      initSqlAnalyzeModalStatus({
        modalStatus: {
          [ModalName.Sql_Optimization_Result_Drawer]: false
        }
      })
    );
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useSqlOptimization());

    expect(result.current.optimizationRecordId).toBeUndefined();
    expect(result.current.createSqlOptimizationLoading).toBe(false);
    expect(result.current.allowSqlOptimization).toBe(false);
    expect(typeof result.current.createSqlOptimiationSync).toBe('function');
    expect(typeof result.current.onCreateSqlOptimizationOrview).toBe(
      'function'
    );
    expect(typeof result.current.setOptimizationCreationParams).toBe(
      'function'
    );
  });

  it('should allow SQL optimization when instance name is set and permission is granted', () => {
    const { result } = renderHook(() => useSqlOptimization());

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    expect(result.current.allowSqlOptimization).toBe(true);
  });

  it('should not allow SQL optimization when instance name is not set', () => {
    const { result } = renderHook(() => useSqlOptimization());

    expect(result.current.allowSqlOptimization).toBe(false);
  });

  it('should not allow SQL optimization when permission is denied', () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(false)
      },
      {
        useSpyOnMockHooks: true
      }
    );

    const { result } = renderHook(() => useSqlOptimization());

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance'
      });
    });

    expect(result.current.allowSqlOptimization).toBe(false);
  });

  it('should create SQL optimization successfully', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    const mockOptimizationId = 'test-optimization-id';

    sqlOptimizeSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql_optimization_record_id: mockOptimizationId
        }
      })
    );

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    await act(async () => {
      result.current.createSqlOptimiationSync();
      await jest.advanceTimersByTime(100);
    });

    expect(result.current.createSqlOptimizationLoading).toBe(true);

    await act(async () => {
      await jest.advanceTimersByTime(2900);
    });

    expect(result.current.createSqlOptimizationLoading).toBe(false);
    expect(result.current.optimizationRecordId).toBe(mockOptimizationId);

    expect(sqlOptimizeSpy).toHaveBeenCalledWith({
      optimization_name: `UI${currentTime.format('YYYYMMDDhhmmssSSS')}`,
      project_name: 'default',
      instance_name: 'test-instance',
      schema_name: 'test-schema',
      sql_content: 'SELECT * FROM users'
    });

    // 验证成功后打开了结果抽屉
    expect(mockDispatch).toHaveBeenCalledWith(
      updateSqlAnalyzeModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Drawer,
        status: true
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      updateResultDrawerData({
        resultDrawerData: { optimizationId: mockOptimizationId }
      })
    );
  });

  it('should handle API error when creating SQL optimization', async () => {
    const { result } = renderHook(() => useSqlOptimization());

    sqlOptimizeSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {}
      })
    );

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    await act(async () => {
      result.current.createSqlOptimiationSync();
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationRecordId).toBeUndefined();

    // 验证失败时没有打开结果抽屉
    expect(mockDispatch).not.toHaveBeenCalledWith(
      updateSqlAnalyzeModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Drawer,
        status: true
      })
    );
  });

  it('should handle non-success response code', async () => {
    const { result } = renderHook(() => useSqlOptimization());

    sqlOptimizeSpy.mockImplementation(() =>
      createSpyFailResponse({
        data: {
          sql_optimization_record_id: 'test-id'
        }
      })
    );

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    await act(async () => {
      result.current.createSqlOptimiationSync();
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationRecordId).toBeUndefined();
  });

  it('should open result drawer when onCreateSqlOptimizationOrview is called with existing record', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    const existingOptimizationId = 'existing-optimization-id';

    // 先创建一个记录
    sqlOptimizeSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql_optimization_record_id: existingOptimizationId
        }
      })
    );

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    await act(async () => {
      result.current.createSqlOptimiationSync();
      await jest.advanceTimersByTime(3000);
    });

    // 清除之前的dispatch调用
    mockDispatch.mockClear();

    // 再次调用onCreateSqlOptimizationOrview，应该直接打开抽屉
    act(() => {
      result.current.onCreateSqlOptimizationOrview();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSqlAnalyzeModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Drawer,
        status: true
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      updateResultDrawerData({
        resultDrawerData: { optimizationId: existingOptimizationId }
      })
    );

    // 验证没有再次调用API
    expect(sqlOptimizeSpy).toHaveBeenCalledTimes(1);
  });
});
