import { act, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRenderHook } from '../../../../testUtils/superRender';

import useSQLExecPlan from '../useSQLExecPlan';
import { sqlExecPlans } from '../../__testData__';
import { mockSqlManageSqlAnalysisChartData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage/data';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('SqlAnalyze/useSQLExecPlan', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set(dayjs('2024-01-09 12:00:00').valueOf());
  });

  afterEach(() => {
    jest.useRealTimers();
    MockDate.reset();
  });

  it('render generateSQLExecPlanContent when have err_message', async () => {
    const { result } = sqleSuperRenderHook(() => useSQLExecPlan({}));

    await act(async () => {
      const elementEmpty = result.current.generateSQLExecPlanContent({});
      expect(elementEmpty).toMatchSnapshot();
    });

    await act(async () => {
      const elementError = result.current.generateSQLExecPlanContent({
        err_message: 'sql_explain err_message'
      });
      expect(elementError).toMatchSnapshot();
    });
  });

  it('render generateSQLExecPlanContent when have data', async () => {
    const { result } = sqleSuperRenderHook(() => useSQLExecPlan({}));

    await act(async () => {
      const elementSQL = result.current.generateSQLExecPlanContent({
        sql: "CREATE TABLE IF NOT EXISTS task (  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  title VARCHAR(255) NOT NULL DEFAULT '',  description TEXT,  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);"
      });
      expect(elementSQL).toMatchSnapshot();
    });

    await act(async () => {
      const elementSQLExplain = result.current.generateSQLExecPlanContent({
        classic_result: sqlExecPlans[1].classic_result
      });
      expect(elementSQLExplain).toMatchSnapshot();
    });

    await act(async () => {
      const elementPerformanceStatisticsError =
        result.current.generateSQLExecPlanContent({
          affect_rows: {
            err_message: 'affect_rows error'
          }
        });
      expect(elementPerformanceStatisticsError).toMatchSnapshot();
    });

    await act(async () => {
      const elementPerformanceStatistics =
        result.current.generateSQLExecPlanContent({
          affect_rows: {
            count: 10,
            err_message: ''
          }
        });
      expect(elementPerformanceStatistics).toMatchSnapshot();
    });
  });

  it('render generateSQLExecPlanContent when showExecPlanCostChart is true', async () => {
    const { result } = sqleSuperRenderHook(() =>
      useSQLExecPlan({
        showExecPlanCostChart: true,
        sqlExecPlanCostDataSource: mockSqlManageSqlAnalysisChartData.points,
        getSqlExecPlanCostDataSourceLoading: false,
        initTime: dayjs('2024-01-09 12:00:00')
      })
    );

    const { baseElement } = superRender(
      <>
        {result.current.generateSQLExecPlanContent({
          sql: "CREATE TABLE IF NOT EXISTS task (  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  title VARCHAR(255) NOT NULL DEFAULT '',  description TEXT,  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);",
          classic_result: sqlExecPlans[1].classic_result
        })}
      </>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL执行计划代价趋势')).toBeInTheDocument();
  });

  it('render generateSQLExecPlanContent when selected point is not undefined', async () => {
    const { result } = sqleSuperRenderHook(() =>
      useSQLExecPlan({
        showExecPlanCostChart: true,
        sqlExecPlanCostDataSource: mockSqlManageSqlAnalysisChartData.points,
        getSqlExecPlanCostDataSourceLoading: false,
        selectedPoint: [
          mockSqlManageSqlAnalysisChartData.points[0],
          mockSqlManageSqlAnalysisChartData.points[1]
        ],
        setSelectedPoint: jest.fn()
      })
    );

    const { baseElement } = superRender(
      <>
        {result.current.generateSQLExecPlanContent({
          sql: "CREATE TABLE IF NOT EXISTS task (  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  title VARCHAR(255) NOT NULL DEFAULT '',  description TEXT,  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);",
          classic_result: sqlExecPlans[1].classic_result
        })}
      </>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL执行计划代价趋势')).toBeInTheDocument();
    expect(
      screen.getByText(mockSqlManageSqlAnalysisChartData.points[0].x)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSqlManageSqlAnalysisChartData.points[1].x)
    ).toBeInTheDocument();
  });

  it('render generateSQLExecPlanContent when filter execute plan cost chart', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { result } = sqleSuperRenderHook(() =>
      useSQLExecPlan({
        showExecPlanCostChart: true,
        sqlExecPlanCostDataSource: mockSqlManageSqlAnalysisChartData.points,
        getSqlExecPlanCostDataSourceLoading: false,
        getSqlExecPlanCostDataSource: getSqlExecPlanCostDataSourceSpy
      })
    );
    const { baseElement } = superRender(
      <>
        {result.current.generateSQLExecPlanContent({
          sql: "CREATE TABLE IF NOT EXISTS task (  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  title VARCHAR(255) NOT NULL DEFAULT '',  description TEXT,  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);",
          classic_result: sqlExecPlans[1].classic_result
        })}
      </>
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('7天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('30天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(2);

    fireEvent.click(getBySelector('.ant-picker'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('td[title="2024-01-01"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.ant-picker-ok button'));
    fireEvent.click(getBySelector('td[title="2024-01-03"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.ant-picker-ok button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(3);
  });
});
