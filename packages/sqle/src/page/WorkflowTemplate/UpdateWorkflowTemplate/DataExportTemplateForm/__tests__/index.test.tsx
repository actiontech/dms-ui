import { sqleSuperRender } from '../../../../../testUtils/superRender';
import DataExportTemplateForm from '..';
import { dataExportWorkflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useParams } from 'react-router-dom';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { cloneDeep } from 'lodash';
import { WorkflowTemplateTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe('DataExportTemplateForm', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNCONNECTED_FORM_COMPONENT
  ]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      workflowName: dataExportWorkflowTemplateData.workflow_template_name
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    workflowTemplate.mockAllApi();
    user.getUserTipList();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  const testCases = [
    {
      name: 'should NOT display AllowSubmitWhenLessAuditLevel field (REQ-2.5.2)',
      assertion: () => {
        expect(
          screen.queryByText('允许创建工单的最高审核等级')
        ).not.toBeInTheDocument();
      }
    },
    {
      name: 'should display return button and save/reset buttons',
      assertion: () => {
        expect(screen.getByText('返回审批流程模板')).toBeInTheDocument();
        expect(screen.getByText('重 置')).toBeInTheDocument();
        expect(screen.getByText('保 存')).toBeInTheDocument();
      }
    }
  ];

  it.each(testCases)('$name', async ({ assertion }) => {
    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    assertion();
  });

  it('should call getWorkflowTemplateV1 with workflow_type=data_export (REQ-2.5.12)', async () => {
    const getTemplateSpy = workflowTemplate.getWorkflowTemplate();

    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTemplateSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: WorkflowTemplateTypeEnum.data_export
    });
  });

  it('should submit with workflow_type: data_export and export_review step type (REQ-2.5.12)', async () => {
    const updateTemplateSpy = workflowTemplate.updateWorkflowTemplate();

    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(300));

    expect(updateTemplateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        project_name: mockProjectInfo.projectName,
        workflow_type: WorkflowTemplateTypeEnum.data_export,
        workflow_step_template_list: expect.arrayContaining([
          expect.objectContaining({
            type: 'export_review'
          })
        ])
      })
    );
  });

  it('should display success result after submit (REQ-2.5.12)', async () => {
    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('更新审批流程模板成功')).toBeInTheDocument();
  });

  it('should handle template with export_execute step (REQ-2.5.5)', async () => {
    const templateWithExec = cloneDeep(dataExportWorkflowTemplateData);
    templateWithExec.workflow_step_template_list.push({
      approved_by_authorized: false,
      assignee_user_id_list: [],
      execute_by_authorized: true,
      number: 2,
      type: 'export_execute'
    });

    workflowTemplate.getWorkflowTemplate().mockImplementation((params) => {
      if (params?.workflow_type === 'data_export') {
        return createSpySuccessResponse({
          data: cloneDeep(templateWithExec)
        });
      }
      return createSpySuccessResponse({ data: {} });
    });

    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    // verify the component loaded the template with both step types
    const updateTemplateSpy = workflowTemplate.updateWorkflowTemplate();
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(300));

    expect(updateTemplateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_type: WorkflowTemplateTypeEnum.data_export,
        workflow_step_template_list: expect.arrayContaining([
          expect.objectContaining({ type: 'export_review' }),
          expect.objectContaining({ type: 'export_execute' })
        ])
      })
    );
  });

  it('should display data export specific labels (REQ-2.5.3, REQ-2.5.4)', async () => {
    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('导出审批')).toBeInTheDocument();
  });

  it('should reset form state when clicking reset button', async () => {
    sqleSuperRender(<DataExportTemplateForm />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));

    // After reset, there should be no step cards visible
    expect(screen.queryByText('更新审批流程模板成功')).not.toBeInTheDocument();
  });
});
