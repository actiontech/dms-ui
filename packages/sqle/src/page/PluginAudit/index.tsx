import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import PluginAuditList from './List';

const PluginAudit = () => {
  const { t } = useTranslation();

  return (
    <section>
      <PageHeader title={t('pluginAudit.pageTitle')} />
      <EnterpriseFeatureDisplay
        featureName={t('pluginAudit.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('pluginAudit.ceTips')}
          </Typography.Paragraph>
        }
      >
        <PluginAuditList />
      </EnterpriseFeatureDisplay>
    </section>
  );
};

export default PluginAudit;
