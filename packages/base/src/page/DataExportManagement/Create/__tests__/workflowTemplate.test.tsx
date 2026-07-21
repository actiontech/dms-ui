import { cleanup, act, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { baseSuperRender } from '../../../../testUtils/superRender';
import CreateDataExport from '..';
import { mockUseCreateDataExportReduxManage } from '../testUtils/mockUseCreateDataExportReduxManage';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { dataExportWorkflowTemplateListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { useDispatch, useSelector } from 'react-redux';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from 'sqle/src/data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('base/DataExportManagement/Create workflow template', () => {
  const dispatchSpy = jest.fn();
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCreateDataExportReduxManage();
    workflowTemplate.mockAllApi();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it('should load data_export templates and preselect default', async () => {
    const listSpy = workflowTemplate.getWorkflowTemplates();
    baseSuperRender(<CreateDataExport />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: 'data_export'
    });
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
    expect(getBySelector('.ant-select-selection-item')).toHaveTextContent(
      dataExportWorkflowTemplateListData[0].workflow_template_name!
    );
  });
});
