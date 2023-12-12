import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { ModalName } from '../../data/ModalName';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import { UserManagementTypeEnum } from './index.type';
import useUserManagementRedux from './hooks/useUserManagementRedux';
import {
  useSegmentedPageParams,
  BasicSegmentedPage
} from '@actiontech/shared/lib/components/BasicSegmentedPage';
import UserList from './components/UserList';
import EmitterKey from '../../data/EmitterKey';

const UserManagement: React.FC = () => {
  const { t } = useTranslation();

  const { setModalStatus } = useUserManagementRedux();

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.Refresh_User_Management);
  };

  const { updateSegmentedPageData, renderExtraButton, ...otherProps } =
    useSegmentedPageParams<UserManagementTypeEnum>();

  useEffect(() => {
    const onClick = (modalName: ModalName) => {
      setModalStatus(modalName, true);
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
              onClick(ModalName.Add_User);
            }}
          >
            {t('userManagement.button.addUser')}
          </BasicButton>
        )
      },
      {
        value: UserManagementTypeEnum.role_list,
        label: t('userManagement.roleList'),
        content: <></>,
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onClick(ModalName.Add_Role);
            }}
          >
            {t('userManagement.button.addRole')}
          </BasicButton>
        )
      },
      {
        value: UserManagementTypeEnum.permission_list,
        label: t('userManagement.permissionList'),
        content: <></>,
        extraButton: null
      }
    ]);
  }, [updateSegmentedPageData, t]);

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
      <BasicSegmentedPage {...otherProps} />
    </section>
  );
};

export default UserManagement;
