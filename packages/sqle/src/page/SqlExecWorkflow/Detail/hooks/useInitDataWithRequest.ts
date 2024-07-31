import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const useInitDataWithRequest = () => {
  const urlParams = useParams<{ workflowId: string }>();
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
    loading: getWorkflowLoading,
    cancel
  } = useRequest(
    () =>
      workflow
        .getWorkflowV2({
          project_name: projectName,
          workflow_id: urlParams.workflowId ?? ''
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
    initLoading
  };
};

export default useInitDataWithRequest;
