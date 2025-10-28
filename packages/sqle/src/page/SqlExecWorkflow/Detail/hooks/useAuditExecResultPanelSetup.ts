import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useTableRequestError } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';
import { useState, useMemo } from 'react';
import { MaintenanceTimeInfoType } from '../components/PageHeaderExtra/index.type';
import { TasksStatusCount } from '../index.type';
import { useBoolean } from 'ahooks';
import { useTypedParams } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const WORKFLOW_OVERVIEW_TAB_KEY = 'WORKFLOW_OVERVIEW_TAB_KEY';

const useAuditExecResultPanelSetup = () => {
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail>();
  const { projectName } = useCurrentProject();
  const [activeTabKey, changeActiveTabKey] = useState(
    WORKFLOW_OVERVIEW_TAB_KEY
  );

  const [tasksStatusCount, setTasksStatusCount] = useState<TasksStatusCount>();
  const [maintenanceTimeInfo, setMaintenanceTimeInfo] =
    useState<MaintenanceTimeInfoType>([]);
  const [canRejectWorkflow, setCanRejectWorkflow] = useState(false);

  const [polling, { setFalse: finishPollRequest, setTrue: startPollRequest }] =
    useBoolean();

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
    loading: overviewLoading,
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
      ready: !!urlParams.workflowId,
      onSuccess: ({ list }) => {
        getOverviewListSuccessHandle?.(list ?? []);
        // 接口404时，错误重试次数 pollingErrorRetryCount无效 导致重复抛出404错误提示。所以如果当list不存在时也停止轮询
        if (
          !list ||
          list?.every(
            (task) => task.status !== GetWorkflowTasksItemV2StatusEnum.executing
          )
        ) {
          cancel();
          finishPollRequest();
        } else {
          startPollRequest();
        }
      },
      pollingInterval: 1000,
      pollingErrorRetryCount: 3
    }
  );

  const getOverviewLoading = useMemo(
    () => (polling ? false : overviewLoading),
    [overviewLoading, polling]
  );

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
