/**
 * @test_version ce
 */
import WorkflowDetailPageHeaderExtra from '..';
import { cleanup, screen } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import MockDate from 'mockdate';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('sqle/SqlExecWorkflow/Detail/WorkflowDetailPageHeaderExtra ce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2024-01-30 10:00:00');
    mockUseCurrentUser();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    MockDate.reset();
  });

  it('render rollback button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const { baseElement } = sqleSuperRender(
      <WorkflowDetailPageHeaderExtra
        refreshWorkflow={jest.fn(() => Promise.resolve())}
        passAction={jest.fn(() => Promise.resolve())}
        rejectAction={jest.fn(() => Promise.resolve())}
        executingAction={jest.fn(() => Promise.resolve())}
        completeAction={jest.fn(() => Promise.resolve())}
        terminateAction={jest.fn(() => Promise.resolve())}
        executeInOtherInstanceAction={jest.fn(() => Promise.resolve())}
        showWorkflowSteps={jest.fn()}
        startRollback={jest.fn()}
        showModifySqlStatementStep={jest.fn()}
        workflowStepsVisibility
        workflowInfo={{
          record: {
            status: WorkflowRecordResV2StatusEnum.finished,
            workflow_step_list: [
              {
                number: 1,
                type: WorkflowStepResV2TypeEnum.sql_execute,
                assignee_user_name_list: ['admin']
              }
            ]
          }
        }}
      />
    );
    expect(screen.queryByText('回 滚')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
