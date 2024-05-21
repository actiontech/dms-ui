import { BasicButton, EmptyBox } from '@actiontech/shared';
import { Divider, Popconfirm, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { WorkflowPageHeaderExtraStyleWrapper } from './style';
import { WorkflowDetailPageHeaderExtraProps } from './index.type';
import useWorkflowDetailAction from './hooks/useWorkflowDetailAction';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import RejectWorkflowModal from './RejectWorkflowModal';

const WorkflowDetailPageHeaderExtra: React.FC<
  WorkflowDetailPageHeaderExtraProps
> = (props) => {
  const { t } = useTranslation();

  const { projectArchive, projectName } = useCurrentProject();

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
    terminateWorkflowButtonMeta
  } = useWorkflowDetailAction({ projectName, ...props });

  return (
    <WorkflowPageHeaderExtraStyleWrapper>
      {messageContextHolder}

      <div hidden={closeWorkflowButtonMeta.hidden}>
        <BasicButton
          disabled={closeWorkflowButtonMeta.loading}
          loading={closeWorkflowButtonMeta.loading}
          danger
          onClick={() => closeWorkflowButtonMeta.action()}
        >
          {t('order.closeOrder.button')}
        </BasicButton>

        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />
      </div>

      <EmptyBox if={!projectArchive}>
        <BasicButton
          hidden={rejectWorkflowButtonMeta.hidden}
          onClick={openRejectModal}
        >
          {t('order.operator.rejectFull')}
        </BasicButton>
        <BasicButton
          hidden={auditPassWorkflowButtonMeta.hidden}
          disabled={auditPassWorkflowButtonMeta.loading}
          loading={auditPassWorkflowButtonMeta.loading}
          onClick={() => auditPassWorkflowButtonMeta.action()}
          type="primary"
        >
          {t('order.operator.sqlReview')}
        </BasicButton>

        <Popconfirm
          title={t('order.operator.batchSqlExecuteConfirmTips')}
          onConfirm={() => batchExecutingWorkflowButtonMeta.action()}
          disabled={batchExecutingWorkflowButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={batchExecutingWorkflowButtonMeta.hidden}
            disabled={batchExecutingWorkflowButtonMeta.loading}
            loading={batchExecutingWorkflowButtonMeta.loading}
            type="primary"
          >
            {t('order.operator.batchSqlExecute')}
          </BasicButton>
        </Popconfirm>

        <Popconfirm
          title={t('order.operator.markManuallyConfirmTips')}
          onConfirm={() => manualExecuteWorkflowButtonMeta.action()}
          disabled={manualExecuteWorkflowButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={manualExecuteWorkflowButtonMeta.hidden}
            disabled={manualExecuteWorkflowButtonMeta.loading}
            loading={manualExecuteWorkflowButtonMeta.loading}
            type="primary"
          >
            {t('order.operator.markManually')}
          </BasicButton>
        </Popconfirm>
      </EmptyBox>

      <Space hidden={terminateWorkflowButtonMeta.hidden} size={0}>
        <EmptyBox if={!projectArchive}>
          <Popconfirm
            title={t('order.operator.terminateConfirmTips')}
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
              {t('order.operator.terminate')}
            </BasicButton>
          </Popconfirm>
        </EmptyBox>

        <Divider
          type="vertical"
          className="workflow-detail-page-header-divider"
        />

        <BasicButton onClick={props.refreshWorkflow}>
          {t('order.operator.refreshOrder')}
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
        {t('order.pageTitle')}
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
