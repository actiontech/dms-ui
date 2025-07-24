import SqlInsights from './SqlInsights';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { Typography } from 'antd';

const VersionManagement = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('sqlInsights.title')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('sqlInsights.title')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlInsights.ceTips')}
          </Typography.Paragraph>
        }
      >
        <SqlInsights />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default VersionManagement;
