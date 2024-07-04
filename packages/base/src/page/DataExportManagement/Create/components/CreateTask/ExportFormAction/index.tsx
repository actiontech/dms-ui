import { useTranslation } from 'react-i18next';
import { ExportFormActionProps } from './index.type';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { Space } from 'antd';
import { FormatLanguageSupport } from '@actiontech/shared/lib/utils/FormatterSQL';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';

const ExportFormAction: React.FC<ExportFormActionProps> = ({
  auditAction,
  auditLoading,
  formatSQLAction
}) => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();
  return (
    <Space size={12}>
      <BasicButton onClick={auditAction} type="primary" loading={auditLoading}>
        {t('dmsDataExport.create.form.action.audit')}
      </BasicButton>
      <BasicButton onClick={formatSQLAction} loading={auditLoading}>
        {t('dmsDataExport.create.form.action.format')}
      </BasicButton>
      <BasicToolTips
        prefixIcon={
          <InfoCircleOutlined
            width={14}
            height={14}
            color={baseTheme.icon.dataExport.infoCircle}
          />
        }
        title={t('dmsDataExport.create.form.action.formatTips', {
          supportType: Object.keys(FormatLanguageSupport).join('、')
        })}
      />
    </Space>
  );
};

export default ExportFormAction;
