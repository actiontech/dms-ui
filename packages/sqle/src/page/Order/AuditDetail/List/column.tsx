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
import { t } from '../../../../locale';
import { AvatarCom } from '@actiontech/shared';
import InstanceTasksStatus from '../InstanceTasksStatus';
import { checkTimeInWithMaintenanceTime } from '../../Common/utils';
import dayjs from 'dayjs';

export const auditResultOverviewActions: (params: {
  currentUsername: string;
  sqlTerminateHandle: (taskId: string) => void;
  sqlExecuteHandle: (taskId: string) => void;
  orderStatus?: WorkflowRecordResV2StatusEnum;
  openScheduleModalAndSetCurrentTask: (record: IGetWorkflowTasksItemV2) => void;
  scheduleTimeHandle: (
    scheduleTime?: string,
    is_notify?: boolean,
    notify_type?: UpdateWorkflowScheduleReqV2NotifyTypeEnum,
    taskId?: string
  ) => Promise<void>;
}) => ActiontechTableProps<IGetWorkflowTasksItemV2>['actions'] = ({
  currentUsername,
  sqlTerminateHandle,
  orderStatus,
  sqlExecuteHandle,
  openScheduleModalAndSetCurrentTask,
  scheduleTimeHandle
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
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    if (maintenanceTime.length) {
      return checkTimeInWithMaintenanceTime(dayjs(), maintenanceTime);
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableSqlScheduleTime = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableCancelSqlScheduleTime = (
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum)
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
        text: t('order.operator.terminate'),
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
            title: t('order.operator.terminateConfirmTips'),
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
        text: t('order.auditResultCollection.table.sqlExecute'),
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
            title: t('order.auditResultCollection.table.sqlExecuteConfirmTips'),
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
        permissions(record) {
          return record?.status !== GetWorkflowTasksItemV2StatusEnum.executing;
        }
      },
      {
        key: 'scheduleTime',
        text: t('order.auditResultCollection.table.scheduleTime'),
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
        permissions(record) {
          return record?.status !== GetWorkflowTasksItemV2StatusEnum.executing;
        }
      },
      {
        key: 'cancelExecScheduled',
        text: t('order.auditResultCollection.table.cancelExecScheduled'),
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
            disabled: !enableCancelSqlScheduleTime(record?.status)
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
        title: () => t('order.auditResultCollection.table.instanceName')
      },
      {
        dataIndex: 'status',
        title: () => t('order.auditResultCollection.table.status'),
        render: (status: GetWorkflowTasksItemV2StatusEnum) => (
          <InstanceTasksStatus status={status} />
        )
      },
      {
        dataIndex: 'task_pass_rate',
        title: () => t('order.auditResultCollection.table.passRate'),
        render: (rate = 0) => <span>{`${floatToPercent(rate)}%`}</span>,
        align: 'right'
      },
      {
        dataIndex: 'task_score',
        title: () => t('order.auditResultCollection.table.score'),
        align: 'right'
      },
      {
        dataIndex: 'current_step_assignee_user_name_list',
        title: () => t('order.auditResultCollection.table.assigneeUserName'),
        render: (list: string[]) => {
          return list?.map((v) => {
            return <AvatarCom key={v} name={v} />;
          });
        }
      },
      {
        dataIndex: 'execution_user_name',
        title: () => t('order.auditResultCollection.table.executeUserName')
      },
      {
        dataIndex: 'exec_start_time',
        title: () => t('order.auditResultCollection.table.execStartTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'exec_end_time',
        title: () => t('order.auditResultCollection.table.execEndTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'schedule_time',
        title: () => t('order.auditResultCollection.table.scheduleExecuteTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      }
    ];
  };
