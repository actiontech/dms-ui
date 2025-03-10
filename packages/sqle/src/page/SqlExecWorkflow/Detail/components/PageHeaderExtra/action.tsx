import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { WorkflowDetailActionMeta } from './index.type';
import { ActionButton } from '@actiontech/shared';
import { t } from '../../../../../locale';

export const CloseWorkflowAction = (
  closeWorkflowButtonMeta: WorkflowDetailActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLOSE}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.closeWorkflow')}
        disabled={closeWorkflowButtonMeta.loading}
        loading={closeWorkflowButtonMeta.loading}
        danger
        actionType="confirm"
        confirm={{
          title: t('execWorkflow.detail.operator.closeConfirm'),
          onConfirm: () => closeWorkflowButtonMeta.action(),
          disabled: closeWorkflowButtonMeta.loading,
          overlayClassName: 'popconfirm-small'
        }}
      />
    </PermissionControl>
  );
};

export const CloneWorkflowAction = (
  executeInOtherInstanceMeta: WorkflowDetailActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLONE}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.cloneExecWorkflow')}
        onClick={() => executeInOtherInstanceMeta.action()}
        loading={executeInOtherInstanceMeta.loading}
      />
    </PermissionControl>
  );
};

export const BatchRejectWorkflowAction = (
  rejectWorkflowButtonMeta: WorkflowDetailActionMeta,
  openRejectModal: () => void
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_REJECT}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.rejectFull')}
        onClick={openRejectModal}
        hidden={rejectWorkflowButtonMeta.hidden}
      />
    </PermissionControl>
  );
};

export const ApproveWorkflowAction = (
  approveWorkflowButtonMeta: WorkflowDetailActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.APPROVE}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.sqlReview')}
        hidden={approveWorkflowButtonMeta.hidden}
        disabled={approveWorkflowButtonMeta.loading}
        loading={approveWorkflowButtonMeta.loading}
        onClick={() => approveWorkflowButtonMeta.action()}
        type="primary"
      />
    </PermissionControl>
  );
};

export const BatchExecWorkflowAction = (
  batchExecutingWorkflowButtonMeta: WorkflowDetailActionMeta,
  executable?: boolean,
  executableReason?: string
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_EXEC}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.batchSqlExecute')}
        hidden={batchExecutingWorkflowButtonMeta.hidden}
        disabled={batchExecutingWorkflowButtonMeta.loading || !executable}
        loading={batchExecutingWorkflowButtonMeta.loading}
        type="primary"
        actionType={executable ? 'confirm' : 'tooltip'}
        confirm={{
          title: t('execWorkflow.detail.operator.batchSqlExecuteConfirmTips'),
          onConfirm: () => batchExecutingWorkflowButtonMeta.action(),
          disabled: batchExecutingWorkflowButtonMeta.loading,
          overlayClassName: 'popconfirm-small'
        }}
        tooltip={{
          title: executableReason
        }}
      />
    </PermissionControl>
  );
};

export const MarkManuallyExecWorkflowAction = (
  manualExecuteWorkflowButtonMeta: WorkflowDetailActionMeta,
  executable?: boolean,
  executableReason?: string
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.MANUALLY_EXEC}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.markManually')}
        hidden={manualExecuteWorkflowButtonMeta.hidden}
        disabled={manualExecuteWorkflowButtonMeta.loading || !executable}
        loading={manualExecuteWorkflowButtonMeta.loading}
        type="primary"
        actionType={executable ? 'confirm' : 'tooltip'}
        confirm={{
          title: t('execWorkflow.detail.operator.markManuallyConfirmTips'),
          onConfirm: () => manualExecuteWorkflowButtonMeta.action(),
          disabled: manualExecuteWorkflowButtonMeta.loading,
          overlayClassName: 'popconfirm-small'
        }}
        tooltip={{
          title: executableReason
        }}
      />
    </PermissionControl>
  );
};

export const TerminateWorkflowAction = (
  terminateWorkflowButtonMeta: WorkflowDetailActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.terminate')}
        disabled={terminateWorkflowButtonMeta.loading}
        loading={terminateWorkflowButtonMeta.loading}
        danger
        actionType="confirm"
        confirm={{
          title: t('execWorkflow.detail.operator.terminateConfirmTips'),
          onConfirm: () => terminateWorkflowButtonMeta.action(),
          disabled: terminateWorkflowButtonMeta.loading,
          overlayClassName: 'popconfirm-small'
        }}
      />
    </PermissionControl>
  );
};

export const RefreshWorkflowAction = (refreshWorkflow: () => void) => {
  return (
    <ActionButton
      onClick={refreshWorkflow}
      text={t('execWorkflow.detail.operator.refreshWorkflow')}
    />
  );
};

export const RollbackWorkflowAction = (
  rollbackWorkflowButtonMeta: WorkflowDetailActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.ROLLBACK}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.rollback')}
        hidden={rollbackWorkflowButtonMeta.hidden}
        onClick={() => rollbackWorkflowButtonMeta.action()}
        loading={rollbackWorkflowButtonMeta.loading}
      />
    </PermissionControl>
  );
};

export const RetryWorkflowAction = (
  retryWorkflowButtonMeta: WorkflowDetailActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.RETRY}
    >
      <ActionButton
        text={t('execWorkflow.detail.operator.retry')}
        hidden={retryWorkflowButtonMeta.hidden}
        onClick={() => retryWorkflowButtonMeta.action()}
        loading={retryWorkflowButtonMeta.loading}
      />
    </PermissionControl>
  );
};
