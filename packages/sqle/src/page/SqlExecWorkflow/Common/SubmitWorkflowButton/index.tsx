import { ActionButton, BasicButton } from '@actiontech/shared';
import { SubmitWorkflowButtonProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { InfoHexagonOutlined } from '@actiontech/icons';

const SubmitWorkflowButton: React.FC<SubmitWorkflowButtonProps> = ({
  isConfirmationRequiredForSubmission,
  loading,
  submitWorkflowConfirmationMessage,
  onClick,
  hasExceptionAuditRule
}) => {
  const { t } = useTranslation();

  if (hasExceptionAuditRule) {
    return (
      <ActionButton
        danger
        loading={loading}
        icon={<InfoHexagonOutlined color="currentColor" height={20} />}
        text={t('execWorkflow.create.auditResult.submit')}
        actionType="confirm"
        confirm={{
          title: t('execWorkflow.create.auditResult.submitTooltipTitle'),
          okText: t('execWorkflow.create.auditResult.continueSubmission'),
          onConfirm: onClick,
          okButtonProps: { loading }
        }}
      />
    );
  }

  if (isConfirmationRequiredForSubmission) {
    return (
      <ActionButton
        danger
        loading={loading}
        icon={<InfoHexagonOutlined color="currentColor" height={20} />}
        text={t('execWorkflow.create.auditResult.submit')}
        actionType="confirm"
        confirm={{
          title: submitWorkflowConfirmationMessage,
          okText: t('execWorkflow.create.auditResult.continueSubmission'),
          onConfirm: onClick,
          okButtonProps: { loading }
        }}
      />
    );
  }

  return (
    <BasicButton loading={loading} type="primary" onClick={onClick}>
      {t('execWorkflow.create.auditResult.submit')}
    </BasicButton>
  );
};

export default SubmitWorkflowButton;
