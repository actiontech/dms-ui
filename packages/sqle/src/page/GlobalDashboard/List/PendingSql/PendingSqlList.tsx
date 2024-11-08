import React, { useEffect, useCallback } from 'react';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import sqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetGlobalSqlManageListParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { IGlobalSqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetGlobalSqlManageListFilterProjectPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { PendingSqlListColumn, PendingSqlListAction } from './column';
import { GlobalDashboardListProps } from '../../index.type';
import {
  SQL_MANAGEMENT_INSTANCE_PATH_KEY,
  SQL_MANAGEMENT_SOURCE_PATH_KEY
} from '../../../../data/common';
import { PendingSqlTableStyleWrapper } from '../../style';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const PendingSqlList: React.FC<GlobalDashboardListProps> = ({
  filterValues,
  updateFilterValue
}) => {
  const navigate = useTypedNavigate();

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

  const onCheckDetail = (record?: IGlobalSqlManage) => {
    navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index, {
      params: { projectID: record?.project_uid ?? '' },
      queries: {
        source: record?.source?.sql_source_type ?? '',
        instanceId: record?.instance_id ?? ''
      }
    });
  };

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
        actions={PendingSqlListAction(onCheckDetail)}
        loading={loading}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </PendingSqlTableStyleWrapper>
  );
};

export default PendingSqlList;
