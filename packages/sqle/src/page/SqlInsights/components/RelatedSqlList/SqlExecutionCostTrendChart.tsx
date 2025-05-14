import { Spin, Typography } from 'antd';
import { Scatter, ScatterConfig, Tooltip } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { useMemoizedFn } from 'ahooks';

const SqlExecutionCostTrendChartStyleWrapper = styled('section')`
  .chart-wrapper {
    width: 800px;
    height: 400px;
  }
`;

const TooltipAnalyzeButtonStyleWrapper = styled('span')`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export interface SqlExecutionCostTrendChartProps {
  record: IRelatedSQLInfo;
  loading?: boolean;
}

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item?.x,
    value: item?.y
  };
};

type ScatterOnEventType = Required<ScatterConfig>['onEvent'];

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme,
  t: (key: string) => string
) => {
  const data = dataSource[0]?.data;
  if (!data || data.time === undefined) return null;
  return (
    <ChartTooltip
      titleData={{
        dotColor: sharedTheme.uiToken.colorPrimary,
        text: dayjs(data.time).format('MM-DD HH:mm:ss')
      }}
      listData={[
        {
          label: 'SQL',
          value: (
            <Typography.Text ellipsis style={{ maxWidth: 150 }}>
              {data.sql}
            </Typography.Text>
          )
        },
        {
          label: t(
            'sqlInsights.relatedSqlList.sqlFingerprintDetail.chart.yAxisTitle'
          ),
          value: data.cost
        },
        {
          label: (
            <TooltipAnalyzeButtonStyleWrapper
              style={{ color: sharedTheme.uiToken.colorTextTertiary }}
            >
              {t(
                'sqlInsights.relatedSqlList.sqlFingerprintDetail.chart.analyzeButtonText'
              )}
            </TooltipAnalyzeButtonStyleWrapper>
          )
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

const SqlExecutionCostTrendChart: React.FC<SqlExecutionCostTrendChartProps> = ({
  record,
  loading = false
}) => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sharedTheme } = useThemeStyleData();

  const { data } = useMemo(() => {
    return {
      data: record.execution_cost_trend?.points || []
    };
  }, [record.execution_cost_trend]);

  const config: ScatterConfig = useMemo(() => {
    return {
      data,
      xField: 'time',
      yField: 'cost',
      width: 800,
      height: 400,
      colorField: 'sql',
      xAxis: {
        nice: true,
        label: {
          formatter: (value) => {
            return dayjs(value).format('MM-DD HH:mm:ss');
          }
        },
        title: {
          text: record.execution_cost_trend?.x_info
        }
      },
      yAxis: {
        title: {
          text: record.execution_cost_trend?.y_info
        }
      },
      appendPadding: 20,
      tooltip: {
        fields: ['time', 'cost'],
        formatter: renderTooltipFormatter,
        customContent: (title: string, dataSource: any[]) =>
          renderTooltipCustomContent(dataSource, sharedTheme, t)
      },
      interactions: [
        {
          type: 'element-highlight-by-color'
        }
      ]
    };
  }, [data, sharedTheme, t, record.execution_cost_trend]);

  const onEvent = useMemoizedFn<ScatterOnEventType>((_, event) => {
    if (event.type === 'element:click') {
      console.log(event.data);
      // fixme: 添加跳转到SQL分析页面。但是参数是什么需要跟后端讨论。
    }
  });

  return (
    <SqlExecutionCostTrendChartStyleWrapper>
      <div className="chart-wrapper">
        <Spin spinning={loading}>
          <ChartWrapper
            loading={false}
            errorInfo=""
            dataLength={data.length}
            emptyCont={t('sqlInsights.chart.noData')}
          >
            <Scatter {...config} theme={currentTheme} onEvent={onEvent} />
          </ChartWrapper>
        </Spin>
      </div>
    </SqlExecutionCostTrendChartStyleWrapper>
  );
};

export default SqlExecutionCostTrendChart;
