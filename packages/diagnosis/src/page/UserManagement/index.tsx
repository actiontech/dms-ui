import { useState } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import {
  BasicButton,
  EmptyBox,
  PageHeader,
  SegmentedTabs
} from '@actiontech/shared';
import { ModalName } from '../../data/ModalName';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import { UserManagementTypeEnum } from './index.type';
import useUserManagementRedux from './hooks/useUserManagementRedux';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import PermissionList from './components/PermissionList';
import EmitterKey from '../../data/EmitterKey';
import { AdminRolePermission } from '../../data/enum';
import useCurrentUser from '../../hooks/useCurrentUser';
import { PlusOutlined } from '@actiontech/icons';

const UserManagement: React.FC = () => {
  const { t } = useTranslation();

  const { hasActionPermission } = useCurrentUser();

  const { setModalStatus, setPermissionRoleId } = useUserManagementRedux();

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.Refresh_User_Management);
  };

  const [activeTab, setActiveTab] = useState(UserManagementTypeEnum.user_list);

  const onChangeListType = (key: SegmentedValue) => {
    setActiveTab(key as UserManagementTypeEnum);
    if (key !== UserManagementTypeEnum.permission_list) {
      setPermissionRoleId(undefined);
    }
  };

  const renderExtraButton = () => {
    const handleClick = (name: ModalName) => {
      setModalStatus(name, true);
    };

    if (activeTab === UserManagementTypeEnum.user_list) {
      return (
        <EmptyBox
          if={hasActionPermission(AdminRolePermission.CreateUser)}
          key={AdminRolePermission.CreateUser}
        >
          <BasicButton
            type="primary"
            icon={<PlusOutlined width={12} height={12} color="currentColor" />}
            onClick={() => {
              handleClick(ModalName.Add_User);
            }}
          >
            {t('userManagement.button.addUser')}
          </BasicButton>
        </EmptyBox>
      );
    }

    if (activeTab === UserManagementTypeEnum.role_list) {
      return (
        <EmptyBox
          if={hasActionPermission(AdminRolePermission.CreateRole)}
          key={AdminRolePermission.CreateRole}
        >
          <BasicButton
            type="primary"
            icon={<PlusOutlined width={12} height={12} color="currentColor" />}
            onClick={() => {
              handleClick(ModalName.Add_Role);
            }}
          >
            {t('userManagement.button.addRole')}
          </BasicButton>
        </EmptyBox>
      );
    }
  };

  return (
    <section>
      <PageHeader
        title={
          <Space size={12}>
            {t('userManagement.title')}
            <TableRefreshButton refresh={onRefreshTable} />
          </Space>
        }
        extra={renderExtraButton()}
      />
      <SegmentedTabs
        activeKey={activeTab}
        onChange={onChangeListType}
        items={[
          {
            value: UserManagementTypeEnum.user_list,
            label: t('userManagement.userList'),
            children: <UserList />,
            destroyInactivePane: true
          },
          {
            value: UserManagementTypeEnum.role_list,
            label: t('userManagement.roleList'),
            children: <RoleList handleChange={onChangeListType} />,
            destroyInactivePane: true
          },
          {
            value: UserManagementTypeEnum.permission_list,
            label: t('userManagement.permissionList'),
            children: <PermissionList />,
            destroyInactivePane: true
          }
        ]}
      />
    </section>
  );
};

export default UserManagement;
