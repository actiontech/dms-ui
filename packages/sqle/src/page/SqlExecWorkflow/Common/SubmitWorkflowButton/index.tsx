import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { SubmitWorkflowButtonProps } from './index.type';
import { useTranslation } from 'react-i18next';

const SubmitWorkflowButton: React.FC<SubmitWorkflowButtonProps> = ({
  disabled,
  loading,
  disabledTips,
  onClick
}) => {
  const { t } = useTranslation();
  return (
    <BasicToolTips
      title={disabled ? disabledTips : ''}
      overlayClassName="whitespace-pre-line"
    >
      <BasicButton
        disabled={disabled || loading}
        type="primary"
        onClick={onClick}
      >
        {t('execWorkflow.create.auditResult.submit')}
      </BasicButton>
    </BasicToolTips>
  );
};

export default SubmitWorkflowButton;
