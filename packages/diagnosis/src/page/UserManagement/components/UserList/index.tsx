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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteUser = useCallback(
    (record: IViewUserReply | undefined) => {
      const hideLoading = messageApi.loading(
        t('userManagement.user.deleteUser.deleting', {
          name: record?.username
        }),
        0
      );
      auth
        .V1DeleteUser({ user_id: record?.user_id ?? '' })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success({
              content: t('userManagement.user.deleteUser.deleteSuccess', {
                name: record?.username ?? ''
              })
            });
            refresh();
          }
        })
        .finally(() => hideLoading());
    },
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return UserListActions(onEditUser, onDeleteUser);
  }, [onEditUser, onDeleteUser]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_User_Management,
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
        columns={UserListColumns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
    </>
  );
};

export default UserList;
