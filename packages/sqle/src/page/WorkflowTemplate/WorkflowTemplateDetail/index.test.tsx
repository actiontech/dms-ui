import { sqleSuperRender } from '../../../testUtils/superRender';
import WorkflowTemplateDetail from '.';
import { act, cleanup, screen } from '@testing-library/react';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

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

  it('render workflow template list', async () => {
    const getListRequest = workflowTemplate.getWorkflowTemplateList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getListRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
  });

  it('render workflow type tags correctly', async () => {
    workflowTemplate.getWorkflowTemplateList();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('上线工单')).toBeInTheDocument();
    expect(screen.getByText('数据导出')).toBeInTheDocument();
  });

  it('render approval node description', async () => {
    workflowTemplate.getWorkflowTemplateList();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('审核节点 -> 审核节点 -> 执行上线')
    ).toBeInTheDocument();
    expect(screen.getByText('导出审批')).toBeInTheDocument();
  });
});
