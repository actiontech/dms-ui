import { ReactNode } from 'react';
import { t } from '../../../locale';
import { IAccessWhitelistRuleItem } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ActionButton } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';

export const AccessSettingTableActions: (
  onEdit: (record: IAccessWhitelistRuleItem) => void,
  onDelete: (uid: string) => void
) => ActiontechTableActionsWithPermissions<IAccessWhitelistRuleItem> = (
  onEdit,
  onDelete
) => ({
  buttons: [
    {
      key: 'edit-access-rule',
      text: t('common.edit'),
      buttonProps: (record) => ({
        onClick: () => onEdit(record ?? {})
      }),
      permissions: PERMISSIONS.ACTIONS.BASE.SYSTEM.ACCESS_SETTINGS.EDIT_RULE
    },
    {
      key: 'delete-access-rule',
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      confirm: (record) => ({
        title: t('dmsSystem.accessSettings.confirmDelete'),
        onConfirm: () => onDelete(record?.uid ?? '')
      }),
      permissions: PERMISSIONS.ACTIONS.BASE.SYSTEM.ACCESS_SETTINGS.DELETE_RULE
    }
  ]
});

export const AccessSettingHeaderActions = (
  onAdd: () => void
): Record<'add-access-rule', ReactNode> => ({
  'add-access-rule': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.SYSTEM.ACCESS_SETTINGS.ADD_RULE}
    >
      <ActionButton
        type="primary"
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        text={t('dmsSystem.accessSettings.addRule')}
        onClick={onAdd}
      />
    </PermissionControl>
  )
});
