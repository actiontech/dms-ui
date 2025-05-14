import { PageHeader, EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import ComparisonEntry from './ComparisonEntry';
import { DataSourceComparisonStyleWrapper } from './style';

const DataSourceComparison: React.FC = () => {
  const { t } = useTranslation();
  return (
    <DataSourceComparisonStyleWrapper
      // #if [ee]
      className="has-min-height"
      // #endif
    >
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
    </DataSourceComparisonStyleWrapper>
  );
};

export default DataSourceComparison;
