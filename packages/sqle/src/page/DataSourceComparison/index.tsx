import { PageHeader, EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import ComparisonEntry from './ComparisonEntry';

const DataSourceComparison: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section>
      <PageHeader title={t('dataSourceComparison.pageTitle')} />
      <EnterpriseFeatureDisplay
        featureName={t('dataSourceComparison.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dataSourceComparison.ceTips')}
          </Typography.Paragraph>
        }
      >
        <ComparisonEntry />
      </EnterpriseFeatureDisplay>
    </section>
  );
};

export default DataSourceComparison;
