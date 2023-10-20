import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd5';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import { IListUsersParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { UserListColumns, UserListActions } from './userListColumn';
import {
  updateUserManageModalStatus,
  updateSelectUser
} from '../../../store/userCenter';

const UserList: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListUser,
    IListUsersParams
  >();

  const {
    data: userList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListUsersParams = {
        ...pagination
      };
      return handleTableRequestError(dms.ListUsers(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onEditUser = useCallback(
    (user?: IListUser) => {
      dispatch(
        updateSelectUser({
          user: user ?? null
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

  const onDeleteUser = useCallback(
    (record: IListUser | undefined) => {
      dms.DelUser({ user_uid: record?.uid ?? '' }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.open({
            type: 'success',
            content: t('dmsUserCenter.user.deleteUser.deleteSuccess', {
              username: record?.name ?? ''
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
      EmitterKey.DMS_Refresh_User_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="uid"
        dataSource={userList?.list}
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
