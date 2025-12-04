import React, { useEffect, useCallback } from 'react';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';

import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GlobalDashboardListProps } from '../../../index.type';
import { GlobalDashboardExportWorkflowListColumn } from './column';
import { useRequest } from 'ahooks';
import { WorkflowService } from '@actiontech/shared/lib/api/sqle';
import {
  ActiontechTable,
  paramsSerializer,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared';
import {
  getGlobalDataExportWorkflowsV1FilterProjectPriorityEnum,
  getGlobalDataExportWorkflowsV1FilterStatusListEnum
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { IGetGlobalDataExportWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { useCurrentUser } from '@actiontech/shared/lib/features';

const PendingExportWorkflowList: React.FC<GlobalDashboardListProps> = ({
  filterValues,
  updateFilterValue,
  filterAssignedToMe
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
        filter_status_list: [
          getGlobalDataExportWorkflowsV1FilterStatusListEnum.wait_for_approve,
          getGlobalDataExportWorkflowsV1FilterStatusListEnum.wait_for_export,
          getGlobalDataExportWorkflowsV1FilterStatusListEnum.failed,
          getGlobalDataExportWorkflowsV1FilterStatusListEnum.rejected
        ],
        filter_instance_id: filterValues.instanceId,
        filter_project_priority:
          filterValues.projectPriority as unknown as getGlobalDataExportWorkflowsV1FilterProjectPriorityEnum,
        filter_project_uid: filterValues.projectId,
        filter_current_step_assignee_user_id: filterAssignedToMe
          ? userId
          : undefined
      };

      return handleTableRequestError(
        WorkflowService.getGlobalDataExportWorkflowsV1(params, {
          paramsSerializer
        })
      );
    },
    {
      refreshDeps: [pagination, filterValues, filterAssignedToMe]
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
      EmitterKey.Refresh_Global_Dashboard_Export_Work_Order,
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

export default PendingExportWorkflowList;
