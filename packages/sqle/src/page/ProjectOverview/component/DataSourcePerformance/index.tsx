import CardWrapper from '../../../../components/CardWrapper';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Bar, BarConfig, Tooltip } from '@ant-design/plots';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { SqleTheme } from '../../../../types/theme.type';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { IDBPerformanceImproveOverview } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';

const limitDataLength = 8;

const defaultItemKey = 'performance-default-key';

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.instance_name,
    value: item.avg_performance_improve
  };
};

const renderTooltipCustomContent = (
  dataSource: Array<{ name: string; value: number }>,
  sqleTheme: SqleTheme,
  sharedTheme: SharedTheme
) => {
  const data = dataSource[0];
  if (!data) return null;
  if (data.name.startsWith(defaultItemKey)) return null;
  return (
    <ChartTooltip
      titleData={{
        dotColor:
          sqleTheme.projectOverview.DataSourcePerformance.toolTip.dotColor,
        text: data.name
      }}
      listData={[
        {
          label: t(
            'projectManage.projectOverview.dataSourcePerformance.toolTip.label'
          ),
          value: `${floatToPercent(data.value)}%`
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

const labelFormatter = (value: string) =>
  value.startsWith(defaultItemKey) ? '' : value;

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
        const { data = [] } = res.data;
        const emptyData: IDBPerformanceImproveOverview[] = [];
        if (data.length) {
          const emptyDataLength =
            limitDataLength - data.length > 0
              ? limitDataLength - data.length
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
        setData(data.concat(emptyData));
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

export {
  renderTooltipFormatter,
  renderTooltipCustomContent,
  defaultItemKey,
  labelFormatter
};
