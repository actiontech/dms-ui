import { useTranslation } from 'react-i18next';
import { ConfigProvider, Space, Typography } from 'antd';
import { PageHeaderStyleWrapper } from '../../style/layout';
import EEIndex from './EEIndex';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { SyncOutlined } from '@ant-design/icons';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { ReportStatisticsEEIndexStyleWrapper } from './style';

const ReportStatistics = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();

  const onRefreshPage = () => {
    eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
  };
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
        <PageHeaderStyleWrapper>
          <PageHeader
            title={
              <Space size={10}>
                <div>{t('reportStatistics.title')}</div>
                {/* #if [ee] */}
                <SyncOutlined
                  onClick={onRefreshPage}
                  className="refresh-icon"
                />
                {/* #endif */}
              </Space>
            }
          />
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
        </PageHeaderStyleWrapper>
      </ReportStatisticsEEIndexStyleWrapper>
    </ConfigProvider>
  );
};

export default ReportStatistics;
