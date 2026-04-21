/**
 * @test_version ce
 */

import { sqleSuperRender } from '../../../testUtils/superRender';
import WorkflowTemplateDetail from '.';
import { act, cleanup, screen } from '@testing-library/react';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('page/WorkflowTemplate CE', () => {
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
    return sqleSuperRender(<WorkflowTemplateDetail />);
  };

  it('render workflow template list without edit actions in CE', async () => {
    const getListRequest = workflowTemplate.getWorkflowTemplateList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getListRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
  });
});
