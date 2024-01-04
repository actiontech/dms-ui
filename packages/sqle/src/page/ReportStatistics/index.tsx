import { useTranslation } from 'react-i18next';
import { ConfigProvider, Typography } from 'antd';
import useThemeStyleData from '../../hooks/useThemeStyleData';

import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { ReportStatisticsEEIndexStyleWrapper } from './style';

import EEIndex from './EEIndex';

const ReportStatistics = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();

  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 20,
          paddingLG: 20,
          paddingSM: 20,
          paddingXS: 20,
          colorBgContainer: sqleTheme.reportStatistics.bgColor
        }
      }}
    >
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
    </ConfigProvider>
  );
};

export default ReportStatistics;
