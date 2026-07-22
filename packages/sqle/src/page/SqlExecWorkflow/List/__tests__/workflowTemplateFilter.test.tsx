import { cleanup, act, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import SqlExecWorkflowList from '..';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { WorkflowListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import sqlVersion from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version';
import { useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('sqle/SqlExecWorkflow/List workflow template filter', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
    jest.useFakeTimers();
    mockDatabaseType();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });
    user.getUserTipList();
    instance.getInstanceTipList();
    execWorkflow.getWorkflows();
    sqlVersion.mockGetSqlVersionListV1();
    workflowTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should show template name column', async () => {
    sqleSuperRender(<SqlExecWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('审批模板')).toBeInTheDocument();
    expect(
      screen.getByText(WorkflowListData[0].workflow_template_name!)
    ).toBeInTheDocument();
  });
});
