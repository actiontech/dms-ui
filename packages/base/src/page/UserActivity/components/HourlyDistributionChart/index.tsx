import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, ColumnConfig } from '@ant-design/plots';
import ChartWrapper from 'sqle/src/components/ChartCom/ChartWrapper';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { IUserActivityHourlyDistributionItem } from '@actiontech/shared/lib/api/base/service/UserActivity/index.d';
import { formatHourLabel } from '../../utils';

type HourlyDistributionChartProps = {
  loading?: boolean;
  errorMessage?: string;
  data?: IUserActivityHourlyDistributionItem[];
  onRefresh?: () => void;
};

const HourlyDistributionChart = ({
  loading,
  errorMessage,
  data,
  onRefresh
}: HourlyDistributionChartProps) => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sharedTheme } = useThemeStyleData();

  const chartData = useMemo(
    () =>
      data?.map((item) => ({
        hour_label: formatHourLabel(item.stat_hour),
        request_count: item.request_count ?? 0,
        active_users: item.active_users ?? 0
      })) ?? [],
    [data]
  );

  const config: ColumnConfig = {
    data: chartData,
    xField: 'hour_label',
    yField: 'request_count',
    color: sharedTheme.uiToken.colorPrimary,
    meta: {
      hour_label: {
        alias: t('userActivity.hourlyDistribution.hour')
      },
      request_count: {
        alias: t('userActivity.hourlyDistribution.requestCount')
      }
    }
  };

  return (
    <ChartWrapper
      loading={!!loading}
      errorInfo={errorMessage}
      dataLength={data?.length}
      emptyCont={t('userActivity.hourlyDistribution.emptyText')}
      onRefresh={onRefresh}
    >
      <Column {...config} theme={currentTheme} />
    </ChartWrapper>
  );
};

export default HourlyDistributionChart;
