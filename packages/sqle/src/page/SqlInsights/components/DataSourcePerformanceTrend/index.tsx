import { useTranslation } from 'react-i18next';
import { DataSourcePerformanceTrendStyleWrapper } from './style';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import SqlInsightsLineChart from '../SqlInsightsLineChart';
import useSqlInsightsMetric from '../../hooks/useSqlInsightsMetric';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useRelatedSqlRedux from '../RelatedSqlList/useRelatedSqlRedux';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import { useEffect } from 'react';
import { SqlInsightsChartProps } from '../../index.type';

const DataSourcePerformanceTrend: React.FC<SqlInsightsChartProps> = ({
  instanceId,
  dateRange,
  pollingInterval,
  timePeriod,
  onCreateSqlManagementConf
}) => {
  const { t } = useTranslation();
  const { updateRelateSqlListDateRange } = useRelatedSqlRedux();
  const {
    loading,
    chartData,
    getChartData,
    errorMessage,
    isTaskEnabled,
    isTaskSupported
  } = useSqlInsightsMetric({
    instanceId,
    dateRange,
    metricName: GetSqlPerformanceInsightsMetricNameEnum.comprehensive_trend,
    pollingInterval,
    timePeriod
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH,
      getChartData
    );
    return unsubscribe;
  }, [getChartData]);

  return isTaskSupported ? (
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
        errorInfo={errorMessage}
        isTaskEnabled={isTaskEnabled}
        onGoToEnable={() =>
          onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.comprehensive_trend
          )
        }
        instanceId={instanceId}
      />
    </DataSourcePerformanceTrendStyleWrapper>
  ) : null;
};

export default DataSourcePerformanceTrend;
