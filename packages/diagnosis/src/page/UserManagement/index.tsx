import { useState } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { BasicButton, PageHeader, BasicSegmented } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { UserManagementStyleWrapper } from './style';
import { ModalName } from '../../data/ModalName';
import {
  TableRefreshButton,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import { UserManagementDataSource, UserManagementTypeEnum } from './index.type';
import useUserManagementRedux from './hooks/useUserManagementRedux';

const UserManagement: React.FC = () => {
  const { t } = useTranslation();

  const { setModalStatus } = useUserManagementRedux();

  const [listType, setListType] = useState<UserManagementTypeEnum>(
    UserManagementTypeEnum.user_list
  );

  const onChange = (key: SegmentedValue) => {
    setListType(key as UserManagementTypeEnum);
  };

  const onAddOperate = () => {
    setModalStatus(
      UserManagementDataSource[listType].modalName as ModalName,
      true
    );
  };

  const onRefreshTable = () => {
    EventEmitter.emit(UserManagementDataSource[listType].refresh);
  };

  return (
    <UserManagementStyleWrapper>
      <PageHeader
        title={
          <Space size={12}>
            {t('userManagement.title')}
            <TableRefreshButton refresh={onRefreshTable} />
          </Space>
        }
        extra={
          listType !== UserManagementTypeEnum.permission_list ? (
            <BasicButton
              onClick={onAddOperate}
              type="primary"
              icon={<IconAdd />}
            >
              {UserManagementDataSource[listType].extraText}
            </BasicButton>
          ) : null
        }
      />
      <TableToolbar>
        <BasicSegmented
          value={listType}
          onChange={onChange}
          options={[
            {
              value: UserManagementTypeEnum.user_list,
              label: t('userManagement.userList')
            },
            {
              value: UserManagementTypeEnum.role_list,
              label: t('userManagement.roleList')
            },
            {
              value: UserManagementTypeEnum.permission_list,
              label: t('userManagement.permissionList')
            }
          ]}
        />
      </TableToolbar>
      {UserManagementDataSource[listType].tableRender()}
    </UserManagementStyleWrapper>
  );
};

export default UserManagement;
