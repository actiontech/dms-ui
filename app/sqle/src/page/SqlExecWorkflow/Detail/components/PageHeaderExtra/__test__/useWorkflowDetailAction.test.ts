import { cleanup, act } from '@testing-library/react';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleSuperRenderHook } from '../../../../../../testUtils/superRender';
import useWorkflowDetailAction from '../hooks/useWorkflowDetailAction';
import { WorkflowDetailPageHeaderExtraProps } from '../index.type';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { WorkflowListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/dms-kit';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { PERMISSIONS } from '@actiontech/shared/lib/features';

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

  let checkActionDisabledByBWPMock: jest.Mock;
  let usePermissionSpy: jest.SpyInstance | undefined;
  let cancelWorkflowSpy: jest.SpyInstance;

  const customRender = (
    params: Partial<
      Pick<
        WorkflowDetailPageHeaderExtraProps,
        'canRejectWorkflow' | 'workflowStepsVisibility'
      >
    > = {}
  ) => {
    return sqleSuperRenderHook(() =>
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
    checkActionDisabledByBWPMock = jest.fn().mockReturnValue(false);
    usePermissionSpy = mockUsePermission(
      {
        checkActionDisabledByBWP: checkActionDisabledByBWPMock
      },
      { useSpyOnMockHooks: true }
    );
    mockUseCurrentUser();
    mockUseCurrentProject();
    cancelWorkflowSpy = jest
      .spyOn(workflow, 'cancelWorkflowV2')
      .mockResolvedValue({
        data: { code: ResponseCode.SUCCESS }
      } as never);
  });

  afterEach(() => {
    usePermissionSpy?.mockRestore();
    usePermissionSpy = undefined;
    cancelWorkflowSpy?.mockRestore();
    jest.useRealTimers();
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

  describe('checkActionDisabledByBWP (SQL exec workflow)', () => {
    it('should set auditPassWorkflowButtonMeta.disabled when BWP blocks APPROVE', () => {
      checkActionDisabledByBWPMock.mockImplementation(
        (permission: string) =>
          permission === PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.APPROVE
      );
      const { result } = customRender();
      expect(result.current.auditPassWorkflowButtonMeta.disabled).toBe(true);
      expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(false);
      expect(result.current.batchExecutingWorkflowButtonMeta.disabled).toBe(
        false
      );
      expect(result.current.manualExecuteWorkflowButtonMeta.disabled).toBe(
        false
      );
    });

    it('should set rejectWorkflowButtonMeta.disabled when BWP blocks BATCH_REJECT', () => {
      checkActionDisabledByBWPMock.mockImplementation(
        (permission: string) =>
          permission === PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_REJECT
      );
      const { result } = customRender();
      expect(result.current.auditPassWorkflowButtonMeta.disabled).toBe(false);
      expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(true);
      expect(result.current.batchExecutingWorkflowButtonMeta.disabled).toBe(
        false
      );
      expect(result.current.manualExecuteWorkflowButtonMeta.disabled).toBe(
        false
      );
    });

    it('should set batchExecutingWorkflowButtonMeta.disabled when BWP blocks BATCH_EXEC', () => {
      checkActionDisabledByBWPMock.mockImplementation(
        (permission: string) =>
          permission === PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_EXEC
      );
      const { result } = customRender();
      expect(result.current.batchExecutingWorkflowButtonMeta.disabled).toBe(
        true
      );
      expect(result.current.manualExecuteWorkflowButtonMeta.disabled).toBe(
        false
      );
    });

    it('should set manualExecuteWorkflowButtonMeta.disabled when BWP blocks MANUALLY_EXEC', () => {
      checkActionDisabledByBWPMock.mockImplementation(
        (permission: string) =>
          permission ===
          PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.MANUALLY_EXEC
      );
      const { result } = customRender();
      expect(result.current.batchExecutingWorkflowButtonMeta.disabled).toBe(
        false
      );
      expect(result.current.manualExecuteWorkflowButtonMeta.disabled).toBe(
        true
      );
    });

    it('should set all BWP-driven action metas disabled when checkActionDisabledByBWP always returns true', () => {
      checkActionDisabledByBWPMock.mockReturnValue(true);
      const { result } = customRender();
      expect(result.current.auditPassWorkflowButtonMeta.disabled).toBe(true);
      expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(true);
      expect(result.current.batchExecutingWorkflowButtonMeta.disabled).toBe(
        true
      );
      expect(result.current.manualExecuteWorkflowButtonMeta.disabled).toBe(
        true
      );
    });
  });
});
