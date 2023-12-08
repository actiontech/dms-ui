import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewRoleReply } from '../../../../api/common';

export const RoleListColumns: ActiontechTableColumn<IViewRoleReply> = [
  {
    dataIndex: 'role_name',
    title: () => t('userManagement.roleName')
  },
  {
    dataIndex: 'role_desc',
    title: () => t('userManagement.desc')
  },
  {
    // todo: change after api update
    dataIndex: 'role_desc',
    title: () => t('userManagement.role.operationPermission')
  }
];

export const RoleListActions = (
  onEditRole: (record?: IViewRoleReply) => void,
  onDeleteRole: (record?: IViewRoleReply) => void
): ActiontechTableActionMeta<IViewRoleReply>[] => {
  return [
    {
      text: t('common.edit'),
      key: 'editRole',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditRole(record);
          }
        };
      }
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'removeRole',
      confirm: (record) => {
        return {
          title: t('userManagement.role.deleteRole.confirmTitle', {
            name: record?.role_name ?? ''
          }),
          onConfirm: () => {
            onDeleteRole(record);
          }
        };
      }
    }
  ];
};
