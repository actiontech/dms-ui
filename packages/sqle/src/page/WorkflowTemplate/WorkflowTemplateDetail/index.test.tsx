import { sqleSuperRender } from '../../../testUtils/superRender';
import WorkflowTemplateDetail from '.';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { act, cleanup, screen } from '@testing-library/react';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  mockProjectInfo,
  mockCurrentUserReturn
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('page/WorkflowTemplate/WorkflowTemplateDetail', () => {
  beforeEach(() => {
    workflowTemplate.mockAllApi();
    user.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return sqleSuperRender(<WorkflowTemplateDetail />);
  };

  it('render workflow template detail', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toHaveBeenCalled();
    expect(userInfoRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
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
    // not admin or global manager or project manager
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      }
    });
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toHaveBeenCalled();
    expect(userInfoRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('修改当前审批流程模板')).not.toBeInTheDocument();

    // project manager
    cleanup();
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: false
        }
      ]
    });
    customRender();
    expect(screen.getByText('修改当前审批流程模板')).toBeInTheDocument();

    // project is archived
    cleanup();
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: true
        }
      ]
    });
    customRender();
    expect(screen.queryByText('修改当前审批流程模板')).not.toBeInTheDocument();
  });

  it('render workflow template detail with not projectArchive', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toHaveBeenCalled();
    expect(userInfoRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
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
    expect(getInfoRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
    expect(screen.getByText('执行上线')).toBeInTheDocument();
  });
});
