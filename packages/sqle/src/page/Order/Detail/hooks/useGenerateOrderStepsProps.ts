import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '../../../../data/common';
import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { TasksStatusNumberType } from '../index.type';
import { MaintenanceTimeInfoType } from '../PageHeaderExtra/index.type';

type HooksParamType = {
  workflowId: string;
  refreshOrder: () => void;
  refreshOverviewAction: (value?: boolean | undefined) => void;
  projectName: string;
};

const useGenerateOrderStepsProps = ({
  workflowId,
  refreshOrder,
  refreshOverviewAction,
  projectName
}: HooksParamType) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [tasksStatusNumber, setTasksStatusNumber] =
    useState<TasksStatusNumberType>();

  const [maintenanceTimeInfo, setMaintenanceTimeInfo] =
    useState<MaintenanceTimeInfoType>([]);
  const [canRejectOrder, setCanRejectOrder] = useState(false);

  const pass = useCallback(
    async (stepId: number) => {
      return workflow
        .approveWorkflowV2({
          workflow_id: workflowId,
          workflow_step_id: `${stepId}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('order.operator.approveSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [
      workflowId,
      projectName,
      messageApi,
      t,
      refreshOrder,
      refreshOverviewAction
    ]
  );

  const executing = useCallback(async () => {
    return workflow
      .executeTasksOnWorkflowV2({
        workflow_id: workflowId,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('order.operator.executingTips'));
          refreshOrder();
          refreshOverviewAction();
        }
      });
  }, [
    messageApi,
    projectName,
    refreshOrder,
    refreshOverviewAction,
    t,
    workflowId
  ]);

  const terminate = useCallback(async () => {
    return workflow
      .terminateMultipleTaskByWorkflowV1({
        workflow_id: workflowId,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('order.operator.terminateSuccessTips'));
          refreshOrder();
          refreshOverviewAction();
        }
      });
  }, [
    messageApi,
    projectName,
    refreshOrder,
    refreshOverviewAction,
    t,
    workflowId
  ]);

  const reject = useCallback(
    async (reason: string, stepId: number) => {
      return workflow
        .rejectWorkflowV2({
          project_name: projectName,
          workflow_id: workflowId,
          workflow_step_id: `${stepId}`,
          reason
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('order.operator.rejectSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [
      messageApi,
      projectName,
      refreshOrder,
      refreshOverviewAction,
      t,
      workflowId
    ]
  );

  const complete = useCallback(async () => {
    return workflow
      .batchCompleteWorkflowsV2({
        workflow_id_list: [workflowId],
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('order.operator.completeSuccessTips'));
          refreshOrder();
          refreshOverviewAction();
        }
      });
  }, [
    messageApi,
    projectName,
    refreshOrder,
    refreshOverviewAction,
    t,
    workflowId
  ]);

  const getOverviewListSuccessHandle = (list: IGetWorkflowTasksItemV2[]) => {
    setMaintenanceTimeInfo?.(
      list.map((v) => ({
        instanceName: v.instance_name ?? '',
        maintenanceTime: v.instance_maintenance_times ?? []
      }))
    );

    const canRejectOrder = list.every(
      (v) =>
        !!v.status &&
        ![
          GetWorkflowTasksItemV2StatusEnum.exec_succeeded,
          GetWorkflowTasksItemV2StatusEnum.executing,
          GetWorkflowTasksItemV2StatusEnum.exec_failed,
          GetWorkflowTasksItemV2StatusEnum.exec_scheduled
        ].includes(v.status)
    );
    setCanRejectOrder(canRejectOrder);
    let succeededNumber = 0,
      executingNumber = 0,
      failedNumber = 0;
    list.forEach((v) => {
      if (v.status === GetWorkflowTasksItemV2StatusEnum.exec_succeeded) {
        succeededNumber++;
      } else if (v.status === GetWorkflowTasksItemV2StatusEnum.executing) {
        executingNumber++;
      } else if (v.status === GetWorkflowTasksItemV2StatusEnum.exec_failed) {
        failedNumber++;
      }
    });
    setTasksStatusNumber({
      failed: failedNumber,
      success: succeededNumber,
      executing: executingNumber
    });
  };

  return {
    pass,
    executing,
    reject,
    maintenanceTimeInfo,
    canRejectOrder,
    tasksStatusNumber,
    getOverviewListSuccessHandle,
    complete,
    terminate,
    messageContextHolder
  };
};

export default useGenerateOrderStepsProps;
