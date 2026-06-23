import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, ColumnConfig } from '@ant-design/plots';
import ChartWrapper from 'sqle/src/components/ChartCom/ChartWrapper';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { IUserActivityModuleDistributionItem } from '@actiontech/shared/lib/api/base/service/UserActivity/index.d';
import { floatRound } from '@actiontech/shared/lib/utils/Math';
import { USER_ACTIVITY_CHART_PADDING } from '../../utils';

type ModuleDistributionChartProps = {
  loading?: boolean;
  errorMessage?: string;
  data?: IUserActivityModuleDistributionItem[];
  onRefresh?: () => void;
};

const ModuleDistributionChart = ({
  loading,
  errorMessage,
  data,
  onRefresh
}: ModuleDistributionChartProps) => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sharedTheme } = useThemeStyleData();

  const chartData = useMemo(
    () =>
      data?.map((item) => ({
        module_name: item.module_name || item.module_code,
        request_count: item.request_count ?? 0,
        percent: `${floatRound((item.percent ?? 0) * 100, 2)}%`
      })) ?? [],
    [data]
  );

  const config: ColumnConfig = {
    data: chartData,
    xField: 'module_name',
    yField: 'request_count',
    appendPadding: USER_ACTIVITY_CHART_PADDING,
    color: sharedTheme.uiToken.colorPrimary,
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        style: {
          fontSize: 11
        }
      }
    },
    label: {
      position: 'top',
      formatter: (datum: { percent?: string }) => datum.percent ?? ''
    },
    meta: {
      module_name: {
        alias: t('userActivity.moduleDistribution.title')
      },
      request_count: {
        alias: t('userActivity.moduleDistribution.requestCount')
      }
    }
  };

  return (
    <ChartWrapper
      loading={!!loading}
      errorInfo={errorMessage}
      dataLength={data?.length}
      emptyCont={t('userActivity.moduleDistribution.emptyText')}
      onRefresh={onRefresh}
    >
      <Column {...config} theme={currentTheme} />
    </ChartWrapper>
  );
};

export default ModuleDistributionChart;
