import { t } from '../../../locale';
import {
  PERMISSIONS,
  ActiontechTableToolbarActionWithPermissions,
  PermissionControl
} from '@actiontech/shared/lib/global';
import { MinusCircleOutlined, PlusOutlined } from '@actiontech/icons';
import { ActionButton } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const DataExportManagementTableToolbarActions = ({
  disabled,
  loading,
  batchCloseWorkflowAction
}: {
  disabled: boolean;
  loading: boolean;
  batchCloseWorkflowAction: () => void;
}): ActiontechTableToolbarActionWithPermissions => {
  return [
    {
      key: 'close',
      text: t('dmsDataExport.batchClose.button'),
      buttonProps: {
        icon: (
          <MinusCircleOutlined fill="currentColor" width={14} height={14} />
        ),
        disabled: disabled,
        loading: loading
      },
      confirm: {
        onConfirm: batchCloseWorkflowAction,
        title: t('dmsDataExport.batchClose.tips'),
        okButtonProps: {
          disabled: loading
        }
      },
      permissions: PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.BATCH_CLOSE
    }
  ];
};

export const DataExportManagementCreateAction = (
  projectID: string
): React.ReactNode => {
  return (
    <PermissionControl permission={PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.CREATE}>
      <ActionButton
        type="primary"
        actionType="navigate-link"
        text={t('dmsDataExport.create.button')}
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        link={{
          to: ROUTE_PATHS.BASE.DATA_EXPORT.create,
          params: { projectID }
        }}
      />
    </PermissionControl>
  );
};
