import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';
import { DataSourcePerformanceTrendStyleWrapper } from './style';
import { GetSqlManageSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import SqlInsightsLineChart from '../SqlInsightsLineChart';
import useSqlInsightsMetric from '../../hooks/useSqlInsightsMetric';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useRelatedSqlRedux from '../RelatedSqlList/useRelatedSqlRedux';

export interface DataSourcePerformanceTrendProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
}

const DataSourcePerformanceTrend: React.FC<DataSourcePerformanceTrendProps> = ({
  instanceId,
  dateRange
}) => {
  const { t } = useTranslation();
  const { updateRelateSqlListDateRange } = useRelatedSqlRedux();
  const { loading, chartData } = useSqlInsightsMetric({
    instanceId,
    dateRange,
    metricName:
      GetSqlManageSqlPerformanceInsightsMetricNameEnum.comprehensive_trend
  });

  return (
    <DataSourcePerformanceTrendStyleWrapper>
      <SqlInsightsLineChart
        loading={loading}
        chartData={chartData}
        title={t('sqlInsights.performanceTrend.title')}
        className="performance-trend-chart"
        maskInteractionEventName={
          EmitterKey.SQL_INSIGHTS_LINE_CHART_MASK_INTERACTION
        }
        onSelectDate={(selectedDateRange) => {
          updateRelateSqlListDateRange(selectedDateRange);
        }}
      />
    </DataSourcePerformanceTrendStyleWrapper>
  );
};

export default DataSourcePerformanceTrend;
