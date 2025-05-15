/**
 * @test_version ce
 */

import { sqleSuperRender } from '../../../testUtils/superRender';
import WorkflowTemplateDetail from '.';
import { act, cleanup, screen } from '@testing-library/react';
import workflowTemplate from '../../../testUtils/mockApi/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import user from '../../../testUtils/mockApi/user';

describe('page/WorkflowTemplate CE', () => {
  beforeEach(() => {
    workflowTemplate.mockAllApi();
    user.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
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
    expect(screen.queryByText('修改当前审批流程模板')).not.toBeInTheDocument();
  });
});
