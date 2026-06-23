import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Line, LineConfig } from '@ant-design/plots';
import ChartWrapper from 'sqle/src/components/ChartCom/ChartWrapper';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { IUserActivityDailyTrendItem } from '@actiontech/shared/lib/api/base/service/UserActivity/index.d';
import { USER_ACTIVITY_CHART_PADDING } from '../../utils';

type DailyTrendChartProps = {
  loading?: boolean;
  errorMessage?: string;
  data?: IUserActivityDailyTrendItem[];
  onRefresh?: () => void;
};

const DailyTrendChart = ({
  loading,
  errorMessage,
  data,
  onRefresh
}: DailyTrendChartProps) => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sqleTheme } = useThemeStyleData();

  const chartData = useMemo(() => {
    const result: Array<{
      stat_date: string;
      value: number;
      category: string;
    }> = [];
    data?.forEach((item) => {
      result.push({
        stat_date: item.stat_date ?? '',
        value: item.dau ?? 0,
        category: t('userActivity.dailyTrend.dau')
      });
      result.push({
        stat_date: item.stat_date ?? '',
        value: item.request_count ?? 0,
        category: t('userActivity.dailyTrend.requestCount')
      });
    });
    return result;
  }, [data, t]);

  const config: LineConfig = {
    data: chartData,
    xField: 'stat_date',
    yField: 'value',
    seriesField: 'category',
    color: sqleTheme.statistics.rectColor,
    smooth: true,
    appendPadding: USER_ACTIVITY_CHART_PADDING,
    legend: {
      position: 'top'
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        style: {
          fontSize: 11
        }
      }
    }
  };

  return (
    <ChartWrapper
      loading={!!loading}
      errorInfo={errorMessage}
      dataLength={data?.length}
      emptyCont={t('userActivity.dailyTrend.emptyText')}
      onRefresh={onRefresh}
    >
      <Line {...config} theme={currentTheme} />
    </ChartWrapper>
  );
};

export default DailyTrendChart;
