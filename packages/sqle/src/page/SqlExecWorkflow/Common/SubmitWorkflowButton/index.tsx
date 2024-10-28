import { BasicButton } from '@actiontech/shared';
import { SubmitWorkflowButtonProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { InfoHexagonOutlined } from '@actiontech/icons';
import { Popconfirm } from 'antd';

const SubmitWorkflowButton: React.FC<SubmitWorkflowButtonProps> = ({
  isConfirmationRequiredForSubmission,
  loading,
  submitWorkflowConfirmationMessage,
  onClick
}) => {
  const { t } = useTranslation();
  if (!isConfirmationRequiredForSubmission) {
    return (
      <BasicButton loading={loading} type="primary" onClick={onClick}>
        {t('execWorkflow.create.auditResult.submit')}
      </BasicButton>
    );
  }

  return (
    <Popconfirm
      title={submitWorkflowConfirmationMessage}
      okText={t('execWorkflow.create.auditResult.continueSubmission')}
      onConfirm={onClick}
      okButtonProps={{ loading }}
    >
      <BasicButton
        danger
        loading={loading}
        icon={<InfoHexagonOutlined color="currentColor" height={20} />}
      >
        {t('execWorkflow.create.auditResult.submit')}
      </BasicButton>
    </Popconfirm>
  );
};

export default SubmitWorkflowButton;
