import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import workflow from '../../../../../testUtils/mockApi/execWorkflow';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import InitiatedWorkOrder from '../index';
import { GlobalDashboardFilterType } from '../../../index.type';
import { getGlobalWorkflowsV1FilterStatusListEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { ListProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { paramsSerializer } from '@actiontech/shared';

describe('sqle/GlobalDashboard/InitiatedWorkOrder', () => {
  let getGlobalWorkflowsSpy: jest.SpyInstance;
  const updateFilterValueFn = jest.fn();

  const commonParams = {
    page_index: 1,
    page_size: 20,
    filter_create_user_id: mockCurrentUserReturn.userId,
    filter_status_list: [
      getGlobalWorkflowsV1FilterStatusListEnum.wait_for_audit,
      getGlobalWorkflowsV1FilterStatusListEnum.wait_for_execution,
      getGlobalWorkflowsV1FilterStatusListEnum.rejected,
      getGlobalWorkflowsV1FilterStatusListEnum.exec_failed
    ]
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    getGlobalWorkflowsSpy = workflow.getGlobalWorkflows();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (filterValues: GlobalDashboardFilterType = {}) => {
    return sqleSuperRender(
      <InitiatedWorkOrder
        filterValues={filterValues}
        updateFilterValue={updateFilterValueFn}
      />
    );
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledWith(commonParams, {
      paramsSerializer
    });
  });

  it('render request data with filter value', async () => {
    customRender({
      projectId: '1',
      instanceId: '2',
      projectPriority: ListProjectV2ProjectPriorityEnum.low
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledWith(
      {
        ...commonParams,
        filter_instance_id: '2',
        filter_project_priority: 'low',
        filter_project_uid: '1'
      },
      {
        paramsSerializer
      }
    );
  });

  it('render update filter value', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByText('default')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateFilterValueFn).toHaveBeenCalledTimes(2);
    expect(updateFilterValueFn).toHaveBeenCalledWith('projectId', '700300');
    expect(updateFilterValueFn).toHaveBeenCalledWith('instanceId', undefined);
  });

  it('render update filter value when click instance name', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);

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
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      eventEmitter.emit(
        EmitterKey.Refresh_Global_Dashboard_Initiated_Work_Order
      );
      jest.advanceTimersByTime(0);
    });
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(2);
  });
});
