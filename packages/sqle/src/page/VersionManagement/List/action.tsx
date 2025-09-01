import { ActionButton } from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl,
  PermissionsConstantType
} from '@actiontech/shared/lib/features';
import { t } from '../../../locale';
import { ReactNode } from 'react';
import { ISqlVersionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlVersionResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ActiontechTableActionsConfig } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { PlusOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
export const VersionManagementPageHeaderActions = (
  projectID: string
): Record<'add', ReactNode> => {
  return {
    add: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.VERSION_MANAGEMENT.ADD}
      >
        <ActionButton
          icon={<PlusOutlined width={10} height={10} color="currentColor" />}
          type="primary"
          actionType="navigate-link"
          link={{
            to: ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.create,
            params: {
              projectID
            }
          }}
          text={t('versionManagement.operation.add')}
        />
      </PermissionControl>
    )
  };
};
export const VersionManagementTableActions = ({
  onEdit,
  onDelete,
  onLock,
  checkActionPermission
}: {
  onEdit: (id?: number) => void;
  onDelete: (id?: number) => void;
  onLock: (id?: number) => void;
  checkActionPermission: (permission: PermissionsConstantType) => boolean;
}): ActiontechTableActionsConfig<ISqlVersionResV1> => {
  return {
    buttons: [
      {
        key: 'edit-button',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: () => onEdit(record?.version_id)
        }),
        permissions: (record) =>
          record?.status === SqlVersionResV1StatusEnum.is_being_released &&
          checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.VERSION_MANAGEMENT.EDIT
          )
      },
      {
        key: 'lock-button',
        text: t('versionManagement.list.action.lock'),
        confirm: (record) => ({
          title: t('versionManagement.list.action.lockConfirm'),
          onConfirm: () => onLock(record?.version_id)
        }),
        permissions: (record) =>
          !!record?.lockable &&
          record?.status !== SqlVersionResV1StatusEnum.locked &&
          checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.VERSION_MANAGEMENT.LOCK
          )
      },
      {
        key: 'delete-button',
        text: t('common.delete'),
        buttonProps: () => ({
          danger: true
        }),
        confirm: (record) => ({
          title: t('versionManagement.list.action.deleteConfirm'),
          onConfirm: () => onDelete(record?.version_id)
        }),
        permissions: (record) =>
          !!record?.deletable &&
          checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.VERSION_MANAGEMENT.DELETE
          )
      }
    ]
  };
};
