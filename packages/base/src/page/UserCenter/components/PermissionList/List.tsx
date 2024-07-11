import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { PermissionListColumns } from './column';
import { UserCenterListEnum } from '../../index.enum';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import OpPermission from '@actiontech/shared/lib/api/base/service/OpPermission';
import { useRequest } from 'ahooks';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';
import { IListOpPermissionsParams } from '@actiontech/shared/lib/api/base/service/OpPermission/index.d';
import { useEffect } from 'react';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

const PermissionList: React.FC<{ activePage: UserCenterListEnum }> = ({
  activePage
}) => {
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
      return handleTableRequestError(OpPermission.ListOpPermissions(params));
    },
    {
      refreshDeps: [pagination, activePage],
      ready: activePage === UserCenterListEnum.operate_permission_list
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
      columns={PermissionListColumns()}
      errorMessage={requestErrorMessage}
      onChange={tableChange}
    />
  );
};

export default PermissionList;
