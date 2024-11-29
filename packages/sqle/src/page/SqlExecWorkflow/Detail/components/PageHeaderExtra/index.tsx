import { EmptyBox } from '@actiontech/shared';
import { Divider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { WorkflowPageHeaderExtraStyleWrapper } from './style';
import { WorkflowDetailPageHeaderExtraProps } from './index.type';
import useWorkflowDetailAction from './hooks/useWorkflowDetailAction';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import RejectWorkflowModal from './RejectWorkflowModal';
import {
  ApproveWorkflowAction,
  BatchExecWorkflowAction,
  BatchRejectWorkflowAction,
  CloneWorkflowAction,
  CloseWorkflowAction,
  MarkManuallyExecWorkflowAction,
  RefreshWorkflowAction,
  TerminateWorkflowAction,
  RollbackWorkflowAction,
  RetryWorkflowAction
} from './action';

const WorkflowDetailPageHeaderExtra: React.FC<
  WorkflowDetailPageHeaderExtraProps
> = (props) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

  const [
    rejectModalVisible,
    { setTrue: openRejectModal, setFalse: closeRejectModal }
  ] = useBoolean();

  const {
    messageContextHolder,
    closeWorkflowButtonMeta,
    auditPassWorkflowButtonMeta,
    rejectWorkflowButtonMeta,
    batchExecutingWorkflowButtonMeta,
    manualExecuteWorkflowButtonMeta,
    terminateWorkflowButtonMeta,
    executeInOtherInstanceMeta,
    rollbackWorkflowButtonMeta,
    retryWorkflowButtonMeta,
    executable,
    executable_reason
  } = useWorkflowDetailAction({ projectName, ...props });

  return (
    <WorkflowPageHeaderExtraStyleWrapper>
      {messageContextHolder}

      <div hidden={closeWorkflowButtonMeta.hidden}>
        {CloseWorkflowAction(closeWorkflowButtonMeta)}

        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />
      </div>
      {RetryWorkflowAction(retryWorkflowButtonMeta)}
      {/* #if [ee] */}
      {RollbackWorkflowAction(rollbackWorkflowButtonMeta)}
      {/* #endif */}
      {CloneWorkflowAction(executeInOtherInstanceMeta)}
      {BatchRejectWorkflowAction(rejectWorkflowButtonMeta, openRejectModal)}
      {ApproveWorkflowAction(auditPassWorkflowButtonMeta)}
      {BatchExecWorkflowAction(
        batchExecutingWorkflowButtonMeta,
        executable,
        executable_reason
      )}
      {MarkManuallyExecWorkflowAction(
        manualExecuteWorkflowButtonMeta,
        executable,
        executable_reason
      )}

      <Space hidden={terminateWorkflowButtonMeta.hidden} size={0}>
        {TerminateWorkflowAction(terminateWorkflowButtonMeta)}

        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />

        {RefreshWorkflowAction(props.refreshWorkflow)}
      </Space>

      <EmptyBox
        if={
          !(
            (rejectWorkflowButtonMeta.hidden &&
              auditPassWorkflowButtonMeta.hidden &&
              batchExecutingWorkflowButtonMeta.hidden &&
              manualExecuteWorkflowButtonMeta.hidden &&
              terminateWorkflowButtonMeta.hidden) ||
            props.workflowStepsVisibility
          )
        }
      >
        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />
      </EmptyBox>

      <div
        className="toggle-workflow-detail-wrapper"
        hidden={props.workflowStepsVisibility}
        onClick={props.showWorkflowSteps}
      >
        {t('execWorkflow.detail.operator.buttonText')}
      </div>

      <RejectWorkflowModal
        open={rejectModalVisible}
        reject={(values) => rejectWorkflowButtonMeta.action(values.reason)}
        loading={rejectWorkflowButtonMeta.loading}
        close={closeRejectModal}
      />
    </WorkflowPageHeaderExtraStyleWrapper>
  );
};

export default WorkflowDetailPageHeaderExtra;
