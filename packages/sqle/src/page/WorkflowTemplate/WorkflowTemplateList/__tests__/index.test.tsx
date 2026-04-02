import { sqleSuperRender } from '../../../../testUtils/superRender';
import WorkflowTemplateList from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import {
  workflowTemplateData,
  dataExportWorkflowTemplateData,
  workflowTemplateListData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { act, cleanup, screen } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { cloneDeep } from 'lodash';

describe('WorkflowTemplateList', () => {
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
      name: 'should display two template types in list (REQ-2.7.1)',
      assertions: (container: HTMLElement) => {
        expect(screen.getByText(workflowTemplateData.workflow_template_name)).toBeInTheDocument();
        expect(screen.getByText(dataExportWorkflowTemplateData.workflow_template_name)).toBeInTheDocument();
      }
    },
    {
      name: 'should display workflow type tag as "上线工单" with blue color (REQ-2.7.3)',
      assertions: () => {
        const workflowTag = screen.getByText('上线工单');
        expect(workflowTag).toBeInTheDocument();
        expect(workflowTag.closest('.ant-tag')).toHaveClass('ant-tag-blue');
      }
    },
    {
      name: 'should display data export type tag as "数据导出" with green color (REQ-2.7.3)',
      assertions: () => {
        const exportTag = screen.getByText('数据导出');
        expect(exportTag).toBeInTheDocument();
        expect(exportTag.closest('.ant-tag')).toHaveClass('ant-tag-green');
      }
    },
    {
      name: 'should display step count for each template (REQ-2.7.4)',
      assertions: () => {
        expect(
          screen.getByText(
            String(workflowTemplateData.workflow_step_template_list.length)
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            String(
              dataExportWorkflowTemplateData.workflow_step_template_list.length
            )
          )
        ).toBeInTheDocument();
      }
    },
    {
      name: 'should display page title "审批流程模板" (REQ-2.7.2)',
      assertions: () => {
        expect(screen.getByText('审批流程模板')).toBeInTheDocument();
      }
    }
  ];

  it.each(testCases)('$name', async ({ assertions }) => {
    const { container } = sqleSuperRender(<WorkflowTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));
    assertions(container);
  });

  it('should call getWorkflowTemplatesV1 API with project name', async () => {
    const getTemplatesSpy = workflowTemplate.getWorkflowTemplates();

    sqleSuperRender(<WorkflowTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTemplatesSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
  });

  it('should have edit links with correct workflow_type parameter (REQ-2.7.6)', async () => {
    sqleSuperRender(<WorkflowTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    const editLinks = screen.getAllByText('编辑');
    expect(editLinks.length).toBe(2);

    const workflowEditLink = editLinks[0].closest('a');
    expect(workflowEditLink).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress/update/${encodeURIComponent(workflowTemplateData.workflow_template_name)}?workflow_type=workflow`
    );

    const exportEditLink = editLinks[1].closest('a');
    expect(exportEditLink).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress/update/${encodeURIComponent(dataExportWorkflowTemplateData.workflow_template_name)}?workflow_type=data_export`
    );
  });

  it('should display step description for templates (REQ-2.7.5)', async () => {
    sqleSuperRender(<WorkflowTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    // workflow template has 3 steps: sql_review -> sql_review -> sql_execute
    // these map to "审核节点 -> 审核节点 -> 执行上线"
    expect(screen.getByText('审核节点 -> 审核节点 -> 执行上线')).toBeInTheDocument();
  });

  it('should display "-" when template has no steps', async () => {
    const emptyStepsData = cloneDeep(workflowTemplateListData);
    emptyStepsData.workflow_template_list[1].workflow_step_template_list = [];

    workflowTemplate.getWorkflowTemplates().mockImplementation(() =>
      createSpySuccessResponse({
        data: cloneDeep(emptyStepsData)
      })
    );

    sqleSuperRender(<WorkflowTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
