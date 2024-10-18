import React, { useEffect, useCallback } from 'react';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetGlobalWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  getGlobalWorkflowsV1FilterProjectPriorityEnum,
  getGlobalWorkflowsV1FilterStatusListEnum
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { GlobalDashboardListProps } from '../../index.type';
import { GlobalDashboardPendingWorkflowListColumn } from './column';
import { paramsSerializer } from '../../utils';

const PendingWorkOrder: React.FC<GlobalDashboardListProps> = ({
  filterValues,
  updateFilterValue
}) => {
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
        filter_status_list: [
          getGlobalWorkflowsV1FilterStatusListEnum.wait_for_audit,
          getGlobalWorkflowsV1FilterStatusListEnum.wait_for_execution,
          getGlobalWorkflowsV1FilterStatusListEnum.rejected,
          getGlobalWorkflowsV1FilterStatusListEnum.exec_failed
        ]
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

  const onUpdateFilterProjectValue = useCallback(
    (value?: string) => {
      updateFilterValue('projectId', value);
    },
    [updateFilterValue]
  );

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Global_Dashboard_Pending_Work_Order,
      refresh
    );

    return unsubscribe;
  });

  return (
    <div>
      <ActiontechTable
        className="table-row-cursor"
        dataSource={workflowList?.list}
        rowKey={(record: IWorkflowDetailResV1) => {
          return `${record?.workflow_id}`;
        }}
        pagination={{
          total: workflowList?.total ?? 0
        }}
        columns={GlobalDashboardPendingWorkflowListColumn(
          onUpdateFilterProjectValue
        )}
        loading={loading}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </div>
  );
};

export default PendingWorkOrder;
