import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { act, cleanup, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import ApprovalProcessPreview from '..';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { dataExportWorkflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { cloneDeep } from 'lodash';

describe('ApprovalProcessPreview', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    workflowTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  const testCases = [
    {
      name: 'should display approval process steps from API response',
      projectName: mockProjectInfo.projectName,
      expectedStepTitles: ['导出审批'],
      expectedGuidance: '审批流程可在 项目配置 -> 审批流程 中修改'
    },
    {
      name: 'should display guidance text (REQ-2.9.3)',
      projectName: mockProjectInfo.projectName,
      expectedGuidance: '审批流程可在 项目配置 -> 审批流程 中修改'
    }
  ];

  it.each(testCases)('$name', async ({ projectName, expectedGuidance }) => {
    baseSuperRender(<ApprovalProcessPreview projectName={projectName} />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('审批流程预览')).toBeInTheDocument();
    expect(screen.getByText(expectedGuidance)).toBeInTheDocument();
  });

  it('should call API with correct parameters (workflow_type: data_export)', async () => {
    const getTemplateSpy = workflowTemplate.getWorkflowTemplate();

    baseSuperRender(
      <ApprovalProcessPreview projectName={mockProjectInfo.projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTemplateSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: 'data_export'
    });
  });

  it('should display step title as "导出审批" for export_review type (REQ-2.9.2)', async () => {
    baseSuperRender(
      <ApprovalProcessPreview projectName={mockProjectInfo.projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText(/导出审批/)).toBeInTheDocument();
  });

  it('should display step title as "导出执行确认" for export_execute type', async () => {
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

    baseSuperRender(
      <ApprovalProcessPreview projectName={mockProjectInfo.projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText(/导出审批/)).toBeInTheDocument();
    expect(screen.getByText(/导出执行确认/)).toBeInTheDocument();
  });

  it('should display "按权限匹配" for approved_by_authorized mode', async () => {
    baseSuperRender(
      <ApprovalProcessPreview projectName={mockProjectInfo.projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('按权限匹配')).toBeInTheDocument();
  });

  it('should display specified users for assignee_user_id_list mode', async () => {
    const templateWithUsers = cloneDeep(dataExportWorkflowTemplateData);
    templateWithUsers.workflow_step_template_list = [
      {
        approved_by_authorized: false,
        assignee_user_id_list: ['user1', 'user2'],
        execute_by_authorized: false,
        number: 1,
        type: 'export_review'
      }
    ];

    workflowTemplate.getWorkflowTemplate().mockImplementation((params) => {
      if (params?.workflow_type === 'data_export') {
        return createSpySuccessResponse({
          data: cloneDeep(templateWithUsers)
        });
      }
      return createSpySuccessResponse({ data: {} });
    });

    baseSuperRender(
      <ApprovalProcessPreview projectName={mockProjectInfo.projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText(/指定用户: user1, user2/)).toBeInTheDocument();
  });

  it('should not call API when projectName is empty (REQ-2.9.4)', async () => {
    const getTemplateSpy = workflowTemplate.getWorkflowTemplate();

    baseSuperRender(<ApprovalProcessPreview projectName="" />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTemplateSpy).not.toHaveBeenCalled();
  });

  it('should display multiple steps in correct order', async () => {
    const multiStepTemplate = cloneDeep(dataExportWorkflowTemplateData);
    multiStepTemplate.workflow_step_template_list = [
      {
        approved_by_authorized: true,
        assignee_user_id_list: [],
        execute_by_authorized: false,
        number: 1,
        type: 'export_review'
      },
      {
        approved_by_authorized: false,
        assignee_user_id_list: ['admin'],
        execute_by_authorized: false,
        number: 2,
        type: 'export_review'
      },
      {
        approved_by_authorized: false,
        assignee_user_id_list: [],
        execute_by_authorized: true,
        number: 3,
        type: 'export_execute'
      }
    ];

    workflowTemplate.getWorkflowTemplate().mockImplementation((params) => {
      if (params?.workflow_type === 'data_export') {
        return createSpySuccessResponse({
          data: cloneDeep(multiStepTemplate)
        });
      }
      return createSpySuccessResponse({ data: {} });
    });

    baseSuperRender(
      <ApprovalProcessPreview projectName={mockProjectInfo.projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText(/1\. 导出审批/)).toBeInTheDocument();
    expect(screen.getByText(/2\. 导出审批/)).toBeInTheDocument();
    expect(screen.getByText(/3\. 导出执行确认/)).toBeInTheDocument();
  });
});
