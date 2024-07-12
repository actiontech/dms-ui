import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd';
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
import { IListUsersParams } from '@actiontech/shared/lib/api/base/service/User/index.d';
import User from '@actiontech/shared/lib/api/base/service/User';
import { UserCenterListEnum } from '../../index.enum';
import {
  updateSelectUser,
  updateUserManageModalStatus
} from '../../../../store/userCenter';
import { UserListActions, UserListColumns } from './column';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

const UserList: React.FC<{ activePage: UserCenterListEnum }> = ({
  activePage
}) => {
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
      return handleTableRequestError(User.ListUsers(params));
    },
    {
      refreshDeps: [pagination, activePage],
      ready: UserCenterListEnum.user_list === activePage
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
    (record?: IListUser) => {
      User.DelUser({ user_uid: record?.uid ?? '' }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsUserCenter.user.deleteUser.deleteSuccess', {
              username: record?.name ?? ''
            })
          );
          refresh();
        }
      });
    },
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return UserListActions(onEditUser, onDeleteUser);
  }, [onEditUser, onDeleteUser]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_User_Center_List,
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
        columns={UserListColumns()}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
    </>
  );
};

export default UserList;
