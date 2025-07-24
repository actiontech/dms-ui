import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { LineConfig, Line } from '@ant-design/plots';
import { ILine } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlInsightsLineChartWrapper } from './style';
import classNames from 'classnames';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { message } from 'antd';
import { useMemoizedFn } from 'ahooks';
import TaskEnabledTips from '../TaskEnabledTips';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

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

type LineChart = Parameters<Required<LineConfig>['onReady']>[0];
type LineOnReady = Required<LineConfig>['onReady'];
type LineOnEvent = Required<LineConfig>['onEvent'];

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
            date: dayjs(point.x).format('YYYY-MM-DD HH:mm:ss'),
            value: point.y,
            type: line.line_name || '',
            status: point.status
          });
        }
      });
    });

    return result;
  }, [chartData]);

  const chartRef = useRef<LineChart | null>(null);
  const isMaskCreatedChartRef = useRef(false);

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

  const [maskXPosition, setMaskXPosition] = useState<number>(0);
  const [maskYPosition, setMaskYPosition] = useState<number>(0);
  const [maskWidth, setMaskWidth] = useState<number>(0);
  const [maskHeight, setMaskHeight] = useState<number>(0);

  const handleChartReady = useCallback<LineOnReady>((chart) => {
    chartRef.current = chart;
    const { y, height } = chart.chart.coordinateBBox;
    setMaskYPosition(y);
    setMaskHeight(height);
  }, []);

  const maskStartXPosition = useRef(0);
  const maskEndXPosition = useRef(0);

  useEffect(() => {
    // 当数据或加载状态变化时，清除 mask
    setMaskWidth(0);
    maskStartXPosition.current = 0;
    maskEndXPosition.current = 0;
    isMaskCreatedChartRef.current = false;
  }, [transformedData, loading]);

  // fixme: 当前 antd-design/plots 的版本为1.x，底层g2的版本为4.x,这个版本的g2无法通过 emit 的方式提交 brush-x 事件。只能绕过处理。等升级后，需要使用原生 brushXHighlight 等事件重写这个功能。
  const handleChartEvent = useMemoizedFn<LineOnEvent>((chart, event) => {
    if (!maskInteractionEventName) {
      return;
    }
    const type = event.type;
    if (type === 'plot:mousedown' && !isMaskCreatedChartRef.current) {
      isMaskCreatedChartRef.current = true;
      maskStartXPosition.current = event.x;
      maskEndXPosition.current = event.x;
      eventEmitter.emit(maskInteractionEventName, {
        maskStartXPosition: event.x,
        maskEndXPosition: event.x
      });
    }
    if (type === 'plot:mouseup') {
      isMaskCreatedChartRef.current = false;
      let minDate = dayjs().add(10, 'day');
      let maxDate = dayjs().add(-10000, 'day');
      let validPoints = 0;
      for (let i = 0; i < transformedData.length; i++) {
        const current = transformedData[i];
        const point = chart.chart.getXY(current);
        const { x } = point;
        let left = maskStartXPosition.current;
        let right = maskEndXPosition.current;
        if (left > right) {
          [left, right] = [right, left];
        }
        if (x >= left && x <= right) {
          validPoints++;
          const currentDate = dayjs(current.date);
          if (currentDate.isBefore(minDate)) {
            minDate = currentDate;
          }
          if (currentDate.isAfter(maxDate)) {
            maxDate = currentDate;
          }
        }
      }
      if (validPoints === 0) {
        onSelectDate?.(null);
        messageApi.info(t('sqlInsights.chart.noValidData'));
      } else {
        onSelectDate?.([minDate, maxDate]);
      }
      maskStartXPosition.current = 0;
      maskEndXPosition.current = 0;
    }
    if (type === 'plot:mousemove' && isMaskCreatedChartRef.current) {
      const { x } = event;
      maskEndXPosition.current = x;
      eventEmitter.emit(maskInteractionEventName, {
        maskStartXPosition: maskStartXPosition.current,
        maskEndXPosition: x
      });
    }
  });

  useEffect(() => {
    if (maskInteractionEventName) {
      const { unsubscribe } = eventEmitter.subscribe(
        maskInteractionEventName,
        (data: { maskStartXPosition: number; maskEndXPosition: number }) => {
          let left = data.maskStartXPosition;
          let right = data.maskEndXPosition;
          if (left > right) {
            [left, right] = [right, left];
          }
          setMaskXPosition(left);
          setMaskWidth(right - left);
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, [maskInteractionEventName, maskXPosition]);

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
            onMouseUp={() => {
              isMaskCreatedChartRef.current = false;
            }}
          ></div>
        </div>
      </SqlInsightsLineChartWrapper>
    </>
  );
};

export default SqlInsightsLineChart;
