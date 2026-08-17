import { sqleSuperRender } from '../../../testUtils/superRender';
import WorkflowTemplateDetail from '.';
import { workflowTemplateListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('page/WorkflowTemplate/WorkflowTemplateDetail', () => {
  beforeEach(() => {
    workflowTemplate.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    mockUsePermission(
      {
        checkActionPermission: jest.fn(() => true)
      },
      {
        mockSelector: true
      }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return sqleSuperRender(<WorkflowTemplateDetail />);
  };

  it('should render workflow and data_export template lists', async () => {
    const getListSpy = workflowTemplate.getWorkflowTemplates();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getListSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: getWorkflowTemplateListV1WorkflowTypeEnum.workflow
    });
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
    expect(screen.getByText('SQL上线审批')).toBeInTheDocument();
    expect(screen.getByText('数据导出审批')).toBeInTheDocument();
    expect(
      screen.getByText(workflowTemplateListData[0].workflow_template_name!)
    ).toBeInTheDocument();
    expect(screen.getByText('创建审批流程模板')).toBeInTheDocument();

    fireEvent.click(screen.getByText('数据导出审批'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getListSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: getWorkflowTemplateListV1WorkflowTypeEnum.data_export
    });
  });

  it('should support set default and delete for non-default template', async () => {
    const updateSpy = workflowTemplate.updateWorkflowTemplateById();
    const deleteSpy = workflowTemplate.deleteWorkflowTemplate();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getAllByText('设为默认').length).toBeGreaterThan(0);
    expect(screen.getAllByText('删 除').length).toBeGreaterThan(0);

    const setDefaultBtn = screen
      .getAllByText('设为默认')
      .map((node) => node.closest('button'))
      .find((btn) => btn && !(btn as HTMLButtonElement).disabled);
    expect(setDefaultBtn).toBeTruthy();
    fireEvent.click(setDefaultBtn!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_template_id: workflowTemplateListData[1].workflow_template_id,
      is_default: true
    });

    const deleteBtn = screen
      .getAllByText('删 除')
      .map((node) => node.closest('button'))
      .find((btn) => btn && !(btn as HTMLButtonElement).disabled);
    expect(deleteBtn).toBeTruthy();
    fireEvent.click(deleteBtn!);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(deleteSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_template_id: workflowTemplateListData[1].workflow_template_id
    });
  });
});
