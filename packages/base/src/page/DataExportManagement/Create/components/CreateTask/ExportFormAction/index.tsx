import { useTranslation } from 'react-i18next';
import { ExportFormActionProps } from './index.type';
import { BasicButton, BasicToolTip } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { FormatLanguageSupport } from '@actiontech/dms-kit';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import { SqlFormatterButtonStyleWrapper } from 'sqle/src/page/SqlExecWorkflow/Common/style';
import classNames from 'classnames';

const ExportFormAction: React.FC<ExportFormActionProps> = ({
  auditAction,
  auditLoading,
  formatSQLAction,
  formatted
}) => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();
  return (
    <Space size={12}>
      <BasicButton onClick={auditAction} type="primary" loading={auditLoading}>
        {t('dmsDataExport.create.form.action.audit')}
      </BasicButton>
      <SqlFormatterButtonStyleWrapper
        className={classNames({
          'active-formatter-button': formatted
        })}
        onClick={formatSQLAction}
        loading={auditLoading}
      >
        {t('dmsDataExport.create.form.action.format')}
      </SqlFormatterButtonStyleWrapper>
      <BasicToolTip
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
