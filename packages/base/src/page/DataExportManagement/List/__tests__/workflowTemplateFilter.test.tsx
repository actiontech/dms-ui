import { cleanup, act, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { baseSuperRender } from '../../../../testUtils/superRender';
import ExportWorkflowList from '..';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { DataExportWorkflowList } from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport/data';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('base/DataExportManagement/List workflow template filter', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUsePermission(undefined, { mockSelector: true });
    dataExport.mockAllApi();
    workflowTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should show template name column', async () => {
    baseSuperRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('审批模板')).toBeInTheDocument();
    expect(
      screen.getByText(DataExportWorkflowList[0].workflow_template_name!)
    ).toBeInTheDocument();
  });
});
