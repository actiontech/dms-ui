import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { GetSqlManageSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { ILine } from '@actiontech/shared/lib/api/sqle/service/common';

interface UseSqlInsightsMetricProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
  metricName: GetSqlManageSqlPerformanceInsightsMetricNameEnum;
}

interface UseSqlInsightsMetricReturn {
  loading: boolean;
  chartData: ILine[];
}

export const useSqlInsightsMetric = ({
  instanceId,
  dateRange,
  metricName
}: UseSqlInsightsMetricProps): UseSqlInsightsMetricReturn => {
  const { projectName } = useCurrentProject();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ILine[]>([]);

  useEffect(() => {
    if (
      !projectName ||
      !instanceId ||
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await SqlManage.GetSqlManageSqlPerformanceInsights({
          project_name: projectName,
          instance_name: instanceId,
          metric_name: metricName,
          start_time: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          end_time: dateRange[1].format('YYYY-MM-DD HH:mm:ss')
        });
        if (res.data?.data?.lines) {
          setChartData(res.data.data.lines);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectName, instanceId, dateRange, metricName]);

  return { loading, chartData };
};

export default useSqlInsightsMetric;
