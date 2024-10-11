import {
  IGetWorkflowTasksItemV2,
  IMaintenanceTimeResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  GetWorkflowTasksItemV2StatusEnum,
  UpdateWorkflowScheduleReqV2NotifyTypeEnum,
  WorkflowRecordResV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { AvatarCom } from '@actiontech/shared';
import InstanceTasksStatus from './InstanceTasksStatus';
import dayjs from 'dayjs';
import { checkTimeInWithMaintenanceTime } from '../../../../Common/utils';
import { t } from '../../../../../../locale';

export const auditResultOverviewActions: (params: {
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
  executable: boolean;
}) => ActiontechTableProps<IGetWorkflowTasksItemV2>['actions'] = ({
  currentUsername,
  sqlTerminateHandle,
  workflowStatus,
  sqlExecuteHandle,
  openScheduleModalAndSetCurrentTask,
  scheduleTimeHandle,
  executable
}) => {
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
            danger: true
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
        permissions(record) {
          return record?.status === GetWorkflowTasksItemV2StatusEnum.executing;
        }
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
            )
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
        permissions() {
          return executable;
        }
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
            )
          };
        },
        permissions() {
          return executable;
        }
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
            )
          };
        },
        permissions(record) {
          return (
            record?.status === GetWorkflowTasksItemV2StatusEnum.exec_scheduled
          );
        }
      }
    ]
  };
};

export const auditResultOverviewColumn: () => ActiontechTableColumn<IGetWorkflowTasksItemV2> =
  () => {
    return [
      {
        dataIndex: 'instance_name',
        title: () => t('execWorkflow.detail.overview.table.instanceName')
      },
      {
        dataIndex: 'status',
        title: () => t('execWorkflow.detail.overview.table.status'),
        render: (status) => <InstanceTasksStatus status={status} />
      },
      {
        dataIndex: 'task_pass_rate',
        title: () => t('execWorkflow.detail.overview.table.passRate'),
        render: (rate = 0) => <span>{`${floatToPercent(rate)}%`}</span>,
        align: 'right'
      },
      {
        dataIndex: 'task_score',
        title: () => t('execWorkflow.detail.overview.table.score'),
        align: 'right'
      },
      {
        dataIndex: 'current_step_assignee_user_name_list',
        title: () => t('execWorkflow.detail.overview.table.assigneeUserName'),
        render: (list) => {
          return list?.map((v) => {
            return <AvatarCom key={v} name={v} />;
          });
        }
      },
      {
        dataIndex: 'execution_user_name',
        title: () => t('execWorkflow.detail.overview.table.executeUserName')
      },
      {
        dataIndex: 'exec_start_time',
        title: () => t('execWorkflow.detail.overview.table.execStartTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'exec_end_time',
        title: () => t('execWorkflow.detail.overview.table.execEndTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'schedule_time',
        title: () =>
          t('execWorkflow.detail.overview.table.scheduleExecuteTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      }
    ];
  };
