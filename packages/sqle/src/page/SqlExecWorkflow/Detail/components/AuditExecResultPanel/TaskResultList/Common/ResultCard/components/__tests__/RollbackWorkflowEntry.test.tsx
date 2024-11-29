import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import RollbackWorkflowEntry from '../RollbackWorkflowEntry';
import { superRender } from '../../../../../../../../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('sqle/ExecWorkflow/AuditDetail/RollbackWorkflowEntry', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when value is empty', async () => {
    const { baseElement } = superRender(
      <RollbackWorkflowEntry workflows={[]} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render drop down menu', async () => {
    const { baseElement } = superRender(
      <RollbackWorkflowEntry
        workflows={[
          {
            workflow_id: '1',
            workflow_name: 'test'
          }
        ]}
      />
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关联回滚工单'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('test')).toBeVisible();
  });
});
