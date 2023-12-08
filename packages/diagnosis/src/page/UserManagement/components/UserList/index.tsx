import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { UserListColumns, UserListActions } from './index.data';
import useUserManagementRedux from '../../hooks/useUserManagementRedux';
import auth from '../../../../api/auth';
import { IV1ListUsersParams } from '../../../../api/auth/index.d';
import { IViewUserReply } from '../../../../api/common';

const UserList: React.FC = () => {
  const { t } = useTranslation();

  const { setModalStatus, setSelectUserData } = useUserManagementRedux();

  const [messageApi, contextHolder] = message.useMessage();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewUserReply,
    IV1ListUsersParams
  >();

  const {
    data: userList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IV1ListUsersParams = {
        ...pagination
      };
      return handleTableRequestError(auth.V1ListUsers(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onEditUser = useCallback((record?: IViewUserReply) => {
    setSelectUserData(record ?? null);
    setModalStatus(ModalName.Update_User, true);
  }, []);

  const onDeleteUser = useCallback(
    (record: IViewUserReply | undefined) => {
      auth.V1DeleteUser({ user_id: record?.user_id ?? '' }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.open({
            type: 'success',
            content: t('userManagement.deleteUser.deleteSuccess', {
              username: record?.username ?? ''
            })
          });
          refresh();
        }
      });
    },
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return UserListActions(onEditUser, onDeleteUser);
  }, [onEditUser, onDeleteUser]);

  const columns = useMemo(() => {
    return UserListColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_User_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="user_id"
        dataSource={userList?.list ?? []}
        pagination={{
          total: userList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
    </>
  );
};

export default UserList;
