import { t } from '../../../locale';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/global';
import { ActionButton } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';

export const SqlManagementExceptionActions: (
  onUpdate: (record?: IBlacklistResV1) => void,
  onDelete: (id?: number) => void
) => ActiontechTableActionsWithPermissions<IBlacklistResV1> = (
  onUpdate,
  onDelete
) => {
  return {
    buttons: [
      {
        key: 'edit-button',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: () => onUpdate(record)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.EDIT
      },
      {
        key: 'delete-button',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('sqlManagementException.operate.confirmDelete'),
          onConfirm: () => onDelete(record?.blacklist_id)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.DELETE
      }
    ]
  };
};

export const SqlManagementExceptionPageHeaderActions = (
  openCreateSqlManagementExceptionModal: () => void
): Record<'create-sql-exception', React.ReactNode> => ({
  'create-sql-exception': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.CREATE}
    >
      <ActionButton
        type="primary"
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        text={t('sqlManagementException.operate.add')}
        onClick={openCreateSqlManagementExceptionModal}
      />
    </PermissionControl>
  )
});
