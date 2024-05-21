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
  baseFormValues,
  tasks,
  isAuditing,
  isDisableFinallySubmitButton,
  disabledOperatorOrderBtnTips,
  updateTaskRecordCount,
  createAction,
  ...props
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
        title={<BackToList isAuditing={isAuditing.value} />}
        extra={
          <Space>
            <BasicButton
              onClick={openUpdateSqlAuditInfoDrawer}
              disabled={creating}
            >
              {t('execWorkflow.create.auditResult.updateInfo')}
            </BasicButton>
            <SubmitWorkflowButton
              disabled={isDisableFinallySubmitButton}
              loading={creating}
              disabledTips={disabledOperatorOrderBtnTips}
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
        isAuditing={isAuditing}
        {...props}
      />
    </>
  );
};

export default AuditResultStep;
