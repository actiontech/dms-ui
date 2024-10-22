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

const AuditResultStep: React.FC<AuditResultStepProps> = ({
  tasks,
  updateTaskRecordCount,
  baseFormValues,
  sqlAuditInfoFormValues,
  isConfirmationRequiredForSubmission,
  submitWorkflowConfirmationMessage,
  createAction,
  auditAction,
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

  const internalCreateWorkflow = () => {
    startCreate();

    createAction().finally(() => {
      finishCreate();
    });
  };

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
