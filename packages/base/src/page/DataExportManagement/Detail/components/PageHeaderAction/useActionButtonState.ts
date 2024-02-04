import useDataExportDetailReduxManage from '../../hooks/index.redux';
import useExportDetailAction from '../../hooks/useExportDetailAction';
import { useMemo } from 'react';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { MessageInstance } from 'antd/es/message/interface';

type ActionMeta = {
  action: () => void;
  loading: boolean;
  hidden: boolean;
};

const useActionButtonState: (messageApi: MessageInstance) => {
  closeWorkflowButtonMeta: ActionMeta;
  approveWorkflowButtonMeta: ActionMeta;
  rejectWorkflowButtonMeta: ActionMeta;
  executeExportButtonMeta: ActionMeta;
} = (messageApi) => {
  const { uid } = useCurrentUser();
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
    return currentStep?.assignee_user_list?.some((v) => v.uid === uid);
  }, [currentStep?.assignee_user_list, uid]);

  const closeWorkflowButtonVisibility = useMemo(() => {
    if (!workflowStatus) {
      return false;
    }
    const allowClose = workflowInfo.create_user?.uid === uid;

    return (
      [
        WorkflowRecordStatusEnum.wait_for_approve,
        WorkflowRecordStatusEnum.rejected
      ].includes(workflowStatus) && allowClose
    );
  }, [uid, workflowInfo?.create_user?.uid, workflowStatus]);

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
      workflowInfo.create_user?.uid === uid
    );
  }, [currentStep, uid, workflowInfo?.create_user?.uid, workflowStatus]);

  return {
    closeWorkflowButtonMeta: {
      action: () => closeWorkflow(workflowID),
      hidden: !closeWorkflowButtonVisibility,
      loading: closeWorkflowLoading
    },
    approveWorkflowButtonMeta: {
      action: () => approveWorkflow(workflowID),
      hidden: !approveWorkflowButtonVisibility,
      loading: approveWorkflowLoading
    },
    rejectWorkflowButtonMeta: {
      action: () => updateWorkflowRejectOpen(true),
      hidden: !rejectWorkflowButtonVisibility,
      loading: false
    },
    executeExportButtonMeta: {
      action: () => executeExport(workflowID),
      hidden: !executingButtonVisibility,
      loading: executeExportLoading
    }
  };
};

export default useActionButtonState;
