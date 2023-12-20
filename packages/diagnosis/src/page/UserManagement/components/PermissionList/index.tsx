import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  FilterCustomProps,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { PermissionListColumns } from './index.data';
import auth from '../../../../api/auth';
import OperationTypes, { ALL_Operation } from './components/OperationTypes';
import { IViewScope } from '../../../../api/common';
import { uniq } from 'lodash';
import { ExtraFilterMeta } from './index.type';
import useGetRoleData from '../../hooks/useGetRoleData';
import useUserManagementRedux from '../../hooks/useUserManagementRedux';
import { IV1ListExistingScopesParams } from '../../../../api/auth/index.d';

const PermissionList: React.FC = () => {
  const [currentType, setCurrentType] = useState<string>(ALL_Operation);

  const [typeData, setTypeData] = useState<string[]>([]);

  const [dataSource, setDataSource] = useState<IViewScope[]>([]);
  const [filterData, setFilterData] = useState<IViewScope[]>([]);

  const { permissionRoleId, setPermissionRoleId } = useUserManagementRedux();

  const { loading: roleLoading, roleOptions } = useGetRoleData(true);

  const { tableFilterInfo, updateTableFilterInfo } = useTableRequestParams<
    IViewScope,
    IV1ListExistingScopesParams
  >(
    permissionRoleId
      ? { defaultFilterInfo: { role_id: permissionRoleId } }
      : undefined
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: permissionList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IV1ListExistingScopesParams = {
        ...tableFilterInfo
      };
      return handleTableRequestError(auth.V1ListExistingScopes(params));
    },
    {
      refreshDeps: [tableFilterInfo]
    }
  );

  useEffect(() => {
    if (Object.keys(tableFilterInfo).length === 0) {
      setPermissionRoleId('');
    }
  }, [tableFilterInfo]);

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
      EmitterKey.Refresh_User_Management,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(
      PermissionListColumns,
      updateTableFilterInfo,
      ExtraFilterMeta(!!permissionRoleId)
    );

  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof (IViewScope & {
        role_id?: string;
      }),
      FilterCustomProps
    >([
      [
        'role_id',
        {
          options: roleOptions,
          loading: roleLoading,
          defaultValue: permissionRoleId || null,
          onChange: () => setPermissionRoleId('')
        }
      ]
    ]);
  }, [roleOptions, roleLoading, permissionRoleId]);

  return (
    <>
      <TableToolbar
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        loading={loading}
      >
        <OperationTypes
          currentType={currentType}
          setOperationType={setCurrentType}
          typeData={typeData}
        />
      </TableToolbar>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
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
