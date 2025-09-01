import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { PageHeader } from '@actiontech/dms-kit';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { ReportStatisticsEEIndexStyleWrapper } from './style';
import EEIndex from './EEIndex';
const ReportStatistics = () => {
  const { t } = useTranslation();
  return (
    <ReportStatisticsEEIndexStyleWrapper>
      {/* #if [ce] */}
      <PageHeader title={t('reportStatistics.title')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('reportStatistics.title')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('reportStatistics.ce.feature.desc')}
          </Typography.Paragraph>
        }
      >
        <EEIndex />
      </EnterpriseFeatureDisplay>
    </ReportStatisticsEEIndexStyleWrapper>
  );
};
export default ReportStatistics;
