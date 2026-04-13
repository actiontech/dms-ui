import { workflowPanelTableActions } from '../action';
import { GetGlobalWorkflowListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';

describe('GlobalDashboard/WorkflowPanel/action', () => {
  const record = { workflow_id: 'workflow-id' };

  it('should call open callback for go_handle action', () => {
    const onOpenWorkflow = jest.fn();
    const actions = workflowPanelTableActions(
      GetGlobalWorkflowListV2FilterCardEnum.pending_for_me,
      onOpenWorkflow
    );
    const event = { stopPropagation: jest.fn() };
    const goHandleBtn = actions.buttons?.[0];

    goHandleBtn?.buttonProps?.(record as any).onClick?.(event as any);

    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(onOpenWorkflow).toHaveBeenCalledWith(record);
    expect(goHandleBtn?.permissions?.(record as any)).toBe(true);
  });

  it('should call open callback for detail action', () => {
    const onOpenWorkflow = jest.fn();
    const actions = workflowPanelTableActions(
      GetGlobalWorkflowListV2FilterCardEnum.archived,
      onOpenWorkflow
    );
    const event = { stopPropagation: jest.fn() };
    const detailBtn = actions.buttons?.[1];

    detailBtn?.buttonProps?.(record as any).onClick?.(event as any);

    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(onOpenWorkflow).toHaveBeenCalledWith(record);
    expect(detailBtn?.permissions?.(record as any)).toBe(true);
  });

  it('should not call callback when record is undefined', () => {
    const onOpenWorkflow = jest.fn();
    const actions = workflowPanelTableActions(
      GetGlobalWorkflowListV2FilterCardEnum.pending_for_me,
      onOpenWorkflow
    );
    const event = { stopPropagation: jest.fn() };

    actions.buttons?.[0]
      .buttonProps?.(undefined as any)
      .onClick?.(event as any);
    actions.buttons?.[1]
      .buttonProps?.(undefined as any)
      .onClick?.(event as any);

    expect(event.stopPropagation).toHaveBeenCalledTimes(2);
    expect(onOpenWorkflow).not.toHaveBeenCalled();
  });

  it('should return false permissions for unmatched cards', () => {
    const onOpenWorkflow = jest.fn();
    const pendingActions = workflowPanelTableActions(
      GetGlobalWorkflowListV2FilterCardEnum.pending_for_me,
      onOpenWorkflow
    );
    const initiatedActions = workflowPanelTableActions(
      GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me,
      onOpenWorkflow
    );

    expect(pendingActions.buttons?.[1].permissions?.({} as any)).toBe(false);
    expect(initiatedActions.buttons?.[0].permissions?.({} as any)).toBe(false);
  });
});
