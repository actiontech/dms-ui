import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  IExecuteOneTaskOnWorkflowV2Params,
  ITerminateSingleTaskByWorkflowV1Params,
  IUpdateWorkflowScheduleV2Params
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import useMessage from 'antd/es/message/useMessage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WorkflowOverviewListActionsParams } from '../OverviewList/index.type';

const useOverviewActions = ({
  projectName,
  workflowId,
  refreshOverview,
  refreshWorkflow
}: WorkflowOverviewListActionsParams) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = useMessage();

  const [currentTask, setCurrentTask] =
    useState<IGetWorkflowTasksItemV2 | null>(null);

  const [
    scheduleModalVisible,
    { setTrue: openScheduleModal, setFalse: closeScheduleModal }
  ] = useBoolean();

  const sqlExecuteHandle = (taskId: string) => {
    const param: IExecuteOneTaskOnWorkflowV2Params = {
      workflow_id: workflowId ?? '',
      task_id: taskId,
      project_name: projectName
    };
    workflow.executeOneTaskOnWorkflowV2(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          t('execWorkflow.common.workflowStatus.execSucceeded')
        );
        refreshOverview();
        refreshWorkflow?.();
      }
    });
  };

  const sqlTerminateHandle = (taskId: string) => {
    const param: ITerminateSingleTaskByWorkflowV1Params = {
      workflow_id: workflowId ?? '',
      task_id: taskId,
      project_name: projectName
    };
    workflow.terminateSingleTaskByWorkflowV1(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          t('execWorkflow.detail.operator.terminateSuccessTips')
        );
        refreshOverview();
        refreshWorkflow?.();
      }
    });
  };

  const scheduleTimeHandle = (
    scheduleTime?: string,
    isNotify?: boolean,
    notifyType?: UpdateWorkflowScheduleReqV2NotifyTypeEnum,
    taskId = currentTask?.task_id?.toString()
  ) => {
    const param: IUpdateWorkflowScheduleV2Params = {
      workflow_id: workflowId ?? '',
      task_id: taskId ?? '',
      schedule_time: scheduleTime,
      project_name: projectName,
      is_notify: isNotify,
      notify_type: notifyType
    };
    return workflow.updateWorkflowScheduleV2(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          scheduleTime
            ? t('execWorkflow.detail.operator.execScheduleTips')
            : t('execWorkflow.detail.overview.table.cancelExecScheduledTips')
        );
        refreshOverview();
        refreshWorkflow?.();
      }
    });
  };

  const openScheduleModalAndSetCurrentTask = (
    record: IGetWorkflowTasksItemV2
  ) => {
    openScheduleModal();
    setCurrentTask(record);
  };

  return {
    contextHolder,
    scheduleModalVisible,
    closeScheduleModal,
    sqlExecuteHandle,
    sqlTerminateHandle,
    scheduleTimeHandle,
    openScheduleModalAndSetCurrentTask,
    currentTask
  };
};

export default useOverviewActions;
