import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Space } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { UserCenterListType } from './index.d';
import { useTranslation } from 'react-i18next';
import EventEmitter from '../../utils/EventEmitter';
import UserManageModal from './Modal';
import { updateUserManageModalStatus } from '../../store/userCenter';
import {
  useSegmentedPageParams,
  BasicSegmentedPage
} from '@actiontech/shared/lib/components/BasicSegmentedPage';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import OperatePermissionList from './components/PermissionList';
import { ModalName } from '../../data/ModalName';
import EmitterKey from '../../data/EmitterKey';

const UserCenter: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List);
  };

  const { updateSegmentedPageData, renderExtraButton, ...otherProps } =
    useSegmentedPageParams<UserCenterListType>();

  useEffect(() => {
    const onClick = (modalName: ModalName) => {
      dispatch(
        updateUserManageModalStatus({
          modalName,
          status: true
        })
      );
    };

    updateSegmentedPageData([
      {
        value: UserCenterListType.user_list,
        label: t('dmsUserCenter.user.userList.title'),
        content: <UserList />,
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onClick(ModalName.DMS_Add_User);
            }}
          >
            {t('dmsUserCenter.user.userList.addUserButton')}
          </BasicButton>
        )
      },
      {
        value: UserCenterListType.role_list,
        label: t('dmsUserCenter.role.roleList.title'),
        content: <RoleList />,
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onClick(ModalName.DMS_Add_Role);
            }}
          >
            {t('dmsUserCenter.role.createRole.button')}
          </BasicButton>
        )
      },
      {
        value: UserCenterListType.operate_permission_list,
        label: t('dmsUserCenter.role.opPermissionList.title'),
        content: <OperatePermissionList />,
        extraButton: null
      }
    ]);
  }, [updateSegmentedPageData, t, dispatch]);

  return (
    <section>
      <PageHeader
        title={
          <Space size={12}>
            {t('dmsUserCenter.pageTitle')}
            <TableRefreshButton refresh={onRefreshTable} />
          </Space>
        }
        extra={renderExtraButton()}
      ></PageHeader>
      <BasicSegmentedPage {...otherProps} />
      <UserManageModal />
    </section>
  );
};

export default UserCenter;
