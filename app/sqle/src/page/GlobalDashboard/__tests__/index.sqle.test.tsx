import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import GlobalDashboard from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getAllBySelector,
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  useTypedNavigate: jest.fn(),
  useTypedQuery: jest.fn()
}));

describe('GlobalDashboard', () => {
  const navigateSpy = jest.fn();
  const extractQuerySpy = jest.fn();

  let getGlobalWorkflowStatisticsSpy: jest.SpyInstance;
  let getGlobalWorkflowListSpy: jest.SpyInstance;
  let getGlobalSqlManageStatisticsSpy: jest.SpyInstance;
  let getGlobalSqlManageTaskListSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();

    getGlobalWorkflowStatisticsSpy =
      sqleMockApi.globalDashboard.getGlobalWorkflowStatistics();
    getGlobalWorkflowListSpy =
      sqleMockApi.globalDashboard.getGlobalWorkflowList();
    getGlobalSqlManageStatisticsSpy =
      sqleMockApi.globalDashboard.getGlobalSqlManageStatistics();
    getGlobalSqlManageTaskListSpy =
      sqleMockApi.globalDashboard.getGlobalSqlManageTaskList();
    getInstanceTipListSpy = sqleMockApi.instance.getInstanceTipList();

    (useTypedNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useTypedQuery as jest.Mock).mockImplementation(() => extractQuerySpy);
    extractQuerySpy.mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render workflow tab by default', async () => {
    const { baseElement } = superRender(<GlobalDashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('工单管理')).toBeInTheDocument();
    expect(screen.getByText('SQL治理')).toBeInTheDocument();

    expect(getGlobalWorkflowStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('待我处理')).toBeInTheDocument();
    expect(screen.getByText('我发起的')).toBeInTheDocument();
    expect(screen.getByText('已归档')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should switch to sql governance tab from query', async () => {
    extractQuerySpy.mockReturnValue({ tab: 'sqlGovernance' });

    superRender(<GlobalDashboard />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getGlobalSqlManageStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalSqlManageTaskListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('待治理SQL')).toBeInTheDocument();
  });

  it('should navigate with tab query when switching tabs', () => {
    superRender(<GlobalDashboard />);

    fireEvent.click(screen.getByText('SQL治理'));

    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index,
      {
        queries: { tab: 'sqlGovernance' },
        replace: true
      }
    );
  });

  it('should refresh current tab when page refresh button is clicked', async () => {
    superRender(<GlobalDashboard />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getGlobalWorkflowStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(1);

    const titleNode = screen.getByText('Dashboard');
    const refreshIcon = titleNode.parentElement?.querySelector(
      '.custom-icon-refresh'
    );

    expect(refreshIcon).toBeInTheDocument();
    fireEvent.click(refreshIcon as Element);

    await act(async () => jest.advanceTimersByTime(0));

    expect(getGlobalWorkflowStatisticsSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalSqlManageStatisticsSpy).toHaveBeenCalledTimes(0);
    expect(getGlobalSqlManageTaskListSpy).toHaveBeenCalledTimes(0);
  });

  it('should request instance list when project changes', async () => {
    superRender(<GlobalDashboard />);

    fireEvent.mouseDown(getAllBySelector('.ant-select-selector')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('test'));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipListSpy).toHaveBeenCalledWith({
      project_name: 'test'
    });
  });
});
