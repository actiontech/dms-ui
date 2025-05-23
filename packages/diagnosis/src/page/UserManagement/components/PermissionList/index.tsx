import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { PermissionListColumns, ExtraFilterMeta } from './index.data';
import auth from '../../../../api/auth';
import OperationTypes, { ALL_Operation } from './components/OperationTypes';
import { IViewScope } from '../../../../api/common';
import { uniq } from 'lodash';
import useGetRoleData from '../../hooks/useGetRoleData';
import useUserManagementRedux from '../../hooks/useUserManagementRedux';
import { IV1ListExistingScopesParams } from '../../../../api/auth/index.d';

const PermissionList: React.FC = () => {
  const [currentType, setCurrentType] = useState<string>(ALL_Operation);

  const [typeData, setTypeData] = useState<string[]>([]);

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
      return handleTableRequestError(auth.V1ListExistingScopes(params)).then(
        (res) => {
          const groupData = (res?.list ?? []).map((item) => item?.group ?? '');
          setTypeData(uniq(groupData));
          return res?.list;
        }
      );
    },
    {
      refreshDeps: [tableFilterInfo]
    }
  );

  const listData = useMemo(() => {
    if (currentType === ALL_Operation) {
      return permissionList ?? [];
    }
    return (permissionList ?? []).filter((item) => item?.group === currentType);
  }, [permissionList, currentType]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_User_Management,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<
      IViewScope & {
        role_id?: string;
      },
      IV1ListExistingScopesParams
    >(
      PermissionListColumns,
      updateTableFilterInfo,
      ExtraFilterMeta(!!permissionRoleId)
    );

  const customUpdateAllSelectedFilterItem = useCallback(
    (checked: boolean) => {
      if (!checked) setPermissionRoleId(undefined);
      updateAllSelectedFilterItem(checked);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateAllSelectedFilterItem]
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
          value: permissionRoleId,
          onChange: setPermissionRoleId
        }
      ]
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleOptions, roleLoading, permissionRoleId]);

  return (
    <>
      <TableToolbar
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem: customUpdateAllSelectedFilterItem
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
        dataSource={listData}
        pagination={{
          total: listData.length ?? 0
        }}
        loading={loading}
        columns={PermissionListColumns}
        errorMessage={requestErrorMessage}
      />
    </>
  );
};

export default PermissionList;
