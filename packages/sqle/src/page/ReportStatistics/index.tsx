import { SyncOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { EnterpriseFeatureDisplay, useTypedNavigate } from '@actiontech/shared';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps
} from '@actiontech/dms-kit';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import EmitterKey from '../../data/EmitterKey';
import eventEmitter from '../../utils/EventEmitter';
import { ReportStatisticsEEIndexStyleWrapper } from './style';

import AIGovernanceTab from './AIGovernanceTab';
import EEIndex from './EEIndex';

enum ReportStatisticsTabEnum {
  Report = 'report',
  AIGovernance = 'ai-governance'
}

const ReportStatistics = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<ReportStatisticsTabEnum>(() => {
    const tab = searchParams.get('tab');
    return tab === 'ai-governance'
      ? ReportStatisticsTabEnum.AIGovernance
      : ReportStatisticsTabEnum.Report;
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'ai-governance') {
      setActiveTab(ReportStatisticsTabEnum.AIGovernance);
    } else {
      setActiveTab(ReportStatisticsTabEnum.Report);
    }
  }, [searchParams]);

  const handleTabChange = (key: string | number) => {
    const newTab = key as ReportStatisticsTabEnum;
    setActiveTab(newTab);
    const path =
      newTab === ReportStatisticsTabEnum.AIGovernance
        ? `${ROUTE_PATHS.SQLE.REPORT_STATISTICS}?tab=ai-governance`
        : ROUTE_PATHS.SQLE.REPORT_STATISTICS;
    navigate(path, { replace: true });
  };

  const onRefreshPage = () => {
    eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
  };

  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    return [
      {
        label: t('reportStatistics.tabs.report'),
        value: ReportStatisticsTabEnum.Report,
        children: <EEIndex />,
        destroyInactivePane: false
      },
      {
        label: t('reportStatistics.tabs.aiGovernance'),
        value: ReportStatisticsTabEnum.AIGovernance,
        children: <AIGovernanceTab />,
        destroyInactivePane: false
      }
    ];
  }, [t]);

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
        <SegmentedTabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          segmentedRowClassName="fixed-tabs-row"
          segmentedRowExtraContent={
            <SyncOutlined onClick={onRefreshPage} className="refresh-icon" />
          }
        />
      </EnterpriseFeatureDisplay>
    </ReportStatisticsEEIndexStyleWrapper>
  );
};

export default ReportStatistics;
