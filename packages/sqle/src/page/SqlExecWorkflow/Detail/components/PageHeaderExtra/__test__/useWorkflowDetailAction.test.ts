import { cleanup, act } from '@testing-library/react';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { renderHooksWithRedux } from '../../../../../../testUtils/customRender';
import useWorkflowDetailAction from '../hooks/useWorkflowDetailAction';
import { WorkflowDetailPageHeaderExtraProps } from '../index.type';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { WorkflowListData } from '../../../../../../testUtils/mockApi/execWorkflow/data';

describe('sqle/SqlExecWorkflow/Detail/useWorkflowDetailAction', () => {
  const refreshWorkflowFn = jest.fn();
  const passFn = jest.fn();
  const rejectFn = jest.fn();
  const executingFn = jest.fn();
  const completeFn = jest.fn();
  const terminateFn = jest.fn();
  const showWorkflowStepsFn = jest.fn();
  const executeInOtherInstanceFn = jest.fn();
  const startRollback = jest.fn();
  const showModifySqlStatementStep = jest.fn();

  const customRender = (
    params: Partial<
      Pick<
        WorkflowDetailPageHeaderExtraProps,
        'canRejectWorkflow' | 'workflowStepsVisibility'
      >
    > = {}
  ) => {
    return renderHooksWithRedux(() =>
      useWorkflowDetailAction({
        projectName: 'project name',
        workflowInfo: {
          ...WorkflowListData[1],
          record: {
            executable: true,
            executable_reason: '',
            status: WorkflowRecordResV2StatusEnum.wait_for_audit
          }
        },
        refreshWorkflow: refreshWorkflowFn,
        passAction: passFn,
        rejectAction: rejectFn,
        executingAction: executingFn,
        completeAction: completeFn,
        terminateAction: terminateFn,
        showWorkflowSteps: showWorkflowStepsFn,
        executeInOtherInstanceAction: executeInOtherInstanceFn,
        maintenanceTimeInfo: [
          {
            instanceName: 'instance name',
            maintenanceTime: []
          }
        ],
        canRejectWorkflow: false,
        workflowStepsVisibility: false,
        startRollback,
        showModifySqlStatementStep,
        ...params
      })
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('render closed btn', async () => {
    const { result } = customRender();
    expect(result.current.closeWorkflowButtonMeta.loading).toBeFalsy();

    await act(async () => {
      result.current.closeWorkflowButtonMeta.action();
      await act(async () => jest.advanceTimersByTime(500));
    });
  });
});
