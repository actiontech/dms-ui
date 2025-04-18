import { useTranslation } from 'react-i18next';
import { Space, Spin } from 'antd';
import StatisticCard from './StatisticCard';
import {
  FlagFilled,
  DatabaseFilled,
  DatabaseSchemaFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { useEffect } from 'react';

const ResourceOverviewBaseInfo: React.FC = () => {
  const { t } = useTranslation();

  const { baseTheme } = useThemeStyleData();

  const {
    data: overviewData,
    loading,
    refresh
  } = useRequest(() => {
    return DmsApi.ResourceOverviewService.GetResourceOverviewStatisticsV1().then(
      (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      }
    );
  });

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Resource_Overview_Page,
      () => {
        refresh();
      }
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <Spin spinning={loading}>
      <Space
        className="statistic-card-wrapper full-width-element"
        size={24}
        direction="vertical"
      >
        <StatisticCard
          title={t('resourceOverview.baseInfo.businessCount')}
          count={overviewData?.business_total_number ?? 0}
          icon={
            <DatabaseSchemaFilled
              width={24}
              height={24}
              color={baseTheme.resourceOverview.icon.schemaFilled}
            />
          }
        />
        <StatisticCard
          title={t('resourceOverview.baseInfo.projectCount')}
          count={overviewData?.project_total_number ?? 0}
          icon={<FlagFilled width={24} height={24} />}
        />
        <StatisticCard
          title={t('resourceOverview.baseInfo.sourceCount')}
          count={overviewData?.db_service_total_number ?? 0}
          icon={
            <DatabaseFilled
              width={24}
              height={24}
              color={baseTheme.resourceOverview.icon.databaseFilled}
            />
          }
        />
      </Space>
    </Spin>
  );
};

export default ResourceOverviewBaseInfo;
