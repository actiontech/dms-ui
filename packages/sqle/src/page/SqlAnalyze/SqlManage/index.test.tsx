import { act, fireEvent, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../../testUtils/mockRequest';

import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { SQLManageSqlAnalyzeData } from '../__testData__';
import SQLManageAnalyze from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import sqlManageMock from '../../../testUtils/mockApi/sqlManage';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { translateTimeForRequest } from '@actiontech/shared/lib/utils/Common';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn()
  };
});

const projectName = 'default';

describe('SqlAnalyze/SQLManage', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  let getSqlManageSqlAnalysisChartSpy: jest.SpyInstance;
  let currentTime = dayjs('2025-01-09 12:00:00');
  beforeEach(() => {
    MockDate.set(currentTime.valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    useParamsMock.mockReturnValue({
      sqlManageId: 'sqlManageId1',
      sqlNum: '123',
      projectName
    });
    getSqlManageSqlAnalysisChartSpy =
      sqlManageMock.getSqlManageSqlAnalysisChart();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(SqlManage, 'GetSqlManageSqlAnalysisV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        ...SQLManageSqlAnalyzeData,
        sql_explain: {
          ...SQLManageSqlAnalyzeData.sql_explain,
          cost: 3
        }
      })
    );
    return spy;
  };

  it('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = renderWithReduxAndTheme(
      <SQLManageAnalyze />
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      project_name: projectName,
      sql_manage_id: 'sqlManageId1'
    });
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(300));
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[1]);
    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[2]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  it('filter sql execution plan cost', async () => {
    mockGetAnalyzeData();
    const { container } = renderWithReduxAndTheme(<SQLManageAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    expect(screen.getByText('SQL执行计划代价趋势')).toBeInTheDocument();
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(1);
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenNthCalledWith(1, {
      sql_manage_id: 'sqlManageId1',
      project_name: projectName,
      metric_name: 'explain_cost',
      start_time: translateTimeForRequest(currentTime.subtract(24, 'hour')),
      end_time: translateTimeForRequest(currentTime),
      latest_point_enabled: true
    });

    fireEvent.click(screen.getByText('7天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenCalledTimes(2);
    expect(getSqlManageSqlAnalysisChartSpy).toHaveBeenNthCalledWith(2, {
      sql_manage_id: 'sqlManageId1',
      project_name: projectName,
      metric_name: 'explain_cost',
      start_time: translateTimeForRequest(currentTime.subtract(7, 'day')),
      end_time: translateTimeForRequest(currentTime),
      latest_point_enabled: true
    });

    fireEvent.click(screen.getByText('24小时'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlManageSqlAnalysisChartSpy).not.toHaveBeenCalledTimes(3);
  });

  it('should render error result of type "info" when response code is 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(
        {
          sql_explain: {
            err_message: 'error: sql_explain'
          },
          table_metas: {
            err_message: 'error: table_metas'
          },
          performance_statistics: {
            affect_rows: {
              err_message: 'error: affect_rows'
            }
          }
        },
        {
          otherData: {
            code: 8001
          }
        }
      )
    );
    const { container } = renderWithReduxAndTheme(<SQLManageAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should render error result of type "error" when response code is not 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(
        {
          sql_explain: {
            err_message: 'error: sql_explain'
          },
          table_metas: {
            err_message: 'error: table_metas'
          },
          performance_statistics: {
            affect_rows: {
              err_message: 'error: affect_rows'
            }
          }
        },
        {
          otherData: {
            code: 8000
          }
        }
      )
    );
    const { container } = renderWithReduxAndTheme(<SQLManageAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
