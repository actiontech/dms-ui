/**
 * @test_version ce
 */
import { cleanup, act } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import workflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import sqlManage from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage';
import { sqleSuperRender } from '../../../testUtils/superRender';
import GlobalDashboard from '../index';

describe('sqle/GlobalDashboard ce', () => {
  let getGlobalWorkflowsSpy: jest.SpyInstance;
  let getGlobalSqlManageStatisticsSpy: jest.SpyInstance;
  let getGlobalWorkflowStatisticsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getGlobalWorkflowsSpy = workflow.getGlobalWorkflows();
    getGlobalWorkflowStatisticsSpy = workflow.getGlobalWorkflowStatistics();
    getGlobalSqlManageStatisticsSpy = sqlManage.getGlobalSqlManageStatistics();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<GlobalDashboard />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalSqlManageStatisticsSpy).not.toHaveBeenCalled();
    expect(getGlobalWorkflowStatisticsSpy).toHaveBeenCalledTimes(2);
  });
});
