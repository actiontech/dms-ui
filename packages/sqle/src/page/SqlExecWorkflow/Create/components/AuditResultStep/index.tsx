import BasicInfoWrapper from '../../../Common/BasicInfoWrapper';
import { AuditResultStepProps } from './index.type';
import { BasicButton, PageHeader } from '@actiontech/shared';
import BackToList from '../../../Common/BackToList';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import AuditResultList from '../../../Common/AuditResultList';
import UpdateFormDrawer from './UpdateFormDrawer';
import SubmitWorkflowButton from '../../../Common/SubmitWorkflowButton';
import BatchSwitchBackupStrategyModal from './BatchSwitchBackupStrategyModal';
import { useState, useEffect, useMemo } from 'react';
import useInstance from '../../../../../hooks/useInstance';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { InstanceTipResV1SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const AuditResultStep: React.FC<AuditResultStepProps> = ({
  tasks,
  baseFormValues,
  sqlAuditInfoFormValues,
  isConfirmationRequiredForSubmission,
  submitWorkflowConfirmationMessage,
  hasExceptionAuditRule,
  createAction,
  auditAction,
  updateTaskRecordCount,
  updateTaskAuditRuleExceptionStatus,
  ...sharedStepDetail
}) => {
  const { t } = useTranslation();
  const [creating, { setFalse: finishCreate, setTrue: startCreate }] =
    useBoolean();
  const [
    updateSqlAuditInfoOpen,
    {
      setFalse: closeUpdateSqlAuditInfoDrawer,
      setTrue: openUpdateSqlAuditInfoDrawer
    }
  ] = useBoolean(false);

  const [
    switchBackupPolicyOpen,
    {
      setTrue: openSwitchBackupPolicyModal,
      setFalse: closeSwitchBackupPolicyModal
    }
  ] = useBoolean();

  const [taskID, setTaskID] = useState<string>();

  const [
    currentTaskSupportedBackupPolicies,
    setCurrentTaskSupportedBackupPolicies
  ] = useState<InstanceTipResV1SupportedBackupStrategyEnum[]>();

  const { instanceList, updateInstanceList } = useInstance();

  const { projectName } = useCurrentProject();

  const internalCreateWorkflow = () => {
    startCreate();

    createAction().finally(() => {
      finishCreate();
    });
  };

  const tasksSupportedBackupPolicies = useMemo(() => {
    const policies: {
      [key: number]: InstanceTipResV1SupportedBackupStrategyEnum[] | undefined;
    } = {};
    tasks.forEach((task) => {
      if (task.task_id) {
        policies[task?.task_id] = instanceList.find(
          (i) => i.instance_name === task.instance_name
        )?.supported_backup_strategy;
      }
    });
    return policies;
  }, [instanceList, tasks]);

  const onBatchSwitchBackupPolicy = (
    currentTaskID?: string,
    supportedBackupStrategy?: InstanceTipResV1SupportedBackupStrategyEnum[]
  ) => {
    openSwitchBackupPolicyModal();
    setTaskID(currentTaskID);
    setCurrentTaskSupportedBackupPolicies(supportedBackupStrategy);
  };

  // #if [ee]
  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [projectName, updateInstanceList]);
  // #endif
  return (
    <>
      <PageHeader
        title={<BackToList isAuditing={sharedStepDetail.isAuditing.value} />}
        extra={
          <Space>
            <BasicButton
              onClick={openUpdateSqlAuditInfoDrawer}
              disabled={creating}
            >
              {t('execWorkflow.create.auditResult.updateInfo')}
            </BasicButton>
            <SubmitWorkflowButton
              hasExceptionAuditRule={hasExceptionAuditRule}
              isConfirmationRequiredForSubmission={
                isConfirmationRequiredForSubmission
              }
              loading={creating}
              submitWorkflowConfirmationMessage={
                submitWorkflowConfirmationMessage
              }
              onClick={internalCreateWorkflow}
            />
          </Space>
        }
      />
      <BasicInfoWrapper
        title={baseFormValues?.workflow_subject ?? ''}
        desc={baseFormValues?.desc}
      />

      <AuditResultList
        tasks={tasks}
        updateTaskRecordCount={updateTaskRecordCount}
        allowSwitchBackupPolicy
        onBatchSwitchBackupPolicy={onBatchSwitchBackupPolicy}
        tasksSupportedBackupPolicies={tasksSupportedBackupPolicies}
        updateTaskAuditRuleExceptionStatus={updateTaskAuditRuleExceptionStatus}
      />

      <UpdateFormDrawer
        open={updateSqlAuditInfoOpen}
        onClose={closeUpdateSqlAuditInfoDrawer}
        baseFormValues={baseFormValues}
        sqlAuditInfoFormValues={sqlAuditInfoFormValues}
        auditAction={auditAction}
        {...sharedStepDetail}
      />

      {/* #if [ee] */}
      <BatchSwitchBackupStrategyModal
        open={switchBackupPolicyOpen}
        taskID={taskID}
        onCancel={closeSwitchBackupPolicyModal}
        currentTaskSupportedBackupPolicies={currentTaskSupportedBackupPolicies}
      />
      {/* #endif */}
    </>
  );
};

export default AuditResultStep;
