import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Space } from 'antd';
import { BasicButton, PageHeader, SegmentedTabs } from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { UserCenterListEnum } from './index.enum';
import { useTranslation } from 'react-i18next';
import UserManageModal from './Modal';
import { updateUserManageModalStatus } from '../../store/userCenter';
import UserList from './components/UserList/List';
import RoleList from './components/RoleList/List';
import { ModalName } from '../../data/ModalName';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import PermissionList from './components/PermissionList/List';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { PlusOutlined } from '@actiontech/icons';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const UserCenter: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [activePage, setActivePage] = useState(UserCenterListEnum.user_list);

  const onRefreshTable = (tab: UserCenterListEnum) => {
    eventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List);
  };

  const { isAdmin } = useCurrentUser();

  const pageItems: SegmentedTabsProps['items'] = [
    {
      value: UserCenterListEnum.user_list,
      label: t('dmsUserCenter.user.userList.title'),
      children: <UserList activePage={activePage} />
    },
    {
      value: UserCenterListEnum.role_list,
      label: t('dmsUserCenter.role.roleList.title'),
      children: <RoleList activePage={activePage} />
    },
    {
      value: UserCenterListEnum.operate_permission_list,
      label: t('dmsUserCenter.role.opPermissionList.title'),
      children: <PermissionList activePage={activePage} />
    }
  ];

  const renderExtraButton = () => {
    const handleClick = (modalName: ModalName) => {
      dispatch(
        updateUserManageModalStatus({
          modalName,
          status: true
        })
      );
    };

    return (
      <>
        <BasicButton
          hidden={activePage !== UserCenterListEnum.user_list || !isAdmin}
          type="primary"
          icon={
            <PlusOutlined
              width={10}
              height={10}
              fill="currentColor"
              color="currentColor"
            />
          }
          onClick={() => {
            handleClick(ModalName.DMS_Add_User);
          }}
        >
          {t('dmsUserCenter.user.userList.addUserButton')}
        </BasicButton>

        <BasicButton
          hidden={activePage !== UserCenterListEnum.role_list || !isAdmin}
          type="primary"
          icon={
            <PlusOutlined
              width={10}
              height={10}
              fill="currentColor"
              color="currentColor"
            />
          }
          onClick={() => {
            handleClick(ModalName.DMS_Add_Role);
          }}
        >
          {t('dmsUserCenter.role.createRole.button')}
        </BasicButton>
      </>
    );
  };

  const handleTabChange = (key: UserCenterListEnum) => {
    setActivePage(key);
  };

  return (
    <section>
      <PageHeader
        title={
          <Space size={12}>
            {t('dmsUserCenter.pageTitle')}
            <TableRefreshButton
              refresh={() => {
                onRefreshTable(activePage);
              }}
            />
          </Space>
        }
        extra={renderExtraButton()}
      />
      <SegmentedTabs
        items={pageItems}
        activeKey={activePage}
        onChange={handleTabChange}
      />
      <UserManageModal />
    </section>
  );
};

export default UserCenter;
