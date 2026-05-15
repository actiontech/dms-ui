import { useRef, useEffect, useState, useCallback } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { eventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';
import EmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';
import { MessageInstance } from 'antd/es/message/interface';
import { LineConfig } from '@ant-design/plots';

type LineChart = Parameters<Required<LineConfig>['onReady']>[0];
type LineOnEvent = Required<LineConfig>['onEvent'];
type LineOnReady = Required<LineConfig>['onReady'];

interface UseChartEventParams {
  maskInteractionEventName?: EmitterKey;
  transformedData: Array<{
    date: string;
    value?: number;
    type: string;
    status?: number;
  }>;
  loading: boolean;
  onSelectDate?: (dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  messageApi: MessageInstance;
}

interface UseChartEventReturn {
  handleChartEvent: LineOnEvent;
  handleChartReady: LineOnReady;
  maskXPosition: number;
  maskYPosition: number;
  maskWidth: number;
  maskHeight: number;
  clearMask: () => void;
}

export const useChartEvent = ({
  maskInteractionEventName,
  transformedData,
  loading,
  onSelectDate,
  messageApi
}: UseChartEventParams): UseChartEventReturn => {
  const { t } = useTranslation();
  const maskStartXPosition = useRef(0);
  const maskEndXPosition = useRef(0);
  const isMaskCreatedChartRef = useRef(false);
  const chartRef = useRef<LineChart | null>(null);

  // 遮罩相关状态
  const [maskXPosition, setMaskXPosition] = useState<number>(0);
  const [maskYPosition, setMaskYPosition] = useState<number>(0);
  const [maskWidth, setMaskWidth] = useState<number>(0);
  const [maskHeight, setMaskHeight] = useState<number>(0);

  // 处理图表就绪事件
  const handleChartReady = useCallback<LineOnReady>((chart) => {
    chartRef.current = chart;
    const { y, height } = chart.chart.coordinateBBox;
    setMaskYPosition(y);
    setMaskHeight(height);
  }, []);

  // 清除 mask 的函数
  const clearMask = useMemoizedFn(() => {
    maskStartXPosition.current = 0;
    maskEndXPosition.current = 0;
    isMaskCreatedChartRef.current = false;
    setMaskWidth(0);
  });

  useEffect(() => {
    // 当数据或加载状态变化时，清除 mask
    clearMask();
  }, [transformedData, loading, clearMask]);

  // 监听遮罩位置更新事件
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
  }, [maskInteractionEventName]);

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
      if (isMaskCreatedChartRef.current) {
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
    }
    if (type === 'plot:mousemove' && isMaskCreatedChartRef.current) {
      maskEndXPosition.current = event.x;
      eventEmitter.emit(maskInteractionEventName, {
        maskStartXPosition: maskStartXPosition.current,
        maskEndXPosition: event.x
      });
    }
    // 处理鼠标离开图表区域的情况
    if (type === 'plot:mouseleave' && isMaskCreatedChartRef.current) {
      isMaskCreatedChartRef.current = false;
      maskStartXPosition.current = 0;
      maskEndXPosition.current = 0;
      eventEmitter.emit(maskInteractionEventName, {
        maskStartXPosition: 0,
        maskEndXPosition: 0
      });
    }
  });

  return {
    handleChartEvent,
    handleChartReady,
    maskXPosition,
    maskYPosition,
    maskWidth,
    maskHeight,
    clearMask
  };
};
