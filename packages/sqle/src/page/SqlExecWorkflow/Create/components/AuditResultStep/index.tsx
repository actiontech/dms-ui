import BasicInfoWrapper from '../../../Common/BasicInfoWrapper';
import { AuditResultStepProps } from './index.type';
import { BasicButton, PageHeader } from '@actiontech/dms-kit';
import BackToList from '../../../Common/BackToList';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import AuditResultList from '../../../Common/AuditResultList';
import UpdateFormDrawer from './UpdateFormDrawer';
import SubmitWorkflowButton from '../../../Common/SubmitWorkflowButton';
import { useEffect } from 'react';
import useInstance from '../../../../../hooks/useInstance';
import { useCurrentProject } from '@actiontech/shared/lib/features';
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

  const { updateInstanceList } = useInstance();
  const { projectName } = useCurrentProject();
  const internalCreateWorkflow = () => {
    startCreate();
    createAction().finally(() => {
      finishCreate();
    });
  };

  // #if [ee]
  useEffect(() => {
    updateInstanceList({
      project_name: projectName
    });
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
    </>
  );
};
export default AuditResultStep;
