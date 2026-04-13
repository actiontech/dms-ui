import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlGovernancePanel from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi/common';
import { message } from 'antd';
import { GlobalSqlManageTaskItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('GlobalDashboard/SqlGovernancePanel', () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
  const warningSpy = jest
    .spyOn(message, 'warning')
    .mockImplementation(jest.fn());
  let getGlobalSqlManageStatisticsSpy: jest.SpyInstance;
  let getGlobalSqlManageTaskListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    getGlobalSqlManageStatisticsSpy =
      sqleMockApi.globalDashboard.getGlobalSqlManageStatistics();
    getGlobalSqlManageTaskListSpy =
      sqleMockApi.globalDashboard.getGlobalSqlManageTaskList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  afterAll(() => {
    openSpy.mockRestore();
    warningSpy.mockRestore();
  });

  it('should render sql governance panel and request data', async () => {
    const { baseElement } = superRender(<SqlGovernancePanel />);

    expect(getGlobalSqlManageStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalSqlManageTaskListSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('待治理SQL')).toBeInTheDocument();
    expect(screen.getByText('优化完成')).toBeInTheDocument();
    expect(screen.getByText('去优化')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should request optimized list when card switched', async () => {
    superRender(<SqlGovernancePanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('优化完成'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getGlobalSqlManageTaskListSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalSqlManageTaskListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filter_card: 'optimized'
      })
    );
  });

  it('should open sql management page when clicking optimize action', async () => {
    superRender(<SqlGovernancePanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('去优化'));

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('/sqle/project/1/sql-management'),
      '_blank'
    );
    expect((openSpy as jest.Mock).mock.calls[0][0]).toContain(
      'status_filter=unhandled'
    );
  });

  it('should show warning when project uid is missing', async () => {
    getGlobalSqlManageTaskListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            sql_fingerprint: 'select 1',
            status: GlobalSqlManageTaskItemV2StatusEnum.unhandled
          }
        ],
        total_nums: 1
      })
    );
    superRender(<SqlGovernancePanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('去优化'));

    expect(warningSpy).toHaveBeenCalledWith('缺少项目信息，无法跳转');
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should refresh sql list when clicking search icon', async () => {
    superRender(<SqlGovernancePanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    const searchInput = document.getElementById(
      'actiontech-table-search-input'
    );
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput as Element, {
      target: { value: 'fingerprint' }
    });
    fireEvent.click(document.querySelector('.custom-icon-search') as Element);
    await act(async () => jest.advanceTimersByTime(0));

    expect(getGlobalSqlManageTaskListSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalSqlManageTaskListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ keyword: 'fingerprint' })
    );
  });
});
