import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import useSqlOptimization from '../useSqlOptimization';
import {
  mockUseDbServiceDriver,
  mockUseCurrentProject,
  mockUsePermission,
  sqleMockApi
} from '@actiontech/shared/lib/testUtil';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSqlAnalyzeModalStatus,
  initSqlAnalyzeModalStatus,
  updateResultDrawerData
} from '../../../../store/sqlAnalyze';
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
  let getInstanceTipListSpy: jest.SpyInstance;
  const currentTime = dayjs('2025-01-09 12:00:00');

  beforeEach(() => {
    MockDate.set(currentTime.valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true),
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      {
        useSpyOnMockHooks: true
      }
    );
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    sqlOptimizeSpy = sqleMockApi.sqlOptimization.optimizeSQLReq();
    getInstanceTipListSpy = sqleMockApi.instance.getInstanceTipList();
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
    expect(typeof result.current.onCreateSqlOptimization).toBe('function');
    expect(typeof result.current.onViewOptimizationResult).toBe('function');
    expect(typeof result.current.setOptimizationCreationParams).toBe(
      'function'
    );
  });

  it('should allow SQL optimization when instance name is set and permission is granted', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    expect(result.current.allowSqlOptimization).toBe(true);
  });

  it('should not allow SQL optimization when instance name is not set', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.allowSqlOptimization).toBe(false);
  });

  it('should not allow SQL optimization when updateInstanceList is loading', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    expect(result.current.allowSqlOptimization).toBe(false);
  });

  it('should not allow SQL optimization when permission is denied', async () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(false)
      },
      {
        useSpyOnMockHooks: true
      }
    );

    const { result } = renderHook(() => useSqlOptimization());
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'test-instance'
      });
    });

    expect(result.current.allowSqlOptimization).toBe(false);
  });

  it('should create SQL optimization successfully with enable_high_analysis', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
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
        instance_name: 'mysql-1',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    await act(async () => {
      result.current.onCreateSqlOptimization(true);
      await jest.advanceTimersByTime(100);
    });

    expect(result.current.createSqlOptimizationLoading).toBe(true);

    await act(async () => {
      await jest.advanceTimersByTime(2900);
    });

    expect(result.current.createSqlOptimizationLoading).toBe(false);
    expect(result.current.optimizationRecordId).toBe(mockOptimizationId);

    expect(sqlOptimizeSpy).toHaveBeenCalledWith({
      db_type: 'MySQL',
      optimization_name: `UI${currentTime.format('YYYYMMDDhhmmssSSS')}`,
      project_name: 'default',
      instance_name: 'mysql-1',
      schema_name: 'test-schema',
      sql_content: 'SELECT * FROM users',
      enable_high_analysis: true
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

  it('should create SQL optimization successfully without enable_high_analysis', async () => {
    const { result } = renderHook(() => useSqlOptimization());
    await act(async () => jest.advanceTimersByTime(3000));
    const mockOptimizationId = 'test-optimization-id-2';

    sqlOptimizeSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql_optimization_record_id: mockOptimizationId
        }
      })
    );

    act(() => {
      result.current.setOptimizationCreationParams({
        instance_name: 'mysql-1',
        schema_name: 'test-schema',
        sql_content: 'SELECT * FROM users'
      });
    });

    await act(async () => {
      result.current.onCreateSqlOptimization(false);
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationRecordId).toBe(mockOptimizationId);

    expect(sqlOptimizeSpy).toHaveBeenCalledWith({
      db_type: 'MySQL',
      optimization_name: `UI${currentTime.format('YYYYMMDDhhmmssSSS')}`,
      project_name: 'default',
      instance_name: 'mysql-1',
      schema_name: 'test-schema',
      sql_content: 'SELECT * FROM users',
      enable_high_analysis: false
    });
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
      result.current.onCreateSqlOptimization();
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
      result.current.onCreateSqlOptimization();
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.optimizationRecordId).toBeUndefined();
  });

  it('should open result drawer when onViewOptimizationResult is called with existing record', async () => {
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
      result.current.onCreateSqlOptimization();
      await jest.advanceTimersByTime(3000);
    });

    // 清除之前的dispatch调用
    mockDispatch.mockClear();

    // 再次调用onViewOptimizationResult，应该直接打开抽屉
    act(() => {
      result.current.onViewOptimizationResult();
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
