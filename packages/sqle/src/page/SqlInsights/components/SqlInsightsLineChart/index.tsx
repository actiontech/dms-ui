import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback
} from 'react';
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
  taskEnabledTips?: React.ReactNode;
}

type LineChart = Parameters<Required<LineConfig>['onReady']>[0];
type LineOnReady = Required<LineConfig>['onReady'];
type LineOnEvent = Required<LineConfig>['onEvent'];

/**
 * todo 图表区间选择  只是选择一个时间区间 然后每个图表都选中此时间区间进行高亮
 * 优化为基于实际时间范围进行联动，而不是基于鼠标坐标位置
 */

const SqlInsightsLineChart: React.FC<SqlInsightsLineChartProps> = ({
  loading,
  chartData,
  title,
  className,
  maskInteractionEventName,
  onSelectDate,
  errorInfo,
  isTaskEnabled,
  taskEnabledTips
}) => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();

  // 将API返回的数据转换为图表需要的格式
  const transformedData = useMemo(() => {
    const result: Array<{
      date: string;
      value?: number;
      type: string;
    }> = [];

    chartData.forEach((line) => {
      line.points?.forEach((point) => {
        if (point.x) {
          result.push({
            date: dayjs(point.x).format('MM-DD HH:mm:ss'),
            value: point.y,
            type: line.line_name || ''
          });
        }
      });
    });

    return result;
  }, [chartData]);

  const chartRef = useRef<LineChart | null>(null);
  const isMaskCreatedChartRef = useRef(false);

  // 选择区域的状态
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  // 临时选择区域的状态，用于拖拽过程中的实时显示
  const [tempSelectedTimeRange, setTempSelectedTimeRange] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const config: LineConfig = useMemo(() => {
    // 动态生成annotations，优先显示临时选择区域，否则显示最终选择区域
    const currentRange = tempSelectedTimeRange || selectedTimeRange;

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
      annotations: currentRange
        ? [
            {
              type: 'region' as const,
              start: [currentRange.startTime, 'min'],
              end: [currentRange.endTime, 'max'],
              style: {
                fill: 'rgba(197, 212, 235, 0.6)',
                fillOpacity: 0.6
              }
            }
          ]
        : []
    };
  }, [transformedData, t, selectedTimeRange, tempSelectedTimeRange]);

  const handleChartReady = useCallback<LineOnReady>((chart) => {
    chartRef.current = chart;
  }, []);

  const maskStartXPosition = useRef(0);
  const maskEndXPosition = useRef(0);

  useEffect(() => {
    // 当数据或加载状态变化时，清除选择区域
    // setSelectedTimeRange(null);
    // setSelectedTimeRange(null);
    // setTempSelectedTimeRange(null);
    maskStartXPosition.current = 0;
    maskEndXPosition.current = 0;
    isMaskCreatedChartRef.current = false;
  }, [transformedData, loading]);

  // 辅助函数：根据鼠标位置计算对应的时间范围
  const calculateTimeRangeFromMousePosition = useCallback(
    (chart: LineChart, startX: number, endX: number) => {
      let left = startX;
      let right = endX;
      if (left > right) {
        [left, right] = [right, left];
      }

      let minDate = dayjs().add(10, 'day');
      let maxDate = dayjs().add(-10000, 'day');
      let validPoints = 0;

      for (let i = 0; i < transformedData.length; i++) {
        const current = transformedData[i];
        const point = chart.chart.getXY(current);
        const { x } = point;

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

      return {
        minDate,
        maxDate,
        validPoints
      };
    },
    [transformedData]
  );

  // 新增辅助函数：根据时间范围在当前图表数据中查找对应的数据点和时间范围
  const calculateDisplayTimeRangeFromActualTimeRange = useCallback(
    (startTime: dayjs.Dayjs, endTime: dayjs.Dayjs) => {
      let minDisplayDate = dayjs().add(10, 'day');
      let maxDisplayDate = dayjs().add(-10000, 'day');
      let validPoints = 0;

      // 遍历当前图表的数据，找到落在指定时间范围内的数据点
      for (let i = 0; i < transformedData.length; i++) {
        const current = transformedData[i];
        const currentDate = dayjs(current.date);

        // 检查当前数据点是否在指定的时间范围内
        if (
          (currentDate.isAfter(startTime) || currentDate.isSame(startTime)) &&
          (currentDate.isBefore(endTime) || currentDate.isSame(endTime))
        ) {
          validPoints++;
          if (currentDate.isBefore(minDisplayDate)) {
            minDisplayDate = currentDate;
          }
          if (currentDate.isAfter(maxDisplayDate)) {
            maxDisplayDate = currentDate;
          }
        }
      }

      return {
        minDate: minDisplayDate,
        maxDate: maxDisplayDate,
        validPoints
      };
    },
    [transformedData]
  );

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

      // 开始拖拽时清除临时选择区域
      setTempSelectedTimeRange(null);

      eventEmitter.emit(maskInteractionEventName, {
        maskStartXPosition: event.x,
        maskEndXPosition: event.x,
        type: 'dragging'
      });
    }
    if (type === 'plot:mouseup') {
      isMaskCreatedChartRef.current = false;

      const { minDate, maxDate, validPoints } =
        calculateTimeRangeFromMousePosition(
          chart,
          maskStartXPosition.current,
          maskEndXPosition.current
        );

      if (validPoints === 0) {
        onSelectDate?.(null);
        setSelectedTimeRange(null);
        setTempSelectedTimeRange(null);
        messageApi.info(t('sqlInsights.chart.noValidData'));

        // 通知其他图表清除选择
        eventEmitter.emit(maskInteractionEventName, {
          type: 'clear'
        });
      } else {
        onSelectDate?.([minDate, maxDate]);
        // 设置最终选择区域的时间范围
        setSelectedTimeRange({
          startTime: minDate.format('MM-DD HH:mm:ss'),
          endTime: maxDate.format('MM-DD HH:mm:ss')
        });
        // 清除临时选择区域
        setTempSelectedTimeRange(null);

        // 通知其他图表选择结束，传递实际的时间范围
        eventEmitter.emit(maskInteractionEventName, {
          type: 'selectEnd',
          startTime: minDate,
          endTime: maxDate
        });
      }

      maskStartXPosition.current = 0;
      maskEndXPosition.current = 0;
    }
    if (type === 'plot:mousemove' && isMaskCreatedChartRef.current) {
      const { x } = event;
      maskEndXPosition.current = x;

      // 实时更新临时选择区域
      const { minDate, maxDate, validPoints } =
        calculateTimeRangeFromMousePosition(
          chart,
          maskStartXPosition.current,
          x
        );

      if (validPoints > 0) {
        setTempSelectedTimeRange({
          startTime: minDate.format('MM-DD HH:mm:ss'),
          endTime: maxDate.format('MM-DD HH:mm:ss')
        });

        // 通知其他图表拖拽中，传递实际的时间范围
        eventEmitter.emit(maskInteractionEventName, {
          type: 'dragging',
          startTime: minDate,
          endTime: maxDate
        });
      } else {
        setTempSelectedTimeRange(null);

        eventEmitter.emit(maskInteractionEventName, {
          type: 'dragging'
        });
      }
    }
  });

  useEffect(() => {
    if (maskInteractionEventName) {
      const { unsubscribe } = eventEmitter.subscribe(
        maskInteractionEventName,
        (data: {
          type: 'dragging' | 'selectEnd' | 'clear';
          startTime?: dayjs.Dayjs;
          endTime?: dayjs.Dayjs;
          maskStartXPosition?: number;
          maskEndXPosition?: number;
        }) => {
          // 当其他图表有选择操作时，同步更新当前图表的选择区域
          if (chartRef.current && transformedData.length > 0) {
            if (data.type === 'clear') {
              // 清除选择区域
              setSelectedTimeRange(null);
              setTempSelectedTimeRange(null);
              return;
            }

            if (data.startTime && data.endTime) {
              // 基于实际时间范围进行联动
              const { minDate, maxDate, validPoints } =
                calculateDisplayTimeRangeFromActualTimeRange(
                  data.startTime,
                  data.endTime
                );

              if (data.type === 'selectEnd') {
                // 拖拽结束，设置最终选择区域并清除临时选择区域
                if (validPoints > 0) {
                  setSelectedTimeRange({
                    startTime: minDate.format('MM-DD HH:mm:ss'),
                    endTime: maxDate.format('MM-DD HH:mm:ss')
                  });
                } else {
                  setSelectedTimeRange(null);
                }
                setTempSelectedTimeRange(null);
              } else if (data.type === 'dragging') {
                // 拖拽过程中，更新临时选择区域
                if (validPoints > 0) {
                  setTempSelectedTimeRange({
                    startTime: minDate.format('MM-DD HH:mm:ss'),
                    endTime: maxDate.format('MM-DD HH:mm:ss')
                  });
                } else {
                  setTempSelectedTimeRange(null);
                }
              }
            } else {
              // 如果没有传递时间范围，清除临时选择区域
              if (data.type === 'dragging') {
                setTempSelectedTimeRange(null);
              }
            }
          }
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, [
    maskInteractionEventName,
    transformedData,
    calculateDisplayTimeRangeFromActualTimeRange
  ]);

  return (
    <>
      {messageContextHolder}
      <SqlInsightsLineChartWrapper>
        <h3 className="chart-title">{title}</h3>
        <ChartWrapper
          loading={loading}
          dataLength={transformedData.length}
          emptyCont={taskEnabledTips ?? t('sqlInsights.chart.noData')}
          errorInfo={errorInfo}
        >
          <Line
            {...config}
            onReady={handleChartReady}
            onEvent={handleChartEvent}
          />
        </ChartWrapper>
      </SqlInsightsLineChartWrapper>
    </>
  );
};

export default SqlInsightsLineChart;
