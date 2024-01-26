import { useTranslation } from 'react-i18next';
import { ExportFormActionProps } from './index.type';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import { Space } from 'antd';
import { FormatLanguageSupport } from 'sqle/src/utils/FormatterSQL';

const ExportFormAction: React.FC<ExportFormActionProps> = ({
  auditAction,
  auditLoading,
  formatSQLAction
}) => {
  const { t } = useTranslation();
  return (
    <Space size={12}>
      <BasicButton onClick={auditAction} type="primary" loading={auditLoading}>
        {t('dmsDataExport.create.form.action.audit')}
      </BasicButton>
      <BasicButton onClick={formatSQLAction} loading={auditLoading}>
        {t('dmsDataExport.create.form.action.format')}
      </BasicButton>
      <BasicToolTips
        prefixIcon={<IconTipGray />}
        title={t('dmsDataExport.create.form.action.formatTips', {
          supportType: Object.keys(FormatLanguageSupport).join('、')
        })}
      />
    </Space>
  );
};

export default ExportFormAction;
