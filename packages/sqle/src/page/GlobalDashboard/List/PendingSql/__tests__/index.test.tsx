import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import PendingSqlList from '../index';
import { GlobalDashboardFilterType } from '../../../index.type';
import { ListProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import sqlManage from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil';

describe('sqle/GlobalDashboard/PendingSqlList', () => {
  let getGlobalSqlManageList: jest.SpyInstance;
  const updateFilterValueFn = jest.fn();

  const commonParams = {
    page_index: 1,
    page_size: 20
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    getGlobalSqlManageList = sqlManage.getGlobalSqlManageList();
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(true),
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (filterValues: GlobalDashboardFilterType = {}) => {
    return sqleSuperRender(
      <PendingSqlList
        filterValues={filterValues}
        updateFilterValue={updateFilterValueFn}
      />
    );
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(1);
    expect(getGlobalSqlManageList).toHaveBeenCalledWith(commonParams);
    expect(screen.queryAllByText('详 情')[0]).toBeInTheDocument();
  });

  it('render request data with filter value', async () => {
    customRender({
      projectId: '1',
      instanceId: '2',
      projectPriority: ListProjectV2ProjectPriorityEnum.low
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(1);
    expect(getGlobalSqlManageList).toHaveBeenCalledWith({
      ...commonParams,
      filter_instance_id: '2',
      filter_project_priority: 'low',
      filter_project_uid: '1'
    });
  });

  it('render update filter value when click project name', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByText('default')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateFilterValueFn).toHaveBeenCalledTimes(2);
    expect(updateFilterValueFn).toHaveBeenNthCalledWith(
      1,
      'projectId',
      '700300'
    );
    expect(updateFilterValueFn).toHaveBeenNthCalledWith(
      2,
      'instanceId',
      undefined
    );
  });

  it('render update filter value when click instance name', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByText('mysql-1')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateFilterValueFn).toHaveBeenCalledTimes(2);
    expect(updateFilterValueFn).toHaveBeenNthCalledWith(
      1,
      'projectId',
      '700300'
    );

    expect(updateFilterValueFn).toHaveBeenNthCalledWith(
      2,
      'instanceId',
      '1739531854064652288'
    );
  });

  it('render refresh list', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(1);

    await act(async () => {
      eventEmitter.emit(EmitterKey.Refresh_Global_Dashboard_Pending_Sql);
      jest.advanceTimersByTime(0);
    });
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(2);
  });

  it('render not show detail button when not have permission', async () => {
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(false),
        checkPagePermission: jest.fn().mockReturnValue(false)
      },
      { useSpyOnMockHooks: true }
    );

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('详 情')).not.toBeInTheDocument();
  });
});
