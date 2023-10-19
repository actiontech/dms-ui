import React from 'react';
import EmitterKey from '../../data/EmitterKey';
import { ModalName } from '../../data/ModalName';
import { t } from '../../locale';
import UserList from './components/UserList';
import UserGroupList from './components/UserGroupList';
import RoleList from './components/RoleList';
import OperatePermissionList from './components/PermissionList';

export enum UserCenterListType {
  'user_list' = 'user_list',
  'user_group_list' = 'user_group_list',
  'role_list' = 'role_list',
  'operate_permission_list' = 'operate_permission_list'
}

export const UserCenterListDataSource: Record<
  UserCenterListType,
  {
    refresh: EmitterKey;
    modalName: string;
    extraText: string;
    tableRender: () => React.ReactNode;
  }
> = {
  [UserCenterListType.user_list]: {
    refresh: EmitterKey.DMS_Refresh_User_List,
    modalName: ModalName.DMS_Add_User,
    extraText: t('dmsUserCenter.user.userList.addUserButton'),
    tableRender: () => <UserList />
  },
  [UserCenterListType.user_group_list]: {
    refresh: EmitterKey.DMS_Refresh_User_Group_List,
    modalName: ModalName.DMS_Add_User_Group,
    extraText: t('dmsUserCenter.user.userGroupList.addUserGroupButton'),
    tableRender: () => <UserGroupList />
  },
  [UserCenterListType.role_list]: {
    refresh: EmitterKey.DMS_Refresh_Role_List,
    modalName: ModalName.DMS_Add_Role,
    extraText: t('dmsUserCenter.role.createRole.button'),
    tableRender: () => <RoleList />
  },
  [UserCenterListType.operate_permission_list]: {
    refresh: EmitterKey.DMS_Refresh_User_Permission_list,
    modalName: '',
    extraText: '',
    tableRender: () => <OperatePermissionList />
  }
};
