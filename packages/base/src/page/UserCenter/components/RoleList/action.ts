import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { t } from '../../../../locale';

export const RoleListActions = (
  onEditRole: (record?: IListRole) => void,
  onDeleteRole: (record?: IListRole) => void
): ActiontechTableActionsWithPermissions<IListRole> => {
  return [
    {
      text: t('common.edit'),
      key: 'roleManage',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditRole(record);
          }
        };
      },
      permissions: PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.EDIT
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      permissions: PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.DELETE,
      key: 'roleDelete',
      confirm: (record) => {
        return {
          title: t('dmsUserCenter.role.deleteRole.deleteTips', {
            name: record?.name ?? ''
          }),
          onConfirm: () => {
            onDeleteRole(record);
          }
        };
      }
    }
  ];
};
