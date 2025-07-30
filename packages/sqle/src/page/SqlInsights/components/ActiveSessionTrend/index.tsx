import { useTranslation } from 'react-i18next';
import { ActiveSessionTrendStyleWrapper } from './style';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import SqlInsightsLineChart from '../SqlInsightsLineChart';
import useSqlInsightsMetric from '../../hooks/useSqlInsightsMetric';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useRelatedSqlRedux from '../RelatedSqlList/useRelatedSqlRedux';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import { useEffect } from 'react';
import { SqlInsightsChartProps } from '../../index.type';

const ActiveSessionTrend: React.FC<SqlInsightsChartProps> = ({
  instanceId,
  dateRange,
  pollingInterval,
  onCreateSqlManagementConf,
  timePeriod
}) => {
  const { t } = useTranslation();
  const { updateRelateSqlListDateRange } = useRelatedSqlRedux();
  const {
    loading,
    chartData,
    getChartData,
    isTaskSupported,
    errorMessage,
    isTaskEnabled
  } = useSqlInsightsMetric({
    instanceId,
    dateRange,
    metricName: GetSqlPerformanceInsightsMetricNameEnum.active_session_trend,
    pollingInterval,
    timePeriod
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.SQL_INSIGHTS_LINE_CHART_REFRESH,
      () => {
        if (isTaskSupported) {
          getChartData();
        }
      }
    );
    return unsubscribe;
  }, [getChartData, isTaskSupported]);

  return isTaskSupported ? (
    <ActiveSessionTrendStyleWrapper>
      <SqlInsightsLineChart
        loading={loading}
        chartData={chartData}
        title={t('sqlInsights.activeSessionTrend.title')}
        className="active-session-trend-chart"
        maskInteractionEventName={
          EmitterKey.SQL_INSIGHTS_LINE_CHART_MASK_INTERACTION
        }
        onSelectDate={(selectedDateRange) => {
          updateRelateSqlListDateRange(selectedDateRange);
        }}
        errorInfo={errorMessage}
        onGoToEnable={onCreateSqlManagementConf}
        isTaskEnabled={isTaskEnabled}
      />
    </ActiveSessionTrendStyleWrapper>
  ) : null;
};

export default ActiveSessionTrend;
