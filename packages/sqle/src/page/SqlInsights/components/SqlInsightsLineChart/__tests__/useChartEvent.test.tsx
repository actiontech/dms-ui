import {
  act,
  renderHook,
  RenderHookResult
} from '@testing-library/react-hooks';
import MockDate from 'mockdate';
import { useChartEvent } from '../hooks/useChartEvent';
import { eventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';
import EmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';
import dayjs from 'dayjs';
import { LineConfig } from '@ant-design/plots';

type LineReadyParams = Parameters<Required<LineConfig>['onReady']>;

type LineEventParams = Parameters<Required<LineConfig>['onEvent']>;

describe('useChartEvent', () => {
  const mockMessageApi = {
    info: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    open: jest.fn(),
    destroy: jest.fn()
  };

  const mockOnSelectDate = jest.fn();

  const mockTransformedData = [
    {
      date: '2023-01-01 12:00:00',
      value: 10,
      type: 'type1',
      status: 0
    },
    {
      date: '2023-01-02 12:00:00',
      value: 20,
      type: 'type1',
      status: 1
    },
    {
      date: '2023-01-03 12:00:00',
      value: 15,
      type: 'type2',
      status: 0
    }
  ];

  const defaultParams = {
    maskInteractionEventName:
      EmitterKey.SQL_INSIGHTS_LINE_CHART_MASK_INTERACTION,
    transformedData: mockTransformedData,
    loading: false,
    onSelectDate: mockOnSelectDate,
    messageApi: mockMessageApi
  };

  let hookResult: RenderHookResult<
    typeof defaultParams,
    ReturnType<typeof useChartEvent>
  >;

  beforeEach(() => {
    MockDate.set(dayjs('2023-01-01 00:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });

    jest.spyOn(eventEmitter, 'emit');
    jest.spyOn(eventEmitter, 'subscribe').mockImplementation(() => ({
      unsubscribe: jest.fn()
    }));
  });

  afterEach(() => {
    hookResult?.unmount();
    jest.clearAllMocks();
    MockDate.reset();
  });

  describe('Initial State', () => {
    it('should return correct initial state', () => {
      hookResult = renderHook(() => useChartEvent(defaultParams));

      expect(hookResult.result.current.maskXPosition).toBe(0);
      expect(hookResult.result.current.maskYPosition).toBe(0);
      expect(hookResult.result.current.maskWidth).toBe(0);
      expect(hookResult.result.current.maskHeight).toBe(0);
      expect(typeof hookResult.result.current.handleChartEvent).toBe(
        'function'
      );
      expect(typeof hookResult.result.current.handleChartReady).toBe(
        'function'
      );
      expect(typeof hookResult.result.current.clearMask).toBe('function');
    });
  });

  describe('handleChartReady', () => {
    it('should correctly set chart boundary information', () => {
      hookResult = renderHook(() => useChartEvent(defaultParams));

      const mockChart = {
        chart: {
          coordinateBBox: {
            x: 50,
            y: 30,
            width: 400,
            height: 200
          }
        }
      } as LineReadyParams[0];

      act(() => {
        hookResult.result.current.handleChartReady(mockChart);
      });

      expect(hookResult.result.current.maskYPosition).toBe(30);
      expect(hookResult.result.current.maskHeight).toBe(200);
    });
  });

  describe('clearMask', () => {
    it('should correctly clear mask state', () => {
      hookResult = renderHook(() => useChartEvent(defaultParams));

      const mockChart = {
        chart: {
          coordinateBBox: { x: 0, y: 0, width: 400, height: 200 }
        }
      } as LineReadyParams[0];

      act(() => {
        hookResult.result.current.handleChartReady(mockChart);
      });

      act(() => {
        hookResult.result.current.clearMask();
      });

      expect(hookResult.result.current.maskWidth).toBe(0);
    });
  });

  describe('handleChartEvent', () => {
    let mockChart: LineEventParams[0];

    beforeEach(() => {
      mockChart = {
        chart: {
          getXY: jest.fn((data) => ({ x: 100, y: 50 }))
        }
      } as unknown as LineEventParams[0];
      hookResult = renderHook(() => useChartEvent(defaultParams));
    });

    it('should return early when maskInteractionEventName is not provided', () => {
      const paramsWithoutEventName = {
        ...defaultParams,
        maskInteractionEventName: undefined
      };
      hookResult = renderHook(() => useChartEvent(paramsWithoutEventName));

      const mockEvent = {
        type: 'plot:mousedown',
        x: 100,
        y: 50
      } as unknown as LineEventParams[1];

      act(() => {
        hookResult.result.current.handleChartEvent(mockChart, mockEvent);
      });

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should correctly handle plot:mousedown event', () => {
      const mockEvent = {
        type: 'plot:mousedown',
        x: 100,
        y: 50
      } as unknown as LineEventParams[1];

      act(() => {
        hookResult.result.current.handleChartEvent(mockChart, mockEvent);
      });

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        defaultParams.maskInteractionEventName,
        {
          maskStartXPosition: 100,
          maskEndXPosition: 100
        }
      );
    });

    it('should correctly handle plot:mousemove event', () => {
      // First trigger mousedown
      act(() => {
        hookResult.result.current.handleChartEvent(mockChart, {
          type: 'plot:mousedown',
          x: 100,
          y: 50
        } as unknown as LineEventParams[1]);
      });

      // Then trigger mousemove
      const mockMoveEvent = {
        type: 'plot:mousemove',
        x: 150,
        y: 60
      } as unknown as LineEventParams[1];

      act(() => {
        hookResult.result.current.handleChartEvent(mockChart, mockMoveEvent);
      });

      expect(eventEmitter.emit).toHaveBeenLastCalledWith(
        defaultParams.maskInteractionEventName,
        {
          maskStartXPosition: 100,
          maskEndXPosition: 150
        }
      );
    });

    it('should correctly handle plot:mouseleave event', () => {
      // First trigger mousedown
      act(() => {
        hookResult.result.current.handleChartEvent(mockChart, {
          type: 'plot:mousedown',
          x: 100,
          y: 50
        } as unknown as LineEventParams[1]);
      });

      // Then trigger mouseleave
      act(() => {
        hookResult.result.current.handleChartEvent(mockChart, {
          type: 'plot:mouseleave',
          x: 200,
          y: 100
        } as unknown as LineEventParams[1]);
      });

      expect(eventEmitter.emit).toHaveBeenLastCalledWith(
        defaultParams.maskInteractionEventName,
        {
          maskStartXPosition: 0,
          maskEndXPosition: 0
        }
      );
    });

    describe('plot:mouseup event handling', () => {
      beforeEach(() => {
        // Mock valid data points
        mockChart.chart.getXY = jest
          .fn()
          .mockReturnValueOnce({ x: 120 })
          .mockReturnValueOnce({ x: 80 })
          .mockReturnValueOnce({ x: 130 });
      });

      it('should call onSelectDate when there is valid selection', () => {
        // First trigger mousedown
        act(() => {
          hookResult.result.current.handleChartEvent(mockChart, {
            type: 'plot:mousedown',
            x: 100,
            y: 50
          } as unknown as LineEventParams[1]);
        });

        // Then trigger mouseup
        act(() => {
          hookResult.result.current.handleChartEvent(mockChart, {
            type: 'plot:mouseup',
            x: 150,
            y: 50
          } as unknown as LineEventParams[1]);
        });

        expect(mockOnSelectDate).toHaveBeenCalled();
      });

      it('should show message when there is no valid selection', () => {
        // Mock getXY to return values outside the range
        mockChart.chart.getXY = jest.fn().mockReturnValue({ x: 50 });
        // First trigger mousedown
        act(() => {
          hookResult.result.current.handleChartEvent(mockChart, {
            type: 'plot:mousedown',
            x: 100,
            y: 50
          } as unknown as LineEventParams[1]);
        });

        // Then trigger mouseup
        act(() => {
          hookResult.result.current.handleChartEvent(mockChart, {
            type: 'plot:mouseup',
            x: 150,
            y: 50
          } as unknown as LineEventParams[1]);
        });

        expect(mockOnSelectDate).toHaveBeenCalledWith(null);
        expect(mockMessageApi.info).toHaveBeenCalledWith(
          '选区中没有任何有效数据'
        );
      });
    });
  });

  describe('eventEmitter subscription', () => {
    it('should correctly subscribe and handle mask position update events', () => {
      const mockSubscribe = jest.fn();
      const mockUnsubscribe = jest.fn();
      (eventEmitter.subscribe as jest.Mock).mockImplementation(
        (eventName, callback) => {
          mockSubscribe(eventName, callback);
          return { unsubscribe: mockUnsubscribe };
        }
      );

      hookResult = renderHook(() => useChartEvent(defaultParams));

      expect(mockSubscribe).toHaveBeenCalledWith(
        defaultParams.maskInteractionEventName,
        expect.any(Function)
      );

      // Simulate event callback
      const callback = mockSubscribe.mock.calls[0][1];
      act(() => {
        callback({
          maskStartXPosition: 50,
          maskEndXPosition: 150
        });
      });

      expect(hookResult.result.current.maskXPosition).toBe(50);
      expect(hookResult.result.current.maskWidth).toBe(100);
    });

    it('should correctly handle reverse selection (right to left)', () => {
      const mockSubscribe = jest.fn();
      (eventEmitter.subscribe as jest.Mock).mockImplementation(
        (eventName, callback) => {
          mockSubscribe(eventName, callback);
          return { unsubscribe: jest.fn() };
        }
      );

      hookResult = renderHook(() => useChartEvent(defaultParams));

      const callback = mockSubscribe.mock.calls[0][1];
      act(() => {
        callback({
          maskStartXPosition: 150,
          maskEndXPosition: 50
        });
      });

      expect(hookResult.result.current.maskXPosition).toBe(50);
      expect(hookResult.result.current.maskWidth).toBe(100);
    });

    it('should not subscribe to events when maskInteractionEventName is not provided', () => {
      const paramsWithoutEventName = {
        ...defaultParams,
        maskInteractionEventName: undefined
      };

      hookResult = renderHook(() => useChartEvent(paramsWithoutEventName));

      expect(eventEmitter.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('cleanup on data changes', () => {
    it('should clear mask when transformedData changes', () => {
      hookResult = renderHook((props) => useChartEvent(props), {
        initialProps: defaultParams
      });

      // Set some initial state
      act(() => {
        hookResult.result.current.handleChartReady({
          chart: { coordinateBBox: { x: 0, y: 0, width: 400, height: 200 } }
        } as unknown as LineReadyParams[0]);
      });

      const newTransformedData = [
        ...mockTransformedData,
        {
          date: '2023-01-04 12:00:00',
          value: 25,
          type: 'type3',
          status: 0
        }
      ];

      // Update data
      act(() => {
        hookResult.rerender({
          ...defaultParams,
          transformedData: newTransformedData
        });
      });

      expect(hookResult.result.current.maskWidth).toBe(0);
    });

    it('should clear mask when loading state changes', () => {
      hookResult = renderHook((props) => useChartEvent(props), {
        initialProps: defaultParams
      });

      // Update loading state
      act(() => {
        hookResult.rerender({
          ...defaultParams,
          loading: true
        });
      });

      expect(hookResult.result.current.maskWidth).toBe(0);
    });
  });

  describe('cleanup functions', () => {
    it('should unsubscribe from events when component unmounts', () => {
      const mockUnsubscribe = jest.fn();
      (eventEmitter.subscribe as jest.Mock).mockImplementation(() => ({
        unsubscribe: mockUnsubscribe
      }));

      hookResult = renderHook(() => useChartEvent(defaultParams));

      act(() => {
        hookResult.unmount();
      });

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
