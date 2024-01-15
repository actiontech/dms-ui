import { superRender } from '../../../testUtils/customRender';
import WorkflowTemplateDetail from '.';
import { workflowTemplateData } from '../../../testUtils/mockApi/workflowTemplate/data';
import { act, cleanup, screen } from '@testing-library/react';
import workflowTemplate from '../../../testUtils/mockApi/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import user from '../../../testUtils/mockApi/user';

describe('page/WorkflowTemplate/WorkflowTemplateDetail', () => {
  beforeEach(() => {
    workflowTemplate.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return superRender(<WorkflowTemplateDetail />);
  };

  it('render workflow template detail', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTip();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toBeCalled();
    expect(userInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模版')).toBeInTheDocument();
    expect(getBySelector('a')).toBeInTheDocument();
    expect(getBySelector('a')).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress/update/${workflowTemplateData.workflow_template_name}`
    );

    expect(screen.getByText('工单发起/工单更新SQL语句')).toBeInTheDocument();
    expect(screen.getAllByText('审核节点')?.[0]).toBeInTheDocument();
    expect(screen.getByText('执行上线')).toBeInTheDocument();

    expect(screen.getByText('告警(Warning)')).toBeInTheDocument();
    expect(screen.getByText('2023-12-26 14:19:12')).toBeInTheDocument();
  });

  it('render workflow template detail without permission', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTip();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toBeCalled();
    expect(userInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模版')).toBeInTheDocument();
  });

  it('render workflow template detail with not projectArchive', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTip();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toBeCalled();
    expect(userInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模版')).toBeInTheDocument();
  });

  it('render workflow template detail with no review step', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    getInfoRequest.mockImplementation(() => {
      const execStepData =
        workflowTemplateData.workflow_step_template_list.pop();
      return createSpySuccessResponse({
        data: {
          ...workflowTemplateData,
          workflow_step_template_list: [execStepData]
        }
      });
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模版')).toBeInTheDocument();
    expect(screen.getByText('执行上线')).toBeInTheDocument();
  });
});
