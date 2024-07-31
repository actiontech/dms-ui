import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useTableRequestError } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MaintenanceTimeInfoType } from '../components/PageHeaderExtra/index.type';
import { TasksStatusCount } from '../index.type';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const WORKFLOW_OVERVIEW_TAB_KEY = 'WORKFLOW_OVERVIEW_TAB_KEY';

const useAuditExecResultPanelSetup = (
  workflowStatus?: WorkflowRecordResV2StatusEnum
) => {
  const urlParams = useParams<{ workflowId: string }>();
  const { projectName } = useCurrentProject();
  const [activeTabKey, changeActiveTabKey] = useState(
    WORKFLOW_OVERVIEW_TAB_KEY
  );

  const [tasksStatusCount, setTasksStatusCount] = useState<TasksStatusCount>();
  const [maintenanceTimeInfo, setMaintenanceTimeInfo] =
    useState<MaintenanceTimeInfoType>([]);
  const [canRejectWorkflow, setCanRejectWorkflow] = useState(false);

  const getOverviewListSuccessHandle = (list: IGetWorkflowTasksItemV2[]) => {
    setMaintenanceTimeInfo?.(
      list.map((v) => ({
        instanceName: v.instance_name ?? '',
        maintenanceTime: v.instance_maintenance_times ?? []
      }))
    );

    setCanRejectWorkflow(
      list.every(
        (v) =>
          !!v.status &&
          ![
            GetWorkflowTasksItemV2StatusEnum.exec_succeeded,
            GetWorkflowTasksItemV2StatusEnum.executing,
            GetWorkflowTasksItemV2StatusEnum.exec_failed,
            GetWorkflowTasksItemV2StatusEnum.exec_scheduled
          ].includes(v.status)
      )
    );

    let succeededCount = 0,
      executingCount = 0,
      failedCount = 0;
    list.forEach((v) => {
      if (v.status === GetWorkflowTasksItemV2StatusEnum.exec_succeeded) {
        succeededCount++;
      } else if (v.status === GetWorkflowTasksItemV2StatusEnum.executing) {
        executingCount++;
      } else if (v.status === GetWorkflowTasksItemV2StatusEnum.exec_failed) {
        failedCount++;
      }
    });
    setTasksStatusCount({
      failed: failedCount,
      success: succeededCount,
      executing: executingCount
    });
  };

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    loading: getOverviewLoading,
    data: overviewList,
    refresh: refreshOverviewAction,
    cancel
  } = useRequest(
    () =>
      handleTableRequestError(
        workflow.getSummaryOfInstanceTasksV2({
          workflow_id: urlParams.workflowId ?? '',
          project_name: projectName
        })
      ),
    {
      ready:
        !!urlParams.workflowId && activeTabKey === WORKFLOW_OVERVIEW_TAB_KEY,
      onSuccess: ({ list }) => {
        getOverviewListSuccessHandle?.(list ?? []);
        if (workflowStatus !== WorkflowRecordResV2StatusEnum.executing) {
          cancel();
        }
      },
      pollingInterval: 1000,
      pollingErrorRetryCount: 3
    }
  );

  useEffect(() => {
    if (workflowStatus === WorkflowRecordResV2StatusEnum.executing) {
      refreshOverviewAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowStatus]);

  return {
    maintenanceTimeInfo,
    canRejectWorkflow,
    tasksStatusCount,
    activeTabKey,
    changeActiveTabKey,
    refreshOverviewAction,
    overviewList,
    getOverviewLoading,
    requestErrorMessage
  };
};

export default useAuditExecResultPanelSetup;
