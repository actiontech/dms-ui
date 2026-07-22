import { sqleSuperRender } from '../../../testUtils/superRender';
import UpdateWorkflowTemplate from '.';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { act, fireEvent, screen, cleanup } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useParams } from 'react-router-dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import { CreateWorkflowTemplateReqV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe('page/WorkflowTemplate/UpdateWorkflowTemplate', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNCONNECTED_FORM_COMPONENT
  ]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const customRender = () => {
    return sqleSuperRender(<UpdateWorkflowTemplate />);
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    workflowTemplate.mockAllApi();
    user.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it('render update workflow template and submit success', async () => {
    useParamsMock.mockReturnValue({
      workflowTemplateId: String(workflowTemplateData.workflow_template_id)
    });
    const getInfoRequest = workflowTemplate.getWorkflowTemplateById();
    const updateInfoRequest = workflowTemplate.updateWorkflowTemplateById();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_template_id: workflowTemplateData.workflow_template_id
    });
    expect(screen.getByText('返回审批流程模板')).toBeInTheDocument();
    expect(getBySelector('a')).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress`
    );

    await act(async () => {
      fireEvent.click(screen.getByText('保 存'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateInfoRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        project_name: mockProjectInfo.projectName,
        workflow_template_id: workflowTemplateData.workflow_template_id,
        workflow_template_name: workflowTemplateData.workflow_template_name,
        allow_submit_when_less_audit_level:
          UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('更新审批流程模板成功')).toBeInTheDocument();
  });

  it('render create workflow template page', async () => {
    useParamsMock.mockReturnValue({
      workflowType: CreateWorkflowTemplateReqV1WorkflowTypeEnum.workflow
    });
    const createSpy = workflowTemplate.createWorkflowTemplate();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('审批流程模板名称')).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });
});
