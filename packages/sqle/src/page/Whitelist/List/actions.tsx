import { t } from '../../../locale';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/global';
import { ActionButton } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';

export const WhitelistTableActions: (
  onUpdate: (record: IAuditWhitelistResV1) => void,
  onDelete: (whitelistId: number) => void
) => ActiontechTableActionsWithPermissions<IAuditWhitelistResV1> = (
  onUpdate,
  onDelete
) => {
  return {
    buttons: [
      {
        key: 'edit-whitelist',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: () => onUpdate(record ?? {})
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.EDIT
      },
      {
        key: 'remove-whitelist',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('whitelist.operate.confirmDelete'),
          onConfirm: () => onDelete(record?.audit_whitelist_id ?? 0)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.DELETE
      }
    ]
  };
};

export const WhitelistPageHeaderActions = (
  openCreateWhitelistModal: () => void
): Record<'create-whitelist', React.ReactNode> => ({
  'create-whitelist': (
    <PermissionControl permission={PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.CREATE}>
      <ActionButton
        type="primary"
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        text={t('whitelist.operate.addWhitelist')}
        onClick={openCreateWhitelistModal}
      />
    </PermissionControl>
  )
});
