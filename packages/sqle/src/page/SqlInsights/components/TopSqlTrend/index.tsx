import { useTranslation } from 'react-i18next';
import { TopSqlTrendStyleWrapper } from './style';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import SqlInsightsLineChart from '../SqlInsightsLineChart';
import useSqlInsightsMetric from '../../hooks/useSqlInsightsMetric';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useRelatedSqlRedux from '../RelatedSqlList/useRelatedSqlRedux';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import { useEffect } from 'react';
import { SqlInsightsChartProps } from '../../index.type';

const TopSqlTrend: React.FC<SqlInsightsChartProps> = ({
  instanceId,
  dateRange,
  pollingInterval
}) => {
  const { t } = useTranslation();
  const { updateRelateSqlListDateRange } = useRelatedSqlRedux();
  const { loading, chartData, getChartData } = useSqlInsightsMetric({
    instanceId,
    dateRange,
    metricName: GetSqlPerformanceInsightsMetricNameEnum.top_sql_trend,
    pollingInterval
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH,
      getChartData
    );
    return unsubscribe;
  }, [getChartData]);

  return (
    <TopSqlTrendStyleWrapper>
      <SqlInsightsLineChart
        loading={loading}
        chartData={chartData}
        title={t('sqlInsights.topSqlTrend.title')}
        className="top-sql-trend-chart"
        maskInteractionEventName={
          EmitterKey.SQL_INSIGHTS_LINE_CHART_MASK_INTERACTION
        }
        onSelectDate={(selectedDateRange) => {
          updateRelateSqlListDateRange(selectedDateRange);
        }}
      />
    </TopSqlTrendStyleWrapper>
  );
};

export default TopSqlTrend;
