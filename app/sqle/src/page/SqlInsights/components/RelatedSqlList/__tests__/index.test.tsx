import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import RelatedSqlList from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { useDispatch, useSelector } from 'react-redux';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import MockDate from 'mockdate';
import {
  getAllBySelector,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import dayjs from 'dayjs';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('RelatedSqlList', () => {
  const dispatchSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);
  let getSqlPerformanceInsightsRelatedSQLSpy: jest.SpyInstance;

  const defaultProps = {
    instanceId: 'test-instance-id'
  };
  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    MockDate.set(dayjs('2025-01-23 12:00:00').valueOf());
    mockUseCurrentProject();
    mockUseCurrentUser();
    getSqlPerformanceInsightsRelatedSQLSpy =
      sqleMockApi.sqlInsight.getSqlPerformanceInsightsRelatedSQL();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    MockDate.reset();
    cleanup();
  });

  it('should render component with date range selected', async () => {
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

    const { baseElement } = superRender(<RelatedSqlList {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('选定区间关联的SQL')).toBeInTheDocument();
    expect(
      screen.getByText('(2025-01-22 12:00:00 ~ 2025-01-23 12:00:00)')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render component without date range selected', async () => {
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

    superRender(<RelatedSqlList {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('选定区间关联的SQL')).toBeInTheDocument();
    expect(screen.getByText('(请选择日期范围)')).toBeInTheDocument();
    expect(getSqlPerformanceInsightsRelatedSQLSpy).not.toHaveBeenCalled();
  });

  it('should call API with correct parameters when date range is selected', async () => {
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

    superRender(<RelatedSqlList {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsRelatedSQLSpy).toHaveBeenCalledWith({
      project_name: 'default',
      instance_id: 'test-instance-id',
      start_time: '2025-01-22 12:00:00',
      end_time: '2025-01-23 12:00:00',
      page_index: 1,
      page_size: 20,
      filter_source: 'workflow'
    });
  });

  it('should handle filter change', async () => {
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

    superRender(<RelatedSqlList {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    const filterSelect = getAllBySelector('.ant-select-selector')[0];
    fireEvent.mouseDown(filterSelect);

    await act(async () => jest.advanceTimersByTime(100));

    const sqlManageOption = screen.getByText('SQL管控');
    fireEvent.click(sqlManageOption);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsRelatedSQLSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_source: 'sql_manage'
      })
    );
  });

  it('should not make API call when instanceId is not provided', async () => {
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

    superRender(<RelatedSqlList instanceId={undefined} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlPerformanceInsightsRelatedSQLSpy).not.toHaveBeenCalled();
  });

  it('should call clearDateRange when component unmounts', async () => {
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

    const { unmount } = superRender(<RelatedSqlList {...defaultProps} />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('选定区间关联的SQL')).toBeInTheDocument();

    dispatchSpy.mockClear();

    unmount();

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlInsights/updateRelateSqlListDateRange',
      payload: { dateRange: null }
    });
  });
});
