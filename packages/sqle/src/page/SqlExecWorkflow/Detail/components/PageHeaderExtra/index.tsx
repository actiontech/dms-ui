import { EmptyBox } from '@actiontech/dms-kit';
import { Divider, Space, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { WorkflowPageHeaderExtraStyleWrapper } from './style';
import { WorkflowDetailPageHeaderExtraProps } from './index.type';
import useWorkflowDetailAction from './hooks/useWorkflowDetailAction';
import {
  useCurrentProject,
  usePermission,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
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
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { ActionButton } from '@actiontech/shared';
import { useMedia } from '@actiontech/shared';
import classNames from 'classnames';

const WorkflowDetailPageHeaderExtra: React.FC<
  WorkflowDetailPageHeaderExtraProps
> = (props) => {
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  const { projectName } = useCurrentProject();
  const { checkActionPermission } = usePermission();
  const { isMobile } = useMedia();
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

  // 移动端菜单项
  const mobileMenuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [];

    // 主要操作组
    const mainActions: MenuProps['items'] = [];

    // 审核通过
    if (
      !auditPassWorkflowButtonMeta.hidden &&
      checkActionPermission(PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.APPROVE)
    ) {
      mainActions.push({
        key: 'approve',
        label: t('execWorkflow.detail.operator.sqlReview'),
        disabled: auditPassWorkflowButtonMeta.loading,
        onClick: () => auditPassWorkflowButtonMeta.action()
      });
    }

    // 批量执行
    if (
      !batchExecutingWorkflowButtonMeta.hidden &&
      checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_EXEC
      )
    ) {
      mainActions.push({
        key: 'batch-exec',
        label: t('execWorkflow.detail.operator.batchSqlExecute'),
        disabled: batchExecutingWorkflowButtonMeta.loading || !executable,
        onClick: () => {
          if (executable) {
            modal.confirm({
              title: t(
                'execWorkflow.detail.operator.batchSqlExecuteConfirmTips'
              ),
              onOk: () => batchExecutingWorkflowButtonMeta.action()
            });
          }
        }
      });
    }

    // 标记为人工上线
    if (
      !manualExecuteWorkflowButtonMeta.hidden &&
      checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.MANUALLY_EXEC
      )
    ) {
      const manualExecExecutable =
        props.workflowInfo?.record?.status ===
          WorkflowRecordResV2StatusEnum.exec_failed || executable;
      mainActions.push({
        key: 'manual-exec',
        label: t('execWorkflow.detail.operator.markManually'),
        disabled:
          manualExecuteWorkflowButtonMeta.loading || !manualExecExecutable,
        onClick: () => {
          if (manualExecExecutable) {
            modal.confirm({
              title: t('execWorkflow.detail.operator.markManuallyConfirmTips'),
              onOk: () => manualExecuteWorkflowButtonMeta.action()
            });
          }
        }
      });
    }

    if (mainActions.length > 0) {
      items.push(...mainActions);
    }

    // 常规操作组
    const regularActions: MenuProps['items'] = [];

    // 更新审核结果
    if (
      !retryWorkflowButtonMeta.hidden &&
      checkActionPermission(PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.RETRY)
    ) {
      regularActions.push({
        key: 'retry',
        label: t('execWorkflow.create.auditResult.updateInfo'),
        disabled: retryWorkflowButtonMeta.loading,
        onClick: () => retryWorkflowButtonMeta.action()
      });
    }

    // 克隆工单
    if (
      checkActionPermission(PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLONE)
    ) {
      regularActions.push({
        key: 'clone',
        label: t('execWorkflow.detail.operator.cloneExecWorkflow'),
        disabled: executeInOtherInstanceMeta.loading,
        onClick: () => executeInOtherInstanceMeta.action()
      });
    }

    // 回滚（企业版）
    //#if [ee]
    if (
      !rollbackWorkflowButtonMeta.hidden &&
      checkActionPermission(PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.ROLLBACK)
    ) {
      regularActions.push({
        key: 'rollback',
        label: t('execWorkflow.detail.operator.rollback'),
        disabled: rollbackWorkflowButtonMeta.loading,
        onClick: () => rollbackWorkflowButtonMeta.action()
      });
    }
    //#endif */

    if (regularActions.length > 0) {
      if (items.length > 0) {
        items.push({ type: 'divider' });
      }
      items.push(...regularActions);
    }

    // 危险操作组
    const dangerActions: MenuProps['items'] = [];

    // 驳回
    if (
      !rejectWorkflowButtonMeta.hidden &&
      checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_REJECT
      )
    ) {
      dangerActions.push({
        key: 'reject',
        label: t('execWorkflow.detail.operator.rejectFull'),
        onClick: openRejectModal
      });
    }

    // 终止
    if (
      !terminateWorkflowButtonMeta.hidden &&
      checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC
      )
    ) {
      dangerActions.push({
        key: 'terminate',
        label: t('execWorkflow.detail.operator.terminate'),
        danger: true,
        disabled: terminateWorkflowButtonMeta.loading,
        onClick: () => {
          modal.confirm({
            title: t('execWorkflow.detail.operator.terminateConfirmTips'),
            onOk: () => terminateWorkflowButtonMeta.action()
          });
        }
      });
    }

    // 关闭工单
    if (
      !closeWorkflowButtonMeta.hidden &&
      checkActionPermission(PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLOSE)
    ) {
      dangerActions.push({
        key: 'close',
        label: t('execWorkflow.detail.operator.closeWorkflow'),
        danger: true,
        disabled: closeWorkflowButtonMeta.loading,
        onClick: () => {
          modal.confirm({
            title: t('execWorkflow.detail.operator.closeConfirm'),
            onOk: () => closeWorkflowButtonMeta.action()
          });
        }
      });
    }

    if (dangerActions.length > 0) {
      if (items.length > 0) {
        items.push({ type: 'divider' });
      }
      items.push(...dangerActions);
    }

    return items;
  }, [
    t,
    auditPassWorkflowButtonMeta,
    batchExecutingWorkflowButtonMeta,
    manualExecuteWorkflowButtonMeta,
    retryWorkflowButtonMeta,
    executeInOtherInstanceMeta,
    rollbackWorkflowButtonMeta,
    rejectWorkflowButtonMeta,
    terminateWorkflowButtonMeta,
    closeWorkflowButtonMeta,
    executable,
    props.workflowInfo,
    openRejectModal,
    checkActionPermission,
    modal
  ]);

  return (
    <WorkflowPageHeaderExtraStyleWrapper
      className={classNames({
        'mobile-workflow-detail-page-header-extra-wrapper': isMobile
      })}
    >
      {messageContextHolder}
      {contextHolder}
      <EmptyBox
        if={isMobile}
        defaultNode={
          <>
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
            {BatchRejectWorkflowAction(
              rejectWorkflowButtonMeta,
              openRejectModal
            )}
            {ApproveWorkflowAction(auditPassWorkflowButtonMeta)}
            {BatchExecWorkflowAction(
              batchExecutingWorkflowButtonMeta,
              executable,
              executable_reason
            )}
            {MarkManuallyExecWorkflowAction(
              manualExecuteWorkflowButtonMeta,
              props.workflowInfo?.record?.status ===
                WorkflowRecordResV2StatusEnum.exec_failed || executable,
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
          </>
        }
      >
        <>
          {mobileMenuItems.length > 0 && (
            <Dropdown
              menu={{ items: mobileMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <ActionButton
                text={t('execWorkflow.detail.operator.moreActions')}
              />
            </Dropdown>
          )}

          <div
            className="toggle-workflow-detail-wrapper"
            hidden={props.workflowStepsVisibility}
            onClick={props.showWorkflowSteps}
          >
            {t('execWorkflow.detail.operator.buttonText')}
          </div>
        </>
      </EmptyBox>
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
