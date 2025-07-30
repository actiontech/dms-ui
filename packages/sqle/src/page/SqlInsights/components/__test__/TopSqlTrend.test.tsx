import { act, cleanup, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import TopSqlTrend from '../TopSqlTrend';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import MockDate from 'mockdate';
import {
  getBySelector,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { DateRangeEnum } from '../../index.data';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('TopSqlTrend', () => {
  const dispatchSpy = jest.fn();

  let getSqlPerformanceInsightsSpy: jest.SpyInstance;

  const defaultProps = {
    instanceId: 'test-instance-id',
    dateRange: [dayjs('2025-01-22'), dayjs('2025-01-23')] as [
      dayjs.Dayjs,
      dayjs.Dayjs
    ],
    pollingInterval: 30000,
    onCreateSqlManagementConf: jest.fn(),
    timePeriod: DateRangeEnum['24H']
  };

  beforeEach(() => {
    MockDate.set(dayjs('2025-01-23 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    mockUseCurrentUser();
    getSqlPerformanceInsightsSpy =
      sqleMockApi.sqlInsight.getSqlPerformanceInsights();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlInsights: {
          relateSqlList: {
            selectedDateRange: null,
            selectedRecord: null
          }
        }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    MockDate.reset();
    cleanup();
  });

  it('should render component correctly when task is supported', async () => {
    const { baseElement } = superRender(<TopSqlTrend {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledWith({
      instance_id: defaultProps.instanceId,
      metric_name: 'top_sql_trend',
      start_time: '2025-01-22 12:00:00',
      end_time: '2025-01-23 12:00:00',
      project_name: 'default'
    });

    expect(screen.getByText('TopSQL执行趋势')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should not render when task is not supported', async () => {
    getSqlPerformanceInsightsSpy.mockImplementation(() => {
      return createSpySuccessResponse({
        data: {
          task_support: false
        }
      });
    });

    superRender(<TopSqlTrend {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('活跃会话数趋势')).not.toBeInTheDocument();
  });

  it('should handle error message', async () => {
    const errorMessage = 'Test error message';
    getSqlPerformanceInsightsSpy.mockImplementation(() => {
      return createSpyFailResponse({
        message: errorMessage
      });
    });

    superRender(<TopSqlTrend {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should handle task not enabled state', async () => {
    getSqlPerformanceInsightsSpy.mockImplementation(() => {
      return createSpySuccessResponse({
        data: {
          task_support: true,
          task_enable: false
        }
      });
    });

    superRender(<TopSqlTrend {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getBySelector('.task-enabled-tips')).toBeInTheDocument();
  });

  it('should handle refresh event', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    superRender(<TopSqlTrend {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      eventEmitter.emit(EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH);
    });

    await act(async () => jest.advanceTimersByTime(100));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(2);

    emitSpy.mockRestore();
  });

  it('should handle polling interval', async () => {
    const propsWithPolling = {
      ...defaultProps,
      pollingInterval: 5000
    };

    superRender(<TopSqlTrend {...propsWithPolling} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(5000));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(2);
  });

  it('should cancel polling when selelcted dateRange is exited', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlInsights: {
          relateSqlList: {
            selectedDateRange: [
              dayjs('2025-01-22 12:00:00'),
              dayjs('2025-01-23 12:00:00')
            ],
            selectedRecord: null
          }
        }
      })
    );
    const propsWithPolling = {
      ...defaultProps,
      pollingInterval: 5000
    };

    superRender(<TopSqlTrend {...propsWithPolling} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(5000));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(1);
  });
});
