import React, { useEffect, useCallback } from 'react';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGetGlobalWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getGlobalWorkflowsV1FilterProjectPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { GlobalDashboardListProps } from '../../../index.type';
import { GlobalDashboardPendingWorkflowListColumn } from '../../PendingWorkflowTabs/ExecuteWorkflow/column';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { paramsSerializer } from '@actiontech/dms-kit';

const ExecuteWorkflow: React.FC<GlobalDashboardListProps> = ({
  filterValues,
  updateFilterValue
}) => {
  const { userId } = useCurrentUser();

  const { pagination, tableChange } =
    useTableRequestParams<IWorkflowDetailResV1>();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: workflowList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetGlobalWorkflowsV1Params = {
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_instance_id: filterValues.instanceId,
        filter_project_priority:
          filterValues.projectPriority as unknown as getGlobalWorkflowsV1FilterProjectPriorityEnum,
        filter_project_uid: filterValues.projectId,
        filter_create_user_id: userId
      };

      return handleTableRequestError(
        workflow.getGlobalWorkflowsV1(params, {
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
      EmitterKey.Refresh_Global_Dashboard_Initiated_Work_Order,
      refresh
    );

    return unsubscribe;
  });

  return (
    <ActiontechTable
      className="table-row-cursor"
      dataSource={workflowList?.list}
      rowKey={(record: IWorkflowDetailResV1) => {
        return `${record?.workflow_id}`;
      }}
      pagination={{
        total: workflowList?.total ?? 0
      }}
      columns={GlobalDashboardPendingWorkflowListColumn(onUpdateFilterValue)}
      loading={loading}
      errorMessage={requestErrorMessage}
      onChange={tableChange}
    />
  );
};

export default ExecuteWorkflow;
