import {
  IGetWorkflowTasksItemV2,
  IMaintenanceTimeResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  WorkflowRecordResV2StatusEnum,
  UpdateWorkflowScheduleReqV2NotifyTypeEnum,
  GetWorkflowTasksItemV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import dayjs from 'dayjs';
import { checkTimeInWithMaintenanceTime } from '../../../../Common/utils';
import { t } from '../../../../../../locale';

type Params = {
  currentUsername: string;
  sqlTerminateHandle: (taskId: string) => void;
  sqlExecuteHandle: (taskId: string) => void;
  workflowStatus?: WorkflowRecordResV2StatusEnum;
  openScheduleModalAndSetCurrentTask: (record: IGetWorkflowTasksItemV2) => void;
  scheduleTimeHandle: (
    scheduleTime?: string,
    is_notify?: boolean,
    notify_type?: UpdateWorkflowScheduleReqV2NotifyTypeEnum,
    taskId?: string
  ) => Promise<void>;
};

export const AuditResultOverviewListAction = (
  params: Params
): ActiontechTableActionsWithPermissions<IGetWorkflowTasksItemV2> => {
  const {
    currentUsername,
    sqlExecuteHandle,
    sqlTerminateHandle,
    workflowStatus,
    openScheduleModalAndSetCurrentTask,
    scheduleTimeHandle
  } = params;

  const unusableStatus = [
    WorkflowRecordResV2StatusEnum.rejected,
    WorkflowRecordResV2StatusEnum.canceled,
    WorkflowRecordResV2StatusEnum.finished
  ];

  const enableSqlExecute = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum,
    maintenanceTime: IMaintenanceTimeResV1[] = []
  ) => {
    if (
      !status ||
      unusableStatus.includes(
        workflowStatus as WorkflowRecordResV2StatusEnum
      ) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    if (maintenanceTime.length) {
      return (
        checkTimeInWithMaintenanceTime(dayjs(), maintenanceTime) &&
        status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution
      );
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableSqlScheduleTime = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(
        workflowStatus as WorkflowRecordResV2StatusEnum
      ) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableCancelSqlScheduleTime = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(
        workflowStatus as WorkflowRecordResV2StatusEnum
      ) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }
    return status === GetWorkflowTasksItemV2StatusEnum.exec_scheduled;
  };

  return {
    width: 180,
    buttons: [
      {
        key: 'terminate',
        text: t('execWorkflow.detail.operator.terminate'),
        buttonProps(record) {
          return {
            disabled:
              !record?.current_step_assignee_user_name_list?.includes(
                currentUsername
              ),
            danger: true,
            hidden:
              record?.status !== GetWorkflowTasksItemV2StatusEnum.executing
          };
        },
        confirm(record) {
          return {
            title: t('execWorkflow.detail.operator.terminateConfirmTips'),
            placement: 'bottomLeft',
            disabled:
              !record?.current_step_assignee_user_name_list?.includes(
                currentUsername
              ),
            onConfirm: () => {
              sqlTerminateHandle(record?.task_id?.toString() ?? '');
            }
          };
        },
        permissions:
          PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC_TASK
      },
      {
        key: 'sqlExecute',
        text: t('execWorkflow.detail.overview.table.sqlExecute'),
        buttonProps(record) {
          return {
            disabled: !enableSqlExecute(
              record?.current_step_assignee_user_name_list,
              record?.status,
              record?.instance_maintenance_times
            ),
            hidden:
              record?.status === GetWorkflowTasksItemV2StatusEnum.executing
          };
        },
        confirm(record) {
          return {
            title: t(
              'execWorkflow.detail.overview.table.sqlExecuteConfirmTips'
            ),
            placement: 'bottomLeft',
            disabled: !enableSqlExecute(
              record?.current_step_assignee_user_name_list,
              record?.status,
              record?.instance_maintenance_times
            ),
            onConfirm: () => {
              sqlExecuteHandle(record?.task_id?.toString() ?? '');
            }
          };
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXEC_TASK
      },
      {
        key: 'scheduleTime',
        text: t('execWorkflow.detail.overview.table.scheduleTime'),
        buttonProps(record) {
          return {
            onClick: () => {
              openScheduleModalAndSetCurrentTask(record!);
            },
            disabled: !enableSqlScheduleTime(
              record?.current_step_assignee_user_name_list,
              record?.status
            ),
            hidden:
              record?.status === GetWorkflowTasksItemV2StatusEnum.executing
          };
        },
        permissions:
          PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.SCHEDULE_TIME_EXEC_TASK
      },
      {
        key: 'cancelExecScheduled',
        text: t('execWorkflow.detail.overview.table.cancelExecScheduled'),
        buttonProps(record) {
          return {
            onClick: () => {
              scheduleTimeHandle(
                undefined,
                undefined,
                undefined,
                record?.task_id?.toString() ?? ''
              );
            },
            disabled: !enableCancelSqlScheduleTime(
              record?.current_step_assignee_user_name_list,
              record?.status
            ),
            hidden:
              record?.status !== GetWorkflowTasksItemV2StatusEnum.exec_scheduled
          };
        },
        permissions:
          PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW
            .CANCEL_SCHEDULE_TIME_EXEC_TASK
      }
    ]
  };
};
