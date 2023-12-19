import { useEffect } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { UserManagementStyleWrapper } from './style';
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

const UserManagement: React.FC = () => {
  const { t } = useTranslation();

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
      setPermissionRoleId('');
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
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onAddOperate(ModalName.Add_User);
            }}
          >
            {t('userManagement.button.addUser')}
          </BasicButton>
        )
      },
      {
        value: UserManagementTypeEnum.role_list,
        label: t('userManagement.roleList'),
        content: <RoleList handleChange={onChangeListType} />,
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onAddOperate(ModalName.Add_Role);
            }}
          >
            {t('userManagement.button.addRole')}
          </BasicButton>
        )
      },
      {
        value: UserManagementTypeEnum.permission_list,
        label: t('userManagement.permissionList'),
        content: <PermissionList />
      }
    ]);
  }, [updateSegmentedPageData, t]);

  return (
    <UserManagementStyleWrapper>
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
    </UserManagementStyleWrapper>
  );
};

export default UserManagement;
