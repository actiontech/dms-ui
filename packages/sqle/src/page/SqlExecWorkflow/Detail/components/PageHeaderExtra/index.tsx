import { BasicButton, EmptyBox, BasicToolTips } from '@actiontech/shared';
import { Divider, Popconfirm, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { WorkflowPageHeaderExtraStyleWrapper } from './style';
import { WorkflowDetailPageHeaderExtraProps } from './index.type';
import useWorkflowDetailAction from './hooks/useWorkflowDetailAction';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import RejectWorkflowModal from './RejectWorkflowModal';
import { useMemo } from 'react';
import { OpPermissionTypeUid } from '@actiontech/shared/lib/enum';

const WorkflowDetailPageHeaderExtra: React.FC<
  WorkflowDetailPageHeaderExtraProps
> = (props) => {
  const { t } = useTranslation();

  const { projectArchive, projectName } = useCurrentProject();

  const { managementPermissions, isProjectManager } = useCurrentUser();

  const isAllowExecuteInOtherInstance = useMemo(() => {
    return (
      isProjectManager(projectName) ||
      managementPermissions.some(
        (v) => OpPermissionTypeUid['create_workflow'] === (v?.uid ?? '')
      )
    );
  }, [managementPermissions, isProjectManager, projectName]);

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
    executable,
    executable_reason
  } = useWorkflowDetailAction({ projectName, ...props });

  return (
    <WorkflowPageHeaderExtraStyleWrapper>
      {messageContextHolder}

      <div hidden={closeWorkflowButtonMeta.hidden}>
        <Popconfirm
          title={t('execWorkflow.detail.operator.closeConfirm')}
          onConfirm={() => closeWorkflowButtonMeta.action()}
          disabled={closeWorkflowButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            disabled={closeWorkflowButtonMeta.loading}
            loading={closeWorkflowButtonMeta.loading}
            danger
          >
            {t('execWorkflow.detail.operator.closeWorkflow')}
          </BasicButton>
        </Popconfirm>

        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />
      </div>

      <EmptyBox if={!projectArchive}>
        <EmptyBox if={isAllowExecuteInOtherInstance}>
          <BasicButton
            onClick={() => executeInOtherInstanceMeta.action()}
            loading={executeInOtherInstanceMeta.loading}
          >
            {t('execWorkflow.detail.operator.cloneExecWorkflow')}
          </BasicButton>
        </EmptyBox>
        <BasicButton
          hidden={rejectWorkflowButtonMeta.hidden}
          onClick={openRejectModal}
        >
          {t('execWorkflow.detail.operator.rejectFull')}
        </BasicButton>
        <BasicButton
          hidden={auditPassWorkflowButtonMeta.hidden}
          disabled={auditPassWorkflowButtonMeta.loading}
          loading={auditPassWorkflowButtonMeta.loading}
          onClick={() => auditPassWorkflowButtonMeta.action()}
          type="primary"
        >
          {t('execWorkflow.detail.operator.sqlReview')}
        </BasicButton>

        <Popconfirm
          title={t('execWorkflow.detail.operator.batchSqlExecuteConfirmTips')}
          onConfirm={() => batchExecutingWorkflowButtonMeta.action()}
          disabled={batchExecutingWorkflowButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={batchExecutingWorkflowButtonMeta.hidden || !executable}
            disabled={batchExecutingWorkflowButtonMeta.loading}
            loading={batchExecutingWorkflowButtonMeta.loading}
            type="primary"
          >
            {t('execWorkflow.detail.operator.batchSqlExecute')}
          </BasicButton>
        </Popconfirm>

        <Popconfirm
          title={t('execWorkflow.detail.operator.markManuallyConfirmTips')}
          onConfirm={() => manualExecuteWorkflowButtonMeta.action()}
          disabled={manualExecuteWorkflowButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={manualExecuteWorkflowButtonMeta.hidden || !executable}
            disabled={manualExecuteWorkflowButtonMeta.loading}
            loading={manualExecuteWorkflowButtonMeta.loading}
            type="primary"
          >
            {t('execWorkflow.detail.operator.markManually')}
          </BasicButton>
        </Popconfirm>

        <EmptyBox
          if={
            !manualExecuteWorkflowButtonMeta.hidden &&
            !batchExecutingWorkflowButtonMeta.hidden &&
            !executable
          }
        >
          <BasicToolTips
            title={executable_reason}
            overlayClassName="whitespace-pre-line"
          >
            <BasicButton disabled type="primary">
              {t('execWorkflow.detail.operator.batchSqlExecute')}
            </BasicButton>
            <BasicButton disabled type="primary">
              {t('execWorkflow.detail.operator.markManually')}
            </BasicButton>
          </BasicToolTips>
        </EmptyBox>
      </EmptyBox>

      <Space hidden={terminateWorkflowButtonMeta.hidden} size={0}>
        <EmptyBox if={!projectArchive}>
          <Popconfirm
            title={t('execWorkflow.detail.operator.terminateConfirmTips')}
            onConfirm={() => terminateWorkflowButtonMeta.action()}
            disabled={terminateWorkflowButtonMeta.loading}
            overlayClassName="popconfirm-small"
            okText={t('common.ok')}
          >
            <BasicButton
              disabled={terminateWorkflowButtonMeta.loading}
              loading={terminateWorkflowButtonMeta.loading}
              danger
            >
              {t('execWorkflow.detail.operator.terminate')}
            </BasicButton>
          </Popconfirm>
        </EmptyBox>

        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />

        <BasicButton onClick={props.refreshWorkflow}>
          {t('execWorkflow.detail.operator.refreshWorkflow')}
        </BasicButton>
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
