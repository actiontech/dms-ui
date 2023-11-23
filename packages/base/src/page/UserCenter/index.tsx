import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Space } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { BasicButton, PageHeader, BasicSegmented } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import {
  TableToolbar,
  TableRefreshButton
} from '@actiontech/shared/lib/components/ActiontechTable';
import { UserCenterListType, UserCenterListDataSource } from './types';
import { useTranslation } from 'react-i18next';
import EventEmitter from '../../utils/EventEmitter';
import UserManageModal from './Modal';
import { updateUserManageModalStatus } from '../../store/userCenter';
import { UserCenterStyledWrapper } from './style';

const UserCenter: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [listType, setListType] = useState<UserCenterListType>(
    UserCenterListType.user_list
  );

  const onChange = (v: SegmentedValue) => {
    setListType(v as UserCenterListType);
  };

  const onRefreshTable = () => {
    EventEmitter.emit(UserCenterListDataSource[listType].refresh);
  };

  const onClick = () => {
    dispatch(
      updateUserManageModalStatus({
        modalName: UserCenterListDataSource[listType].modalName,
        status: true
      })
    );
  };

  return (
    <UserCenterStyledWrapper>
      <PageHeader
        title={
          <Space size={12}>
            {t('dmsUserCenter.pageTitle')}
            <TableRefreshButton refresh={onRefreshTable} />
          </Space>
        }
        extra={
          listType !== UserCenterListType.operate_permission_list ? (
            <BasicButton type="primary" icon={<IconAdd />} onClick={onClick}>
              {UserCenterListDataSource[listType].extraText}
            </BasicButton>
          ) : null
        }
      ></PageHeader>
      <TableToolbar>
        <BasicSegmented
          value={listType}
          onChange={onChange}
          options={[
            {
              value: UserCenterListType.user_list,
              label: t('dmsUserCenter.user.userList.title')
            },
            {
              value: UserCenterListType.role_list,
              label: t('dmsUserCenter.role.roleList.title')
            },
            {
              value: UserCenterListType.operate_permission_list,
              label: t('dmsUserCenter.role.opPermissionList.title')
            }
          ]}
        />
      </TableToolbar>
      {UserCenterListDataSource[listType].tableRender()}
      <UserManageModal />
    </UserCenterStyledWrapper>
  );
};

export default UserCenter;
