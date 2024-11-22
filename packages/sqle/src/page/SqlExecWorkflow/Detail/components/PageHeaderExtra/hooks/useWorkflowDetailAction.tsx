import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import dayjs, { Dayjs } from 'dayjs';
import {
  WorkflowDetailActionMeta,
  WorkflowDetailPageHeaderExtraProps
} from '../index.type';
import { checkTimeInWithMaintenanceTime } from '../../../../Common/utils';

const useWorkflowDetailAction = ({
  projectName,
  workflowInfo,
  refreshWorkflow,
  passAction,
  rejectAction,
  canRejectWorkflow,
  executingAction,
  terminateAction,
  completeAction,
  maintenanceTimeInfo,
  executeInOtherInstanceAction,
  startRollback,
  showModifySqlStatementStep
}: WorkflowDetailPageHeaderExtraProps & {
  projectName: string;
}): {
  messageContextHolder: ReturnType<typeof message.useMessage>[1];
  closeWorkflowButtonMeta: WorkflowDetailActionMeta;
  auditPassWorkflowButtonMeta: WorkflowDetailActionMeta;
  rejectWorkflowButtonMeta: WorkflowDetailActionMeta;
  batchExecutingWorkflowButtonMeta: WorkflowDetailActionMeta;
  manualExecuteWorkflowButtonMeta: WorkflowDetailActionMeta;
  terminateWorkflowButtonMeta: WorkflowDetailActionMeta;
  executeInOtherInstanceMeta: WorkflowDetailActionMeta;
  rollbackWorkflowButtonMeta: WorkflowDetailActionMeta;
  retryWorkflowButtonMeta: WorkflowDetailActionMeta;
  executable?: boolean;
  executable_reason?: string;
} => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { username } = useCurrentUser();

  const currentStep = useMemo(() => {
    return workflowInfo?.record?.workflow_step_list?.find(
      (v) => v.number === workflowInfo.record?.current_step_number
    );
  }, [
    workflowInfo?.record?.current_step_number,
    workflowInfo?.record?.workflow_step_list
  ]);

  const closeWorkflowButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status) {
      return false;
    }
    return [
      WorkflowRecordResV2StatusEnum.wait_for_audit,
      WorkflowRecordResV2StatusEnum.wait_for_execution,
      WorkflowRecordResV2StatusEnum.rejected
    ].includes(workflowInfo?.record?.status);
  }, [workflowInfo?.record?.status]);

  const [
    closeWorkflowLoading,
    { setTrue: startCloseWorkflow, setFalse: closeWorkflowFinish }
  ] = useBoolean();

  const closeWorkflow = useCallback(() => {
    if (!closeWorkflowButtonVisibility) {
      return;
    }
    startCloseWorkflow();
    return workflow
      .cancelWorkflowV2({
        project_name: projectName,
        workflow_id: `${workflowInfo?.workflow_id ?? ''}`
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refreshWorkflow();
          messageApi.success(
            t('execWorkflow.detail.operator.closeWorkflowSuccessTips')
          );
        }
      })
      .finally(() => {
        closeWorkflowFinish();
      });
  }, [
    closeWorkflowButtonVisibility,
    closeWorkflowFinish,
    messageApi,
    workflowInfo?.workflow_id,
    projectName,
    refreshWorkflow,
    startCloseWorkflow,
    t
  ]);

  const auditWorkflowButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status || !currentStep) {
      return false;
    }
    return (
      workflowInfo.record.status ===
        WorkflowRecordResV2StatusEnum.wait_for_audit &&
      currentStep.assignee_user_name_list?.includes(username)
    );
  }, [currentStep, workflowInfo?.record?.status, username]);

  const [passLoading, { setTrue: passStart, setFalse: passFinish }] =
    useBoolean();

  const auditPassWorkflow = useCallback(() => {
    if (!auditWorkflowButtonVisibility && currentStep) {
      return;
    }
    passStart();
    return passAction(currentStep?.workflow_step_id!).finally(passFinish);
  }, [
    auditWorkflowButtonVisibility,
    currentStep,
    passAction,
    passFinish,
    passStart
  ]);

  const [rejectLoading, { setTrue: rejectStart, setFalse: rejectFinish }] =
    useBoolean();

  const rejectWorkflowButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status || !currentStep) {
      return false;
    }

    return (
      [
        WorkflowRecordResV2StatusEnum.wait_for_execution,
        WorkflowRecordResV2StatusEnum.wait_for_audit
      ].includes(workflowInfo.record.status) &&
      canRejectWorkflow &&
      currentStep.assignee_user_name_list?.includes(username)
    );
  }, [canRejectWorkflow, currentStep, workflowInfo?.record?.status, username]);

  const rejectWorkflow = useCallback(
    (reason?: string) => {
      if (!rejectWorkflowButtonVisibility || !reason) {
        return;
      }
      rejectStart();
      return rejectAction(reason, currentStep?.workflow_step_id!).finally(
        rejectFinish
      );
    },
    [
      rejectWorkflowButtonVisibility,
      currentStep,
      rejectAction,
      rejectFinish,
      rejectStart
    ]
  );

  const checkInTimeWithMaintenanceTimeInfo = useCallback(
    (time: Dayjs) => {
      return maintenanceTimeInfo?.every((v) =>
        checkTimeInWithMaintenanceTime(time, v.maintenanceTime)
      );
    },
    [maintenanceTimeInfo]
  );

  const [
    executingLoading,
    { setTrue: executingStart, setFalse: executingFinish }
  ] = useBoolean();

  const executingButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status || !currentStep) {
      return false;
    }
    return (
      workflowInfo.record.status ===
        WorkflowRecordResV2StatusEnum.wait_for_execution &&
      currentStep.assignee_user_name_list?.includes(username) &&
      checkInTimeWithMaintenanceTimeInfo(dayjs())
    );
  }, [
    checkInTimeWithMaintenanceTimeInfo,
    currentStep,
    workflowInfo?.record?.status,
    username
  ]);

  const executingWorkflow = () => {
    if (!executingButtonVisibility) {
      return;
    }
    executingStart();
    return executingAction().finally(() => {
      executingFinish();
    });
  };

  const [
    completeLoading,
    { setTrue: completeStart, setFalse: completeFinish }
  ] = useBoolean();

  const completeWorkflow = () => {
    if (!executingButtonVisibility) {
      return;
    }
    completeStart();
    return completeAction().finally(() => {
      completeFinish();
    });
  };

  const terminateButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status) {
      return false;
    }

    return (
      workflowInfo.record.status === WorkflowRecordResV2StatusEnum.executing &&
      workflowInfo.record.workflow_step_list
        ?.find((v) => v.type === WorkflowStepResV2TypeEnum.sql_execute)
        ?.assignee_user_name_list?.includes(username)
    );
  }, [
    workflowInfo?.record?.status,
    workflowInfo?.record?.workflow_step_list,
    username
  ]);
  const [
    terminateLoading,
    { setTrue: terminateStart, setFalse: terminateFinish }
  ] = useBoolean();

  const terminateWorkflow = () => {
    terminateStart();
    return terminateAction().finally(terminateFinish);
  };

  const [
    executeInOtherInstanceLoading,
    {
      setTrue: executeInOtherInstanceStart,
      setFalse: executeInOtherInstanceFinish
    }
  ] = useBoolean();

  const executeInOtherInstance = () => {
    executeInOtherInstanceStart();
    return executeInOtherInstanceAction().finally(executeInOtherInstanceFinish);
  };

  const rollbackButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status) {
      return false;
    }

    return (
      [
        WorkflowRecordResV2StatusEnum.finished,
        WorkflowRecordResV2StatusEnum.exec_failed,
        WorkflowRecordResV2StatusEnum.canceled
      ].includes(workflowInfo.record.status) &&
      workflowInfo.record.workflow_step_list
        ?.find((v) => v.type === WorkflowStepResV2TypeEnum.sql_execute)
        ?.assignee_user_name_list?.includes(username)
    );
  }, [
    workflowInfo?.record?.status,
    username,
    workflowInfo?.record?.workflow_step_list
  ]);

  const rollbackWorkflow = () => {
    startRollback();
    return undefined;
  };

  const retryButtonVisibility = useMemo(() => {
    if (!workflowInfo?.record?.status) {
      return false;
    }
    return (
      workflowInfo.record.status === WorkflowRecordResV2StatusEnum.exec_failed
    );
  }, [workflowInfo?.record?.status]);

  const retryWorkflow = () => {
    showModifySqlStatementStep();
    return undefined;
  };

  return {
    messageContextHolder,

    closeWorkflowButtonMeta: {
      action: closeWorkflow,
      loading: closeWorkflowLoading,
      hidden: !closeWorkflowButtonVisibility
    },
    auditPassWorkflowButtonMeta: {
      action: auditPassWorkflow,
      loading: passLoading,
      hidden: !auditWorkflowButtonVisibility
    },
    rejectWorkflowButtonMeta: {
      action: rejectWorkflow,
      loading: rejectLoading,
      hidden: !rejectWorkflowButtonVisibility
    },
    batchExecutingWorkflowButtonMeta: {
      action: executingWorkflow,
      loading: executingLoading,
      hidden: !executingButtonVisibility
    },
    manualExecuteWorkflowButtonMeta: {
      action: completeWorkflow,
      loading: completeLoading,
      hidden: !executingButtonVisibility
    },
    terminateWorkflowButtonMeta: {
      action: terminateWorkflow,
      loading: terminateLoading,
      hidden: !terminateButtonVisibility
    },
    executeInOtherInstanceMeta: {
      action: executeInOtherInstance,
      loading: executeInOtherInstanceLoading,
      hidden: false
    },
    rollbackWorkflowButtonMeta: {
      action: rollbackWorkflow,
      loading: false,
      hidden: !rollbackButtonVisibility
    },
    retryWorkflowButtonMeta: {
      action: retryWorkflow,
      loading: false,
      hidden: !retryButtonVisibility
    },

    executable: workflowInfo?.record?.executable,
    executable_reason: workflowInfo?.record?.executable_reason
  };
};

export default useWorkflowDetailAction;
