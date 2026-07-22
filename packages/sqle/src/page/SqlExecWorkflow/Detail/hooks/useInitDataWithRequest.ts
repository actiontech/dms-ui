import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/dms-kit';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useTypedParams } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const REFRESH_WORKFLOW_MAX_RETRY_TIMES = 5;
const REFRESH_WORKFLOW_RETRY_INTERVAL = 500;

const sleep = (duration: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const useInitDataWithRequest = (workflowId?: string) => {
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail>();
  const { projectName } = useCurrentProject();
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [
    getTaskInfosLoading,
    { setFalse: finishGetTaskInfos, setTrue: startGetTaskInfos }
  ] = useBoolean();

  const [polling, { setFalse: finishPollRequest, setTrue: startPollRequest }] =
    useBoolean();

  const {
    data: workflowInfo,
    refresh: refreshWorkflowInfo,
    refreshAsync: refreshWorkflowInfoAsync,
    loading: getWorkflowLoading,
    cancel
  } = useRequest(
    () =>
      workflow
        .getWorkflowV2({
          project_name: projectName,
          workflow_id: workflowId ?? urlParams.workflowId ?? ''
        })
        .then((res) => res.data.data),
    {
      pollingInterval: 1000,
      pollingErrorRetryCount: 3,
      onSuccess: (res) => {
        if (res?.record?.status !== WorkflowRecordResV2StatusEnum.executing) {
          cancel();
          finishPollRequest();
        } else {
          startPollRequest();
        }
      }
    }
  );

  const refreshTask = useCallback(() => {
    const request = (taskId: string) => {
      return task.getAuditTaskV1({ task_id: taskId });
    };
    if (!!workflowInfo) {
      startGetTaskInfos();
      Promise.all(
        (workflowInfo?.record?.tasks ?? []).map((v) =>
          request(v.task_id?.toString() ?? '')
        )
      )
        .then((res) => {
          if (res.every((v) => v.data.code === ResponseCode.SUCCESS)) {
            setTaskInfos(res.map((v) => v.data.data!));
          }
        })
        .finally(() => {
          finishGetTaskInfos();
        });
    }
  }, [finishGetTaskInfos, workflowInfo, startGetTaskInfos]);

  const refreshWorkflowInfoUntilUpdated = useCallback(
    async (expectedDesc?: string) => {
      let latestWorkflowInfo: typeof workflowInfo;
      for (let index = 0; index < REFRESH_WORKFLOW_MAX_RETRY_TIMES; index++) {
        latestWorkflowInfo = await refreshWorkflowInfoAsync();
        const workflowDescMatched =
          expectedDesc === undefined ||
          (latestWorkflowInfo?.desc ?? '') === expectedDesc;
        const workflowStatusUpdated =
          latestWorkflowInfo?.record?.status !==
          WorkflowRecordResV2StatusEnum.rejected;
        if (workflowDescMatched && workflowStatusUpdated) {
          return latestWorkflowInfo;
        }
        await sleep(REFRESH_WORKFLOW_RETRY_INTERVAL);
      }
      return latestWorkflowInfo;
    },
    [refreshWorkflowInfoAsync]
  );

  const initLoading = useMemo(
    () => (polling ? false : getTaskInfosLoading || getWorkflowLoading),
    [getTaskInfosLoading, getWorkflowLoading, polling]
  );

  useEffect(() => {
    refreshTask();
  }, [refreshTask]);

  return {
    taskInfos,
    workflowInfo,
    refreshTask,
    refreshWorkflowInfo,
    refreshWorkflowInfoAsync,
    refreshWorkflowInfoUntilUpdated,
    initLoading
  };
};

export default useInitDataWithRequest;
