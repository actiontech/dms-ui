import WorkflowTemplate from '../';
import { superRender } from '../../../testUtils/customRender';
import { act, cleanup } from '@testing-library/react';
import workflowTemplate from '../../../testUtils/mockApi/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import user from '../../../testUtils/mockApi/user';

describe('page/WorkflowTemplate', () => {
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

  it('should match snap shots', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = superRender(<WorkflowTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInfoRequest).toBeCalled();
    expect(userInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
