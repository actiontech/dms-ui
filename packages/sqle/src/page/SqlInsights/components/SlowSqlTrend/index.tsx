import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';
import { SlowSqlTrendStyleWrapper } from './style';
import { GetSqlManageSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import SqlInsightsLineChart from '../SqlInsightsLineChart';
import useSqlInsightsMetric from '../../hooks/useSqlInsightsMetric';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useRelatedSqlRedux from '../RelatedSqlList/useRelatedSqlRedux';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import { useEffect } from 'react';

export interface SlowSqlTrendProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
}

const SlowSqlTrend: React.FC<SlowSqlTrendProps> = ({
  instanceId,
  dateRange
}) => {
  const { t } = useTranslation();
  const { updateRelateSqlListDateRange } = useRelatedSqlRedux();
  const { loading, chartData, getChartData } = useSqlInsightsMetric({
    instanceId,
    dateRange,
    metricName: GetSqlManageSqlPerformanceInsightsMetricNameEnum.slow_sql_trend
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH,
      getChartData
    );
    return unsubscribe;
  }, [getChartData]);

  return (
    <SlowSqlTrendStyleWrapper>
      <SqlInsightsLineChart
        loading={loading}
        chartData={chartData}
        title={t('sqlInsights.slowSqlTrend.title')}
        className="slow-sql-trend-chart"
        maskInteractionEventName={
          EmitterKey.SQL_INSIGHTS_LINE_CHART_MASK_INTERACTION
        }
        onSelectDate={(selectedDateRange) => {
          updateRelateSqlListDateRange(selectedDateRange);
        }}
      />
    </SlowSqlTrendStyleWrapper>
  );
};

export default SlowSqlTrend;
