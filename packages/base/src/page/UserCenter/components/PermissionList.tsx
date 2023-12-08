import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { IListOpPermissionsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { PermissionListColumns } from './permissionListColumn';

const PermissionList: React.FC = () => {
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListOpPermission,
    IListOpPermissionsParams
  >();

  const {
    data: permissionList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListOpPermissionsParams = {
        ...pagination,
        filter_by_target: ListOpPermissionsFilterByTargetEnum.all
      };
      return handleTableRequestError(dms.ListOpPermissions(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_User_Center_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <ActiontechTable
      rowKey={(record) => record.op_permission?.uid!}
      dataSource={permissionList?.list}
      pagination={{
        total: permissionList?.total ?? 0
      }}
      loading={loading}
      columns={PermissionListColumns}
      errorMessage={requestErrorMessage}
      onChange={tableChange}
    />
  );
};

export default PermissionList;
