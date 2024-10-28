import { t } from '../../../locale';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';

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
