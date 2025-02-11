import { Space, Spin, message } from 'antd';
import { BasicSegmented, BasicRangePicker } from '@actiontech/shared';
import { Line, LineConfig, Tooltip } from '@ant-design/plots';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { SqlAnalyzeCostLineChartStyleWrapper } from '../style';
import dayjs, { Dayjs } from 'dayjs';
import { DateRangeOptions, DateRangeEnum } from './index.data';
import { ExecPlanCostChartProps } from '../index';
import { SegmentedValue } from 'antd/es/segmented';
import { useState, useMemo } from 'react';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { t } from '../../../../locale/index';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import { CompareExecutionPlanButtonStyleWrapper } from './style';
import { range } from 'lodash';

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item?.x,
    value: item?.y
  };
};

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme
) => {
  const data = dataSource[0]?.data;
  if (!data || data.y === undefined) return null;
  return (
    <ChartTooltip
      titleData={{
        dotColor: sharedTheme.uiToken.colorPrimary,
        text: data.x
      }}
      listData={[
        {
          label: t('sqlQuery.executePlan.cost'),
          value: data.y
        },
        {
          label: (
            <CompareExecutionPlanButtonStyleWrapper
              style={{ color: sharedTheme.uiToken.colorTextTertiary }}
            >
              {t('sqlQuery.executePlan.compareTips')}
            </CompareExecutionPlanButtonStyleWrapper>
          )
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

const ExecPlanCostChart: React.FC<ExecPlanCostChartProps> = ({
  sqlExecPlanCostDataSource = [],
  getSqlExecPlanCostDataSource,
  getSqlExecPlanCostDataSourceLoading,
  getSqlExecPlanCostDataSourceError,
  initTime,
  selectedPoint,
  setSelectedPoint,
  onScrollIntoView
}) => {
  const { currentTheme } = useChangeTheme();

  const { sharedTheme } = useThemeStyleData();

  const [messageApi, contextHolder] = message.useMessage();

  const [timePeriod, setTimePeriod] = useState<DateRangeEnum>(
    DateRangeEnum['24H']
  );

  const { data, exceptUndefinedDataSource } = useMemo(() => {
    const filteredDataSource = sqlExecPlanCostDataSource.filter(
      (i) => i.y !== undefined
    );
    return {
      data: sqlExecPlanCostDataSource,
      exceptUndefinedDataSource: filteredDataSource
      // averageValue: floor(
      //   sqlExecPlanCostDataSource.reduce(
      //     (sum, next) => sum + (next?.y ?? 0),
      //     0
      //   ) / sqlExecPlanCostDataSource.length,
      //   2
      // ),
    };
  }, [sqlExecPlanCostDataSource]);

  const config: LineConfig = useMemo(() => {
    return {
      data,
      xField: 'x',
      yField: 'y',
      xAxis: {
        nice: true
      },
      point: {
        style: {
          fill: sharedTheme.basic.colorWhite,
          stroke: sharedTheme.uiToken.colorPrimary
        },
        size: 5
      },
      slider: {
        start: 0,
        end: 1
      },
      appendPadding: 20,
      annotations: [
        // todo 平均值和平均线 本期不需要展示 代码暂时保留
        // {
        //   type: 'line',
        //   start: ['min', averageValue],
        //   end: ['max', averageValue],
        //   style: {
        //     stroke: sharedTheme.uiToken.colorPrimary,
        //     lineWidth: 2,
        //     lineDash: [5, 5]
        //   }
        // },
        // {
        //   type: 'text',
        //   position: ['max', averageValue],
        //   content: averageValue,
        //   offsetY: -10,
        //   style: {
        //     fill: sharedTheme.uiToken.colorPrimary,
        //     fontSize: 12
        //   }
        // },
        {
          type: 'line',
          start: [selectedPoint?.[0]?.x ?? '', 'min'],
          end: [selectedPoint?.[0]?.x ?? '', 'max'],
          style: {
            stroke: sharedTheme.basic.colorDangerousActive,
            lineWidth: 2
          },
          animate: false
        },
        {
          type: 'line',
          start: [selectedPoint?.[1]?.x ?? '', 'min'],
          end: [selectedPoint?.[1]?.x ?? '', 'max'],
          style: {
            stroke: sharedTheme.basic.colorDangerousActive,
            lineWidth: 2
          },
          animate: false
        }
      ],
      tooltip: {
        fields: ['created_time', 'cost', 'id'],
        formatter: renderTooltipFormatter,
        customContent: (title: string, dataSource: any[]) =>
          renderTooltipCustomContent(dataSource, sharedTheme)
      }
    };
  }, [data, sharedTheme, selectedPoint]);

  const onSegmentedChange = (value: SegmentedValue) => {
    setTimePeriod(value as DateRangeEnum);
    let startTime = dayjs(initTime).subtract(24, 'hour');
    if (value === DateRangeEnum['7D']) {
      startTime = dayjs(initTime).subtract(7, 'day');
    } else if (value === DateRangeEnum['30D']) {
      startTime = dayjs(initTime).subtract(30, 'day');
    }
    getSqlExecPlanCostDataSource?.({
      startTime,
      endTime: initTime,
      lastPointEnabled: true,
      rangeType: value as DateRangeEnum
    });
  };

  const onRefresh = () => {
    onSegmentedChange(DateRangeEnum['24H']);
  };

  const disabledTime = (date: Dayjs | null) => {
    if (date && date.isSame(initTime, 'day')) {
      const hours = initTime?.hour() ?? 0;
      const minutes = initTime?.minute() ?? 0;
      const seconds = initTime?.second() ?? 0;

      const disabledConfig = {
        disabledHours: () => range(hours + 1, 24),
        disabledMinutes: (selectedHour: number) =>
          selectedHour === hours ? range(minutes + 1, 60) : [],
        disabledSeconds: (selectedHour: number, selectedMinute: number) =>
          selectedHour === hours && selectedMinute === minutes
            ? range(seconds + 1, 60)
            : []
      };

      return disabledConfig;
    }
    return {};
  };

  return (
    <SqlAnalyzeCostLineChartStyleWrapper>
      {contextHolder}
      <Space className="filter-wrapper">
        <h3>{t('sqlQuery.executePlan.planCost')}</h3>
        <Space>
          <BasicSegmented
            value={timePeriod}
            options={DateRangeOptions}
            onChange={onSegmentedChange}
          />
          <BasicRangePicker
            size="small"
            showTime={{
              defaultValue: [
                dayjs('00:00:00', 'HH:mm:ss'),
                dayjs('00:00:00', 'HH:mm:ss')
              ]
            }}
            disabledDate={(current) => {
              return current && current > dayjs().endOf('day');
            }}
            disabledTime={disabledTime}
            onChange={(value) => {
              if (value) {
                getSqlExecPlanCostDataSource?.({
                  startTime: value?.[0] ?? undefined,
                  endTime: value?.[1] ?? undefined
                });
              } else {
                onSegmentedChange(timePeriod);
              }
            }}
          />
        </Space>
      </Space>
      <div className="chart-wrapper">
        <Spin spinning={getSqlExecPlanCostDataSourceLoading}>
          <ChartWrapper
            loading={false}
            errorInfo={getSqlExecPlanCostDataSourceError}
            dataLength={exceptUndefinedDataSource.length}
            emptyCont={t('sqlQuery.executePlan.emptyText')}
            onRefresh={onRefresh}
          >
            <Line
              {...config}
              theme={currentTheme}
              onEvent={(chart, event) => {
                const { type, data: eventData } = event;
                if (
                  type === 'click' &&
                  !!eventData?.data &&
                  !!eventData?.data?.x
                ) {
                  setSelectedPoint?.((state) => {
                    const { x } = eventData?.data ?? {};
                    if (state.some((i) => i?.x === x)) {
                      return state.filter((i) => i?.x !== x);
                    }
                    if (state.length < 2) {
                      onScrollIntoView();
                      return [...state, event.data?.data];
                    }
                    messageApi.info(
                      t('sqlQuery.executePlan.compareCountLimitTips')
                    );
                    return state;
                  });
                }
              }}
            />
          </ChartWrapper>
        </Spin>
      </div>
    </SqlAnalyzeCostLineChartStyleWrapper>
  );
};

export default ExecPlanCostChart;
