import React, { useEffect, useCallback } from 'react';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GlobalDashboardListProps } from '../../../index.type';
import { useRequest } from 'ahooks';
import { WorkflowService } from '@actiontech/shared/lib/api/sqle';
import { IGetGlobalDataExportWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { getGlobalDataExportWorkflowsV1FilterProjectPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { paramsSerializer } from '@actiontech/dms-kit/es/utils/Common';
import { GlobalDashboardExportWorkflowListColumn } from '../../PendingWorkflowTabs/ExportWorkflow/column';
import { useCurrentUser } from '@actiontech/shared/lib/features';

const ExportWorkflowList: React.FC<GlobalDashboardListProps> = ({
  filterValues,
  updateFilterValue
}) => {
  const { pagination, tableChange } =
    useTableRequestParams<IWorkflowDetailResV1>();
  const { userId } = useCurrentUser();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: workflowList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetGlobalDataExportWorkflowsV1Params = {
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_instance_id: filterValues.instanceId,
        filter_project_priority:
          filterValues.projectPriority as unknown as getGlobalDataExportWorkflowsV1FilterProjectPriorityEnum,
        filter_project_uid: filterValues.projectId,
        filter_create_user_id: userId
      };

      return handleTableRequestError(
        WorkflowService.getGlobalDataExportWorkflowsV1(params, {
          paramsSerializer
        })
      );
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
      EmitterKey.Refresh_Global_Dashboard_Initiated_Export_Work_Order,
      refresh
    );

    return unsubscribe;
  });

  return (
    <ActiontechTable
      className="table-row-cursor"
      dataSource={workflowList?.list}
      rowKey={(record) => {
        return `${record?.workflow_id}`;
      }}
      pagination={{
        total: workflowList?.total ?? 0
      }}
      columns={GlobalDashboardExportWorkflowListColumn(onUpdateFilterValue)}
      loading={loading}
      errorMessage={requestErrorMessage}
      onChange={tableChange}
    />
  );
};

export default ExportWorkflowList;
