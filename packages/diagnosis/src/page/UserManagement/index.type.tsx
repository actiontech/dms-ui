import React from 'react';
import EmitterKey from '../../data/EmitterKey';
import { ModalName } from '../../data/ModalName';
import { t } from '../../locale';
import UserList from './components/UserList';
import RoleList from './components/RoleList';

export enum UserManagementTypeEnum {
  'user_list' = 'user_list',
  'role_list' = 'role_list',
  'permission_list' = 'permission_list'
}

export const UserManagementDataSource: Record<
  UserManagementTypeEnum,
  {
    refresh: EmitterKey;
    modalName: string;
    extraText: string;
    tableRender: () => React.ReactNode;
  }
> = {
  [UserManagementTypeEnum.user_list]: {
    refresh: EmitterKey.Refresh_User_List,
    modalName: ModalName.Add_User,
    extraText: t('userManagement.button.addUser'),
    tableRender: () => <UserList />
  },
  [UserManagementTypeEnum.role_list]: {
    refresh: EmitterKey.Refresh_Role_List,
    modalName: ModalName.Add_Role,
    extraText: t('userManagement.button.addRole'),
    tableRender: () => <RoleList />
  },
  [UserManagementTypeEnum.permission_list]: {
    refresh: EmitterKey.Refresh_Permission_List,
    modalName: '',
    extraText: '',
    tableRender: () => <></>
  }
};
