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
import { IListUserGroup } from '@actiontech/shared/lib/api/base/service/common';
import { IListUserGroupsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  updateUserManageModalStatus,
  updateSelectUserGroup
} from '../../../store/userCenter';
import { userGroupListColumns, userGroupListActions } from './userGroupColumn';

const UserGroupList: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListUserGroup,
    IListUserGroupsParams
  >();

  const {
    data: userGroupList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListUserGroupsParams = {
        ...pagination
      };
      return handleTableRequestError(dms.ListUserGroups(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onEditUserGroup = useCallback(
    (record?: IListUserGroup) => {
      dispatch(
        updateSelectUserGroup({
          userGroup: record ?? null
        })
      );
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.DMS_Update_User_Group,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onDeleteUserGroup = useCallback(
    async (record?: IListUserGroup) => {
      const res = await dms.DelUserGroup({
        user_group_uid: record?.uid ?? ''
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.open({
          type: 'success',
          content: t('dmsUserCenter.user.deleteUserGroup.deleteSuccess', {
            name: record?.name
          })
        });
        refresh();
      }
    },
    [t, refresh, messageApi]
  );

  const actions = useMemo(() => {
    return userGroupListActions(onEditUserGroup, onDeleteUserGroup);
  }, [onEditUserGroup, onDeleteUserGroup]);

  const columns = useMemo(() => {
    return userGroupListColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_User_Group_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        className="user-group-table"
        dataSource={userGroupList?.list}
        pagination={{
          total: userGroupList?.total ?? 0
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

export default UserGroupList;
