import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { t } from '../../../../locale';
import { OpPermissionTypeUid, SystemRole } from '@actiontech/shared/lib/enum';

export const UserListActions = (
  onEditUser: (record?: IListUser) => void,
  onDeleteUser: (record?: IListUser) => void,
  username: string
): ActiontechTableActionsWithPermissions<IListUser> => {
  /**
   * 用户列表操作列编辑按钮特殊权限控制：
   * 前置权限判断：当前登陆用户为 admin 或拥有 全局管理 权限。
   * 1. admin 用户仅 admin 能进行编辑
   * 2. 若被操作列用户拥有全局管理权限，admin 用户以及自身用户能进行编辑
   */
  const calculateEditActionEnabled = (record?: IListUser) => {
    if (record?.name === SystemRole.admin) {
      return username === SystemRole.admin;
    }
    if (
      record?.op_permissions?.some(
        (v) => v.uid === OpPermissionTypeUid.global_management
      )
    ) {
      return username === SystemRole.admin || username === record.name;
    }
    return true;
  };

  /**
   * 用户列表操作列删除按钮特殊权限控制：
   * 前置权限判断：当前登陆用户为 admin 或拥有 全局管理 权限。
   * 1. admin 用户无法被删除
   * 2. 若被操作列用户拥有全局管理权限，仅 admin 用户能进行删除
   */
  const calculateDeleteActionEnabled = (record?: IListUser) => {
    if (record?.name === SystemRole.admin) {
      return false;
    }

    if (
      record?.op_permissions?.some(
        (v) => v.uid === OpPermissionTypeUid.global_management
      )
    ) {
      return username === SystemRole.admin;
    }

    return true;
  };
  return [
    {
      text: t('common.manage'),
      key: 'userManage',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditUser(record);
          },
          disabled: !calculateEditActionEnabled(record)
        };
      },
      permissions: PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.EDIT
    },
    {
      text: t('common.delete'),
      buttonProps: (record) => ({
        danger: true,
        disabled: !calculateDeleteActionEnabled(record)
      }),
      key: 'userDelete',
      confirm: (record) => {
        return {
          title: t('dmsUserCenter.user.deleteUser.confirmTitle', {
            username: record?.name ?? ''
          }),
          onConfirm: () => {
            onDeleteUser(record);
          }
        };
      },
      permissions: PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.DELETE
    }
  ];
};
