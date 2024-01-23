import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import LarkAuditSettingEEIndex from './index.ee';

const LarkAuditSetting: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="config-form-wrapper">
      <EnterpriseFeatureDisplay
        featureName={t('dmsSystem.title.larkAudit')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsSystem.larkAudit.ceTips')}
          </Typography.Paragraph>
        }
        isConfigPage={true}
      >
        <LarkAuditSettingEEIndex />
      </EnterpriseFeatureDisplay>
    </div>
  );
};

export default LarkAuditSetting;
