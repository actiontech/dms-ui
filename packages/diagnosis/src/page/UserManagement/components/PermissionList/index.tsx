import { useMemo, useEffect } from 'react';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { PermissionListColumns } from './index.data';
import auth from '../../../../api/auth';

const PermissionList: React.FC = () => {
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: permissionList,
    loading,
    refresh
  } = useRequest(() => {
    return handleTableRequestError(auth.V1ListExistingScopes());
  });

  const columns = useMemo(() => {
    return PermissionListColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Permission_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      <ActiontechTable
        rowKey="scope_name"
        dataSource={permissionList?.list ?? []}
        pagination={{
          total: permissionList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
      />
    </>
  );
};

export default PermissionList;
