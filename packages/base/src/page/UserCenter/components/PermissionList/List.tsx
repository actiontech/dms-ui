import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { permissionListColumns } from './column';
import { UserCenterListEnum } from '../../index.enum';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import {
  ListOpPermissionsFilterByTargetEnum,
  ListOpPermissionsServiceEnum
} from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';
import { IListOpPermissionsParams } from '@actiontech/shared/lib/api/base/service/OpPermission/index.d';
import { useEffect } from 'react';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { orderBy } from 'lodash';

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
      let service: ListOpPermissionsServiceEnum | undefined = undefined;
      // #if [sqle & !dms]
      service = ListOpPermissionsServiceEnum.sqle;
      // #endif
      const params: IListOpPermissionsParams = {
        ...pagination,
        filter_by_target: ListOpPermissionsFilterByTargetEnum.all,
        service
      };
      return handleTableRequestError(
        DmsApi.OpPermissionService.ListOpPermissions(params)
      );
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
      dataSource={orderBy(permissionList?.list, (item) => item.range_type, [
        'desc'
      ])}
      pagination={{
        total: permissionList?.total ?? 0
      }}
      loading={loading}
      columns={permissionListColumns()}
      errorMessage={requestErrorMessage}
      onChange={tableChange}
    />
  );
};

export default PermissionList;
