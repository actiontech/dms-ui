import useDataExportDetailReduxManage from '../../hooks/index.redux';
import useExportDetailAction from '../../hooks/useExportDetailAction';
import { useMemo } from 'react';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import {
  useCurrentUser,
  usePermission,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { MessageInstance } from 'antd/es/message/interface';
import { ActionMeta } from './index.type';

const useActionButtonState: (messageApi: MessageInstance) => {
  closeWorkflowButtonMeta: ActionMeta;
  approveWorkflowButtonMeta: ActionMeta;
  rejectWorkflowButtonMeta: ActionMeta;
  executeExportButtonMeta: ActionMeta;
} = (messageApi) => {
  const { userId } = useCurrentUser();
  const { checkActionDisabledByBWP } = usePermission();
  const isExportApproveBWPDisabled = checkActionDisabledByBWP(
    PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.APPROVE
  );
  const isExportRejectBWPDisabled = checkActionDisabledByBWP(
    PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.REJECT
  );
  const isExportExecuteBWPDisabled = checkActionDisabledByBWP(
    PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.EXECUTE
  );
  const { workflowInfo, updateWorkflowRejectOpen } =
    useDataExportDetailReduxManage();

  const {
    closeWorkflowLoading,
    closeWorkflow,
    approveWorkflowLoading,
    approveWorkflow,
    executeExportLoading,
    executeExport
  } = useExportDetailAction(messageApi);

  const workflowStatus = workflowInfo?.workflow_record?.status;
  const workflowID = workflowInfo?.workflow_uid ?? '';

  //本期这个数据只有 审核 或驳回 步骤
  const currentStep = useMemo(() => {
    return workflowInfo?.workflow_record?.workflow_step_list?.find(
      (v) => v.number === workflowInfo.workflow_record?.current_step_number
    );
  }, [
    workflowInfo?.workflow_record?.workflow_step_list,
    workflowInfo?.workflow_record?.current_step_number
  ]);

  const allowOperateStep = useMemo(() => {
    return currentStep?.assignee_user_list?.some((v) => v.uid === userId);
  }, [currentStep?.assignee_user_list, userId]);

  const closeWorkflowButtonVisibility = useMemo(() => {
    if (!workflowStatus) {
      return false;
    }
    const allowClose = workflowInfo.create_user?.uid === userId;

    return (
      [
        WorkflowRecordStatusEnum.wait_for_approve,
        WorkflowRecordStatusEnum.rejected
      ].includes(workflowStatus) && allowClose
    );
  }, [userId, workflowInfo?.create_user?.uid, workflowStatus]);

  const approveWorkflowButtonVisibility = useMemo(() => {
    if (!workflowStatus || !currentStep) {
      return false;
    }
    return (
      workflowStatus === WorkflowRecordStatusEnum.wait_for_approve &&
      allowOperateStep
    );
  }, [allowOperateStep, currentStep, workflowStatus]);

  const rejectWorkflowButtonVisibility = useMemo(() => {
    if (!workflowStatus || !currentStep) {
      return false;
    }
    return (
      workflowStatus === WorkflowRecordStatusEnum.wait_for_approve &&
      allowOperateStep
    );
  }, [allowOperateStep, currentStep, workflowStatus]);

  const executingButtonVisibility = useMemo(() => {
    if (!workflowStatus || !currentStep) {
      return false;
    }
    return (
      workflowStatus === WorkflowRecordStatusEnum.wait_for_export &&
      workflowInfo.create_user?.uid === userId
    );
  }, [currentStep, userId, workflowInfo?.create_user?.uid, workflowStatus]);

  return {
    closeWorkflowButtonMeta: {
      action: () => closeWorkflow(workflowID),
      hidden: !closeWorkflowButtonVisibility,
      loading: closeWorkflowLoading
    },
    approveWorkflowButtonMeta: {
      action: () => approveWorkflow(workflowID),
      hidden: !approveWorkflowButtonVisibility,
      loading: approveWorkflowLoading,
      disabled: isExportApproveBWPDisabled && !allowOperateStep
    },
    rejectWorkflowButtonMeta: {
      action: () => updateWorkflowRejectOpen(true),
      hidden: !rejectWorkflowButtonVisibility,
      loading: false,
      disabled: isExportRejectBWPDisabled && !allowOperateStep
    },
    executeExportButtonMeta: {
      action: () => executeExport(workflowID),
      hidden: !executingButtonVisibility,
      loading: executeExportLoading,
      disabled: isExportExecuteBWPDisabled && !executingButtonVisibility
    }
  };
};

export default useActionButtonState;
