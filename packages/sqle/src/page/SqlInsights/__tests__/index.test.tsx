import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SqlInsights from '../SqlInsights';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import { ModalName } from '../../../data/ModalName';
import MockDate from 'mockdate';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import {
  getAllBySelector,
  getBySelector,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('SqlInsights', () => {
  const dispatchSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  let getSqlPerformanceInsightsSpy: jest.SpyInstance;
  let getSqlPerformanceInsightsRelatedSQLSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  let getInstanceAuditPlansSpy: jest.SpyInstance;
  beforeEach(() => {
    MockDate.set(dayjs('2025-07-23 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    getSqlPerformanceInsightsSpy =
      sqleMockApi.sqlInsight.getSqlPerformanceInsights();
    getSqlPerformanceInsightsRelatedSQLSpy =
      sqleMockApi.sqlInsight.getSqlPerformanceInsightsRelatedSQL();
    getInstanceTipListSpy = sqleMockApi.instance.getInstanceTipList();
    getInstanceAuditPlansSpy =
      sqleMockApi.instanceAuditPlan.getInstanceAuditPlans();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlInsights: {
          relateSqlList: {
            selectedDateRange: null,
            selectedRecord: null
          },
          modalStatus: {
            [ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer]:
              false
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

  it('should render component correctly', async () => {
    const { baseElement } = superRender(<SqlInsights />);

    expect(screen.getByText('性能洞察')).toBeInTheDocument();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceAuditPlansSpy).toHaveBeenCalledTimes(1);

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(4);
    expect(screen.getByText('数据源综合性能趋势')).toBeInTheDocument();
    expect(screen.getByText('慢SQL趋势')).toBeInTheDocument();
    expect(screen.getByText('TopSQL执行趋势')).toBeInTheDocument();
    expect(screen.getByText('活跃会话数趋势')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  it('should get related sql list when current date range is exited', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlInsights: {
          relateSqlList: {
            selectedDateRange: [
              dayjs('2025-07-21 13:00:00'),
              dayjs('2025-07-22 10:00:00')
            ],
            selectedRecord: null
          },
          modalStatus: {
            [ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer]:
              false
          }
        }
      })
    );
    const { baseElement } = superRender(<SqlInsights />);

    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(4);

    expect(getSqlPerformanceInsightsRelatedSQLSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  it('should handle instance selection change', async () => {
    superRender(<SqlInsights />);
    await act(async () => jest.advanceTimersByTime(6000));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(4);

    fireEvent.mouseDown(getAllBySelector('.ant-select-selector')[0]);

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('mysql-2(10.186.62.14:33062)'));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(8);
  });

  it('should handle date range segmented change', async () => {
    superRender(<SqlInsights />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(4);

    fireEvent.click(screen.getByText('7天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(8);

    fireEvent.click(screen.getByText('30天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(12);

    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(16);

    fireEvent.click(screen.getByText('24小时'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlPerformanceInsightsSpy).toHaveBeenCalledTimes(20);
  });

  it('should handle auto refresh interval change', async () => {
    superRender(<SqlInsights />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByText('自动刷新时间间隔'));

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('30s'));
    await act(async () => jest.advanceTimersByTime(0));
  });

  it('should emit refresh event when refresh button is clicked', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    superRender(<SqlInsights />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.custom-icon-refresh'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH
    );

    emitSpy.mockRestore();
  });

  it('should disable future time in date picker', async () => {
    const { baseElement } = superRender(<SqlInsights />);
    await act(async () => jest.advanceTimersByTime(3000));

    const customOption = screen.getByText('自定义');

    fireEvent.click(customOption);

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.ant-picker'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('td[title="2025-07-20"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.ant-picker-ok button'));
    fireEvent.click(getBySelector('td[title="2025-07-22"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.ant-picker-ok button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
  });
});
