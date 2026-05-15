import CardWrapper from '../../../../components/CardWrapper';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import {
  useChangeTheme,
  useCurrentProject
} from '@actiontech/shared/lib/features';
import { Bar, BarConfig } from '@ant-design/plots';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { IDBPerformanceImproveOverview } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  defaultItemKey,
  labelFormatter,
  renderTooltipCustomContent,
  renderTooltipFormatter
} from './index.data';

const limitDataLength = 8;

const DataSourcePerformance = () => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  const { currentTheme } = useChangeTheme();

  const [data, setData] = useState<IDBPerformanceImproveOverview[]>([]);

  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => {
      return sqlOptimization.getDBPerformanceImproveOverview({
        project_name: projectName
      });
    },
    {
      onSuccess: (res) => {
        const list = res.data.data ?? [];
        const emptyData: IDBPerformanceImproveOverview[] = [];
        if (list.length) {
          const emptyDataLength =
            limitDataLength - list.length > 0
              ? limitDataLength - list.length
              : 0;
          if (emptyDataLength) {
            for (let i = 0; i < emptyDataLength; i++) {
              emptyData.push({
                instance_name: defaultItemKey + i,
                avg_performance_improve: 0
              });
            }
          }
        }
        setData(list.concat(emptyData));
      }
    }
  );

  const { sqleTheme, sharedTheme } = useThemeStyleData();

  const config: BarConfig = {
    data,
    xField: 'avg_performance_improve',
    yField: 'instance_name',
    autoFit: true,
    yAxis: {
      label: {
        formatter: labelFormatter
      },
      line: { style: { lineWidth: 0 } },
      tickLine: { style: { lineWidth: 0 } }
    },
    xAxis: false,
    legend: {
      position: 'top-left'
    },
    barStyle: {
      radius: 4,
      fill: sqleTheme.projectOverview.DataSourcePerformance.bar.fill,
      strokeOpacity: 0
    },
    barBackground: {
      style: {
        fill: sqleTheme.projectOverview.DataSourcePerformance.bar.bg
      }
    },
    interactions: [
      {
        type: 'active-region',
        enable: false
      }
    ],
    tooltip: {
      fields: ['instance_name', 'avg_performance_improve'],
      formatter: renderTooltipFormatter,
      customContent: (title: string, dataSource) =>
        renderTooltipCustomContent(dataSource, sqleTheme, sharedTheme)
    },
    scrollbar:
      data.length > limitDataLength
        ? {
            type: 'vertical',
            animate: false,
            padding: [0, 0, 0, 0]
          }
        : undefined,
    minBarWidth: 20,
    maxBarWidth: 20
  };

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.dataSourcePerformance.title')}
    >
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={data.length}
        emptyCont={t('common.tip.no_data')}
        onRefresh={getApiData}
      >
        <Bar {...config} theme={currentTheme} />
      </ChartWrapper>
    </CardWrapper>
  );
};

export default DataSourcePerformance;
