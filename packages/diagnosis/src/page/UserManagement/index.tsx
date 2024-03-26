import { useEffect } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { ModalName } from '../../data/ModalName';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import { UserManagementTypeEnum } from './index.type';
import useUserManagementRedux from './hooks/useUserManagementRedux';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import PermissionList from './components/PermissionList';
import {
  BasicSegmentedPage,
  useSegmentedPageParams
} from '@actiontech/shared/lib/components/BasicSegmentedPage';
import EmitterKey from '../../data/EmitterKey';
import { AdminRolePermission } from '../../data/enum';
import useCurrentUser from '../../hooks/useCurrentUser';

const UserManagement: React.FC = () => {
  const { t } = useTranslation();

  const { hasActionPermission } = useCurrentUser();

  const { setModalStatus, setPermissionRoleId } = useUserManagementRedux();

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.Refresh_User_Management);
  };

  const {
    updateSegmentedPageData,
    renderExtraButton,
    onChange,
    ...otherProps
  } = useSegmentedPageParams<UserManagementTypeEnum>();

  const onChangeListType = (key: SegmentedValue) => {
    onChange(key);
    if (key !== UserManagementTypeEnum.permission_list) {
      setPermissionRoleId(undefined);
    }
  };

  useEffect(() => {
    const onAddOperate = (name: ModalName) => {
      setModalStatus(name, true);
    };

    updateSegmentedPageData([
      {
        value: UserManagementTypeEnum.user_list,
        label: t('userManagement.userList'),
        content: <UserList />,
        extraButton: (
          <EmptyBox
            if={hasActionPermission(AdminRolePermission.CreateUser)}
            key={AdminRolePermission.CreateUser}
          >
            <BasicButton
              type="primary"
              icon={<IconAdd />}
              onClick={() => {
                onAddOperate(ModalName.Add_User);
              }}
            >
              {t('userManagement.button.addUser')}
            </BasicButton>
          </EmptyBox>
        )
      },
      {
        value: UserManagementTypeEnum.role_list,
        label: t('userManagement.roleList'),
        content: <RoleList handleChange={onChangeListType} />,
        extraButton: (
          <EmptyBox
            if={hasActionPermission(AdminRolePermission.CreateRole)}
            key={AdminRolePermission.CreateRole}
          >
            <BasicButton
              type="primary"
              icon={<IconAdd />}
              onClick={() => {
                onAddOperate(ModalName.Add_Role);
              }}
            >
              {t('userManagement.button.addRole')}
            </BasicButton>
          </EmptyBox>
        )
      },
      {
        value: UserManagementTypeEnum.permission_list,
        label: t('userManagement.permissionList'),
        content: <PermissionList />
      }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSegmentedPageData, t, hasActionPermission]);

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
      <BasicSegmentedPage {...otherProps} onChange={onChangeListType} />
    </section>
  );
};

export default UserManagement;
