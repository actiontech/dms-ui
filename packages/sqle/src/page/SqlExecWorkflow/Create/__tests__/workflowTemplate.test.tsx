import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import CreateSqlExecWorkflow from '..';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { workflowTemplateListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { useSelector } from 'react-redux';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('sqle/SqlExecWorkflow/Create workflow template', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockDatabaseType();
    mockUseCurrentProject();
    mockUseCurrentUser();
    execWorkflow.mockAllApi();
    instance.getInstanceTipList();
    workflowTemplate.mockAllApi();
    (useSelector as jest.Mock).mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should load workflow templates and preselect default', async () => {
    const listSpy = workflowTemplate.getWorkflowTemplates();
    sqleSuperRender(<CreateSqlExecWorkflow />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: 'workflow'
    });
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
    expect(getBySelector('.ant-select-selection-item')).toHaveTextContent(
      workflowTemplateListData[0].workflow_template_name!
    );
  });
});
