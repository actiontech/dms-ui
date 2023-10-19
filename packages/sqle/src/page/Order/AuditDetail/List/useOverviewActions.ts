import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  IExecuteOneTaskOnWorkflowV2Params,
  ITerminateSingleTaskByWorkflowV1Params,
  IUpdateWorkflowScheduleV2Params
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import useMessage from 'antd5/es/message/useMessage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderDetailAuditResultListActionsParams } from './index.type';

const useOverviewActions = ({
  projectName,
  workflowID,
  refreshOverview,
  refreshOrder
}: OrderDetailAuditResultListActionsParams) => {
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
      workflow_id: workflowID ?? '',
      task_id: taskId,
      project_name: projectName
    };
    workflow.executeOneTaskOnWorkflowV2(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('order.status.finished'));
        refreshOverview();
        refreshOrder?.();
      }
    });
  };

  const sqlTerminateHandle = (taskId: string) => {
    const param: ITerminateSingleTaskByWorkflowV1Params = {
      workflow_id: workflowID ?? '',
      task_id: taskId,
      project_name: projectName
    };
    workflow.terminateSingleTaskByWorkflowV1(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('order.operator.terminateSuccessTips'));
        refreshOverview();
        refreshOrder?.();
      }
    });
  };

  const scheduleTimeHandle = (
    scheduleTime?: string,
    taskId = currentTask?.task_id?.toString()
  ) => {
    const param: IUpdateWorkflowScheduleV2Params = {
      workflow_id: workflowID ?? '',
      task_id: taskId ?? '',
      schedule_time: scheduleTime,
      project_name: projectName
    };
    return workflow.updateWorkflowScheduleV2(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          scheduleTime
            ? t('order.operator.execScheduleTips')
            : t('order.auditResultCollection.table.cancelExecScheduledTips')
        );
        refreshOverview();
        refreshOrder?.();
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
