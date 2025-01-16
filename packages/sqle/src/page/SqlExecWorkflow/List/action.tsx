import { ActionButton } from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl,
  ActiontechTableToolbarActionWithPermissions
} from '@actiontech/shared/lib/features';
import { ReactNode } from 'react';
import { t } from '../../../locale';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import {
  DownArrowLineOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@actiontech/icons';

export const SqlExecWorkflowExportAction = (
  exportWorkflow: () => void,
  exportWorkflowDisabled: boolean
): ReactNode => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXPORT}
    >
      <ActionButton
        text={t('execWorkflow.list.exportWorkflow.buttonText')}
        icon={<DownArrowLineOutlined />}
        onClick={exportWorkflow}
        disabled={exportWorkflowDisabled}
      />
    </PermissionControl>
  );
};

export const SqlExecWorkflowCreateAction = (projectID: string): ReactNode => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE}
    >
      <ActionButton
        type="primary"
        actionType="navigate-link"
        text={t('execWorkflow.list.createButtonText')}
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        link={{
          to: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create,
          params: { projectID }
        }}
      />
    </PermissionControl>
  );
};

export const SqlExecWorkflowTableToolbarActions = ({
  disabled,
  loading,
  batchCloseAction
}: {
  disabled: boolean;
  loading: boolean;
  batchCloseAction: () => void;
}): ActiontechTableToolbarActionWithPermissions => {
  return [
    {
      key: 'close',
      text: t('execWorkflow.list.batchClose.buttonText'),
      buttonProps: {
        icon: <MinusCircleOutlined fill="currentColor" />,
        disabled,
        loading
      },
      confirm: {
        onConfirm: batchCloseAction,
        title: t('execWorkflow.list.batchClose.closePopTitle'),
        okButtonProps: {
          disabled: loading
        }
      },
      permissions: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_CLOSE
    }
  ];
};
