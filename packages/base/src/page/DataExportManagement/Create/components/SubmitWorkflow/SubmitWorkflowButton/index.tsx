import { ActionButton, BasicButton } from '@actiontech/shared';
import { SubmitWorkflowButtonProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { InfoHexagonOutlined } from '@actiontech/icons';

const SubmitWorkflowButton: React.FC<SubmitWorkflowButtonProps> = ({
  loading,
  onClick,
  hasExceptionAuditRule,
  executeSQLsIsDQL
}) => {
  const { t } = useTranslation();

  if (hasExceptionAuditRule) {
    return (
      <ActionButton
        danger
        loading={loading}
        icon={<InfoHexagonOutlined color="currentColor" height={20} />}
        text={t('dmsDataExport.create.submit.buttonText')}
        actionType="confirm"
        confirm={{
          title: t('dmsDataExport.create.submit.hasExceptionRule'),
          okText: t('dmsDataExport.create.submit.continueSubmission'),
          onConfirm: onClick,
          okButtonProps: { loading }
        }}
      />
    );
  }

  if (!executeSQLsIsDQL) {
    return (
      <ActionButton
        disabled
        actionType="tooltip"
        icon={<InfoHexagonOutlined color="currentColor" height={20} />}
        tooltip={{
          title: t('dmsDataExport.create.submit.onlySupportDDLSqls')
        }}
        text={t('dmsDataExport.create.submit.buttonText')}
      />
    );
  }

  return (
    <BasicButton loading={loading} type="primary" onClick={onClick}>
      {t('dmsDataExport.create.submit.buttonText')}
    </BasicButton>
  );
};

export default SubmitWorkflowButton;
