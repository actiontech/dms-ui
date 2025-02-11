import { renderHook, act } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import useSqlExecPlanCost from '../useSqlExecPlanCost';
import sqlManage from '../../../../testUtils/mockApi/sqlManage';
import { mockSqlManageSqlAnalysisChartData } from '../../../../testUtils/mockApi/sqlManage/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { translateTimeForRequest } from '@actiontech/shared/lib/utils/Common';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { DateRangeEnum } from '../../SqlAnalyze/ExecPlanCostChart/index.data';

describe('SqlAnalyze/useSqlExecPlanCost', () => {
  let getSqlManageSqlAnalysisChartSpy: jest.SpyInstance;
  const mockId = '1';
  const mockPoints = mockSqlManageSqlAnalysisChartData.points.map((i) => ({
    ...i,
    x: formatTime(i.x)
  }));
  let currentTime = dayjs('2025-01-09 12:00:00');
  beforeEach(() => {
    MockDate.set(currentTime.valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    getSqlManageSqlAnalysisChartSpy = sqlManage.getSqlManageSqlAnalysisChart();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('should return current time', () => {
    const { result } = renderHook(() => useSqlExecPlanCost(mockId));
    expect(result.current.initTime.valueOf()).toBe(currentTime.valueOf());
  });

  it('should request api when calling the getSQLExecPlanCostDataSource', async () => {
    const { result } = renderHook(() => useSqlExecPlanCost(mockId));
    expect(result.current.getSqlExecPlanCostDataSourceLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(24, 'hour'),
        endTime: currentTime,
        lastPointEnabled: true
      });
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.getSqlExecPlanCostDataSourceLoading).toBe(true);
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(1);
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenNthCalledWith(1, {
      sql_manage_id: mockId,
      project_name: 'default',
      metric_name: 'explain_cost',
      start_time: translateTimeForRequest(currentTime.subtract(24, 'hour')),
      end_time: translateTimeForRequest(currentTime),
      latest_point_enabled: true
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(result.current.getSqlExecPlanCostDataSourceLoading).toBe(false);
    expect(result.current.data).toEqual([
      ...mockPoints,
      {
        x: '2025-01-09 12:00:00'
      }
    ]);
    expect(result.current.selectedPoint).toEqual([
      mockPoints[mockPoints.length - 2],
      mockPoints[mockPoints.length - 1]
    ]);
    expect(result.current.getSqlExecPlanCostDataSourceError).toBe(undefined);
  });

  it('data should be cached and not request api when filtered by 24h/7d/32d', async () => {
    const { result } = renderHook(() => useSqlExecPlanCost(mockId));
    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(24, 'hour'),
        endTime: currentTime,
        lastPointEnabled: true,
        rangeType: DateRangeEnum['24H']
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(7, 'day'),
        endTime: currentTime,
        lastPointEnabled: true,
        rangeType: DateRangeEnum['7D']
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(2);

    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(30, 'day'),
        endTime: currentTime,
        lastPointEnabled: true,
        rangeType: DateRangeEnum['30D']
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(3);

    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(24, 'hour'),
        endTime: currentTime,
        lastPointEnabled: true,
        rangeType: DateRangeEnum['24H']
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(getSqlManageSqlAnalysisChartSpy).not.toHaveBeenCalledTimes(4);

    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(7, 'day'),
        endTime: currentTime,
        lastPointEnabled: true,
        rangeType: DateRangeEnum['7D']
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(getSqlManageSqlAnalysisChartSpy).not.toHaveBeenCalledTimes(4);

    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(30, 'day'),
        endTime: currentTime,
        lastPointEnabled: true,
        rangeType: DateRangeEnum['30D']
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(getSqlManageSqlAnalysisChartSpy).not.toHaveBeenCalledTimes(4);
  });

  it('should delete the selected point when current point is not exist in the data', async () => {
    const { result } = renderHook(() => useSqlExecPlanCost(mockId));
    await act(async () => {
      result.current.setSelectedPoint([
        {
          ...mockPoints[0],
          x: '2024-01-09 12:00:00'
        },
        mockPoints[1]
      ]);
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(24, 'hour'),
        endTime: currentTime,
        lastPointEnabled: true
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(result.current.selectedPoint).toEqual([mockPoints[1]]);
  });

  it('should reset selected points when all points are not exist in the data', async () => {
    const { result } = renderHook(() => useSqlExecPlanCost(mockId));
    await act(async () => {
      result.current.setSelectedPoint([
        {
          ...mockPoints[0],
          x: '2024-01-09 12:00:00'
        },
        {
          ...mockPoints[1],
          x: '2024-01-00 12:00:00'
        }
      ]);
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      result.current.getSqlExecPlanCostDataSource({
        startTime: currentTime.subtract(24, 'hour'),
        endTime: currentTime,
        lastPointEnabled: true
      });
      await jest.advanceTimersByTime(3000);
    });
    expect(result.current.selectedPoint).toEqual([
      mockPoints[mockPoints.length - 2],
      mockPoints[mockPoints.length - 1]
    ]);
  });
});
