import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { PermissionListColumns } from './index.data';
import auth from '../../../../api/auth';
import OperationTypes, { ALL_Operation } from './components/OperationTypes';
import { IViewScope } from '../../../../api/common';
import { uniq } from 'lodash';

const PermissionList: React.FC = () => {
  const [currentType, setCurrentType] = useState<string>(ALL_Operation);

  const [typeData, setTypeData] = useState<string[]>([]);

  const [dataSource, setDataSource] = useState<IViewScope[]>([]);
  const [filterData, setFilterData] = useState<IViewScope[]>([]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: permissionList,
    loading,
    refresh
  } = useRequest(() => {
    return handleTableRequestError(auth.V1ListExistingScopes());
  });

  useEffect(() => {
    setDataSource(permissionList?.list ?? []);
    setFilterData(permissionList?.list ?? []);
    const groupData = (permissionList?.list ?? []).map(
      (item) => item?.group ?? ''
    );
    setTypeData(uniq(groupData));
  }, [permissionList]);

  useEffect(() => {
    let filterResult = [];
    if (currentType === ALL_Operation) {
      filterResult = dataSource;
    } else {
      filterResult = dataSource.filter((item) => item?.group === currentType);
    }
    setFilterData(filterResult);
  }, [currentType, dataSource]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Permission_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      <OperationTypes
        currentType={currentType}
        setOperationType={setCurrentType}
        typeData={typeData}
      />
      <ActiontechTable
        rowKey="scope_name"
        dataSource={filterData}
        pagination={{
          total: filterData.length ?? 0
        }}
        loading={loading}
        columns={PermissionListColumns}
        errorMessage={requestErrorMessage}
      />
    </>
  );
};

export default PermissionList;
