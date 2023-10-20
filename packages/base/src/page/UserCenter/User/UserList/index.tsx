import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAntdTable, useToggle } from 'ahooks';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateUserManageModalStatus,
  updateSelectUser
} from '../../../../store/userCenter';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';
import tableHeaderFactory from './tableHeader';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { TablePaginationProps } from '@actiontech/shared/lib/types/common.type';
import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import { IListUsersParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const UserList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);
  const [messageApi, contextHoler] = message.useMessage();

  const getUserList = ({ current, pageSize }: TablePaginationProps) => {
    const params: IListUsersParams = {
      page_index: current,
      page_size: pageSize
    };

    return dms.ListUsers(params).then((res) => {
      return {
        list: res.data?.data ?? [],
        total: res.data?.total_nums ?? 0
      };
    });
  };
  const { tableProps } = useAntdTable(getUserList, {
    refreshDeps: [refreshFlag]
  });

  const addUser = useCallback(() => {
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Add_User,
        status: true
      })
    );
  }, [dispatch]);

  const updateUser = useCallback(
    (user: IListUser) => {
      dispatch(
        updateSelectUser({
          user
        })
      );
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.DMS_Update_User,
          status: true
        })
      );
    },
    [dispatch]
  );

  const removeUser = (username: string, userUid: string) => {
    const hideLoading = messageApi.loading(
      t('dmsUserCenter.user.deleteUser.deleting', { username }),
      0
    );
    dms
      .DelUser({ user_uid: userUid })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsUserCenter.user.deleteUser.deleteSuccess', { username })
          );
          toggleRefreshFlag();
          EventEmitter.emit(EmitterKey.DMS_Refresh_User_Group_List);
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.DMS_Refresh_User_List, toggleRefreshFlag);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.DMS_Refresh_User_List,
        toggleRefreshFlag
      );
    };
  }, [toggleRefreshFlag]);

  return (
    <>
      {contextHoler}
      <Card
        title={
          <Space>
            {t('dmsUserCenter.user.userList.title')}
            <Button onClick={toggleRefreshFlag}>
              <SyncOutlined spin={tableProps.loading} />
            </Button>
          </Space>
        }
        extra={[
          <Button key="create-user" type="primary" onClick={addUser}>
            {t('dmsUserCenter.user.userList.addUserButton')}
          </Button>
        ]}
      >
        <Table
          rowKey="uid"
          columns={tableHeaderFactory(updateUser, removeUser)}
          {...tableProps}
        />
      </Card>
    </>
  );
};

export default UserList;
