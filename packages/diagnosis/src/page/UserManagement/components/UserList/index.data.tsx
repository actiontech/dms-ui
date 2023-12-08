import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewUserReply } from '../../../../api/common';

export const UserListColumns: ActiontechTableColumn<IViewUserReply> = [
  {
    dataIndex: 'username',
    title: () => t('common.username')
  },
  {
    dataIndex: 'role_id',
    title: () => t('userManagement.user.roleName')
  }
];

export const UserListActions = (
  onEditUser: (record?: IViewUserReply) => void,
  onDeleteUser: (record?: IViewUserReply) => void
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
      }
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'removeUser',
      confirm: (record) => {
        return {
          title: t('userManagement.deleteUser.confirmTitle', {
            username: record?.username ?? ''
          }),
          onConfirm: () => {
            onDeleteUser(record);
          }
        };
      }
    }
  ];
};
