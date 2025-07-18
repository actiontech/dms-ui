import { useRequest } from 'ahooks';
import { Dayjs } from 'dayjs';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { SqleApi } from '@actiontech/shared/lib/api/';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import { ILine } from '@actiontech/shared/lib/api/sqle/service/common';

interface UseSqlInsightsMetricProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
  metricName: GetSqlPerformanceInsightsMetricNameEnum;
  pollingInterval?: number; // 添加轮询间隔参数，单位毫秒
}

interface UseSqlInsightsMetricReturn {
  loading: boolean;
  chartData: ILine[];
  getChartData: (date?: [Dayjs, Dayjs]) => void;
}

export const useSqlInsightsMetric = ({
  instanceId,
  dateRange,
  metricName,
  pollingInterval
}: UseSqlInsightsMetricProps): UseSqlInsightsMetricReturn => {
  const { projectName } = useCurrentProject();

  const fetchData = async (date?: [Dayjs, Dayjs]) => {
    if (
      !projectName ||
      !instanceId ||
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      return;
    }

    const [startTime, endTime] = date || dateRange;

    const res = await SqleApi.SqlInsightService.GetSqlPerformanceInsights({
      project_name: projectName,
      instance_name: instanceId,
      metric_name: metricName,
      start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
      end_time: endTime.format('YYYY-MM-DD HH:mm:ss')
    });

    return res.data?.data?.lines || [];
  };

  const {
    data: chartData = [],
    loading,
    runAsync: getChartData
  } = useRequest(fetchData, {
    refreshDeps: [projectName, instanceId, dateRange, metricName],
    pollingInterval:
      pollingInterval && pollingInterval > 0 ? pollingInterval : undefined, // 使用传入的轮询间隔
    ready: !!(projectName && instanceId && dateRange) // 只有当所有必需参数都存在时才开始请求
  });

  return { loading, chartData, getChartData };
};

export default useSqlInsightsMetric;
