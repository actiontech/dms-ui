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
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import { IListRolesParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { RoleListColumns, RoleListActions } from './roleListColumn';
import {
  updateUserManageModalStatus,
  updateSelectRole
} from '../../../store/userCenter';

const RoleList: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListRole,
    IListRolesParams
  >();

  const {
    data: roleList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListRolesParams = {
        ...pagination
      };
      return handleTableRequestError(dms.ListRoles(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onEditRole = useCallback(
    (role?: IListRole) => {
      dispatch(updateSelectRole({ role: role ?? null }));
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.DMS_Update_Role,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onDeleteRole = useCallback(
    (role: IListRole | undefined) => {
      dms
        .DelRole({
          role_uid: role?.uid || ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.open({
              type: 'success',
              content: t('dmsUserCenter.role.deleteRole.deleteSuccessTips', {
                name: role?.name
              })
            });
            refresh();
          }
        });
    },
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return RoleListActions(onEditRole, onDeleteRole);
  }, [onEditRole, onDeleteRole]);

  const columns = useMemo(() => {
    return RoleListColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Role_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="uid"
        dataSource={roleList?.list}
        pagination={{
          total: roleList?.total ?? 0
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

export default RoleList;
