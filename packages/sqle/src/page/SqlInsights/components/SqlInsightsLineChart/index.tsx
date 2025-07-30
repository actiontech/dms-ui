import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { LineConfig, Line } from '@ant-design/plots';
import { ILine } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlInsightsLineChartWrapper } from './style';
import classNames from 'classnames';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { message } from 'antd';
import TaskEnabledTips from '../TaskEnabledTips';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { useChartEvent } from './hooks/useChartEvent';

export interface SqlInsightsLineChartProps {
  loading: boolean;
  chartData: ILine[];
  title: string;
  className?: string;
  /**
   * @title 联动
   * @description 图表联动配置
   */
  maskInteractionEventName?: EmitterKey;
  onSelectDate?: (dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  errorInfo?: string;
  isTaskEnabled?: boolean;
  onGoToEnable?: () => void;
}

const SqlInsightsLineChart: React.FC<SqlInsightsLineChartProps> = ({
  loading,
  chartData,
  title,
  className,
  maskInteractionEventName,
  onSelectDate,
  errorInfo,
  isTaskEnabled,
  onGoToEnable
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const [messageApi, messageContextHolder] = message.useMessage();

  // 将API返回的数据转换为图表需要的格式
  const transformedData = useMemo(() => {
    const result: Array<{
      date: string;
      value?: number;
      type: string;
      status?: number;
    }> = [];

    chartData.forEach((line) => {
      line.points?.forEach((point) => {
        if (point.x) {
          result.push({
            date: formatTime(point.x),
            value: point.y,
            type: line.line_name || '',
            status: point.status
          });
        }
      });
    });

    return result;
  }, [chartData]);

  const config: LineConfig = useMemo(() => {
    const redPointAnnotations = transformedData
      .filter((item) => item.status === 1 && item.value !== undefined)
      .map((item) => ({
        type: 'dataMarker',
        position: [item.date, item.value!],
        text: {
          content: ''
        },
        point: {
          style: {
            fill: sqleTheme.sqlInsight.dataMarkerColor,
            stroke: sqleTheme.sqlInsight.dataMarkerColor,
            r: 4,
            lineWidth: 2
          }
        }
      }));
    return {
      data: transformedData,
      xField: 'date',
      yField: 'value',
      seriesField: 'type',
      xAxis: {
        title: {
          text: t('sqlInsights.chart.xAxisTitle')
        }
      },
      yAxis: {
        title: {
          text: t('sqlInsights.chart.yAxisTitle')
        }
      },
      legend: {
        position: 'top'
      },
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 1000
        }
      },
      interactions: [
        {
          type: 'brush',
          enable: false
        },
        {
          // 为了能保证 mask 长时间停留在图表上，需要重新定义 brush:end 的 actions。但是给 brush:end 添加 actions 后，会导致图表发生 call maximum 的错误。怀疑为 antd-design/plots 的问题。
          // 尝试：即使移除所有功能，只传递 cfg: { end: [{trigger: 'plot:mouseup',action: ['rect-mask:end', 'brush:end']}]} 进去也会触发这个问题。
          type: 'brush-x',
          enable: false
        }
      ],
      annotations: [...redPointAnnotations] as LineConfig['annotations']
    };
  }, [transformedData, t, sqleTheme]);

  const {
    handleChartEvent,
    handleChartReady,
    maskXPosition,
    maskYPosition,
    maskWidth,
    maskHeight
  } = useChartEvent({
    maskInteractionEventName,
    transformedData,
    loading,
    onSelectDate,
    messageApi
  });

  return (
    <>
      {messageContextHolder}
      <SqlInsightsLineChartWrapper>
        <h3 className="chart-title">{title}</h3>
        <div
          className={classNames('chart-container', className)}
          style={{
            position: 'relative'
          }}
        >
          <ChartWrapper
            loading={loading}
            dataLength={transformedData.length}
            emptyCont={
              !isTaskEnabled ? (
                <TaskEnabledTips onGoToEnable={onGoToEnable} />
              ) : (
                t('sqlInsights.chart.noData')
              )
            }
            errorInfo={errorInfo}
          >
            <Line
              {...config}
              onReady={handleChartReady}
              onEvent={handleChartEvent}
            />
          </ChartWrapper>
          <div
            style={{
              display: maskWidth > 0 ? 'block' : 'none',
              position: 'absolute',
              top: maskYPosition,
              left: maskXPosition,
              width: maskWidth,
              height: maskHeight,
              backgroundColor: 'rgba(197, 212, 235, 0.6)',
              pointerEvents: 'none'
            }}
          ></div>
        </div>
      </SqlInsightsLineChartWrapper>
    </>
  );
};

export default SqlInsightsLineChart;
