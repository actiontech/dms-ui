import React, { useEffect, useCallback } from 'react';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import sqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGetGlobalSqlManageListParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { IGlobalSqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetGlobalSqlManageListFilterProjectPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { PendingSqlListColumn } from './column';
import { GlobalDashboardListProps } from '../../index.type';
import { PendingSqlTableStyleWrapper } from '../../style';

const PendingSqlList: React.FC<GlobalDashboardListProps> = ({
  filterValues,
  updateFilterValue
}) => {
  const { pagination, tableChange } = useTableRequestParams<IGlobalSqlManage>();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: sqlManageList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetGlobalSqlManageListParams = {
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_instance_id: filterValues.instanceId,
        filter_project_priority:
          filterValues.projectPriority as unknown as GetGlobalSqlManageListFilterProjectPriorityEnum,
        filter_project_uid: filterValues.projectId
      };

      return handleTableRequestError(sqlManage.GetGlobalSqlManageList(params));
    },
    {
      refreshDeps: [pagination, filterValues]
    }
  );

  const onUpdateFilterValue = useCallback(
    (projectId?: string, instanceId?: string) => {
      updateFilterValue('projectId', projectId);
      updateFilterValue('instanceId', instanceId);
    },
    [updateFilterValue]
  );

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Global_Dashboard_Pending_Sql,
      refresh
    );

    return unsubscribe;
  });

  return (
    <PendingSqlTableStyleWrapper>
      <ActiontechTable
        className="table-row-cursor"
        dataSource={sqlManageList?.list}
        rowKey={(record: IGlobalSqlManage) => {
          return `${record?.id}`;
        }}
        pagination={{
          total: sqlManageList?.total ?? 0
        }}
        columns={PendingSqlListColumn(onUpdateFilterValue)}
        loading={loading}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </PendingSqlTableStyleWrapper>
  );
};

export default PendingSqlList;
