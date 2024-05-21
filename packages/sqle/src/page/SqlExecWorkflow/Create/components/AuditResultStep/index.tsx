import BasicInfoWrapper from '../../../Common/BasicInfoWrapper';
import { AuditResultStepProps } from './index.type';
import { BasicButton, BasicToolTips, PageHeader } from '@actiontech/shared';
import BackToList from '../../../Common/BackToList';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import AuditResultList from './components/AuditResultList';
import UpdateFormDrawer from './components/UpdateFormDrawer';

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
            <BasicToolTips
              title={
                isDisableFinallySubmitButton ? disabledOperatorOrderBtnTips : ''
              }
              overlayClassName="whitespace-pre-line"
            >
              <BasicButton
                loading={creating}
                disabled={isDisableFinallySubmitButton || creating}
                type="primary"
                onClick={internalCreateWorkflow}
              >
                {t('execWorkflow.create.auditResult.submit')}
              </BasicButton>
            </BasicToolTips>
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
