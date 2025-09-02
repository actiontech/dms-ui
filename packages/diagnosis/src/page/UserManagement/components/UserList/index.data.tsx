import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewUserReply } from '../../../../api/common';
import { AdminUser } from '../../../../data/enum';

export const UserListColumns: ActiontechTableColumn<IViewUserReply> = [
  {
    dataIndex: 'username',
    title: () => t('common.username')
  },
  {
    dataIndex: 'role_name',
    title: () => t('userManagement.roleName')
  }
];

export const UserListActions = (
  onEditUser: (record?: IViewUserReply) => void,
  onDeleteUser: (record?: IViewUserReply) => void,
  hasEditPermission: boolean,
  hasDeletePermission: boolean
): ActiontechTableActionMeta<IViewUserReply>[] => {
  return [
    {
      text: t('common.manage'),
      key: 'userManagement',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditUser(record);
          }
        };
      },
      permissions: () => hasEditPermission
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'removeUser',
      confirm: (record) => {
        return {
          title: t('userManagement.user.deleteUser.confirmTitle', {
            name: record?.username ?? ''
          }),
          onConfirm: () => {
            onDeleteUser(record);
          }
        };
      },
      permissions: (record) =>
        record?.username !== AdminUser.admin && hasDeletePermission
    }
  ];
};
