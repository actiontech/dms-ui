import { Space, Spin } from 'antd';
import { BasicSegmented, BasicRangePicker } from '@actiontech/shared';
import { Line, LineConfig, Tooltip } from '@ant-design/plots';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { SqlAnalyzeCostLineChartStyleWrapper } from '../style';
import dayjs from 'dayjs';
import { DateRangeOptions, DateRangeEnum } from './index.data';
import { ExecPlanCostChartProps } from '../index';
import { SegmentedValue } from 'antd/es/segmented';
import { useState, useMemo } from 'react';
import { IChartPoint } from '@actiontech/shared/lib/api/sqle/service/common';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { t } from '../../../../locale/index';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import { CompareExecutionPlanButtonStyleWrapper } from './style';

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item?.x,
    value: item?.y
  };
};

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme,
  setHistoryExecPlan: ExecPlanCostChartProps['setHistoryExecPlan']
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
          label: '',
          value: (
            <CompareExecutionPlanButtonStyleWrapper
              onClick={() => setHistoryExecPlan(data)}
            >
              {t('sqlQuery.executePlan.compareDifference')}
            </CompareExecutionPlanButtonStyleWrapper>
          )
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

const renderAnnotationsContent = (value: number) => {
  return value;
};

const renderAnnotationsPosition = (maxVal: IChartPoint) => {
  return [maxVal?.x, maxVal?.y];
};

const ExecPlanCostChart: React.FC<ExecPlanCostChartProps> = ({
  sqlExecPlanCostDataSource = [],
  getSqlExecPlanCostDataSource,
  getSqlExecPlanCostDataSourceLoading,
  setHistoryExecPlan,
  getSqlExecPlanCostDataSourceError
}) => {
  const { currentTheme } = useChangeTheme();

  const { sharedTheme } = useThemeStyleData();

  const [timePeriod, setTimePeriod] = useState<DateRangeEnum>(
    DateRangeEnum['24H']
  );

  // const [annotations, setAnnotations] = useState<IChartPoint[]>([]);

  const { data, minPoint, maxPoint, exceptUndefinedDataSource } =
    useMemo(() => {
      const dataSource = sqlExecPlanCostDataSource.map((i) => ({
        ...i,
        x: formatTime(i.x)
      }));
      const filteredDataSource = dataSource.filter((i) => i.y !== undefined);
      return {
        data: dataSource,
        exceptUndefinedDataSource: filteredDataSource,
        // averageValue: floor(
        //   sqlExecPlanCostDataSource.reduce(
        //     (sum, next) => sum + (next?.y ?? 0),
        //     0
        //   ) / sqlExecPlanCostDataSource.length,
        //   2
        // ),
        minPoint: filteredDataSource
          .filter((i) => i.y !== undefined)
          .reduce(
            (min, next) => ((min?.y ?? 0) > (next?.y ?? 0) ? next : min),
            filteredDataSource[0]
          ),
        maxPoint: filteredDataSource
          .filter((i) => i.y !== undefined)
          .reduce(
            (max, next) => ((max.y ?? 0) < (next.y ?? 0) ? next : max),
            filteredDataSource[0]
          )
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
        size: 4
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
        // todo 可以任意对比两个时间点的Cost 产品交互尚未完善 暂时注释相关代码
        // {
        //   type: 'line',
        //   start: [annotations?.[0]?.x ?? '', 'min'],
        //   end: [annotations?.[0]?.x ?? '', 'max'],
        //   style: {
        //     stroke: sharedTheme.basic.colorDangerousActive,
        //     lineWidth: 2
        //   }
        // },
        // {
        //   type: 'line',
        //   start: [annotations?.[1]?.x ?? '', 'min'],
        //   end: [annotations?.[1]?.x ?? '', 'max'],
        //   style: {
        //     stroke: sharedTheme.basic.colorDangerousActive,
        //     lineWidth: 2
        //   }
        // },
        {
          type: 'text',
          content: renderAnnotationsContent(maxPoint?.y ?? 0),
          position: renderAnnotationsPosition(maxPoint) as [string, number],
          style: {
            textAlign: 'center',
            fill: sharedTheme.basic.colorWhite
          },
          offsetY: -16,
          background: {
            padding: 4,
            style: {
              radius: 4,
              fill: sharedTheme.uiToken.colorPrimary
            }
          }
        },
        {
          type: 'text',
          content: renderAnnotationsContent(minPoint?.y ?? 0),
          position: renderAnnotationsPosition(minPoint) as [string, number],
          style: {
            textAlign: 'center',
            fill: sharedTheme.basic.colorWhite
          },
          offsetY: -16,
          background: {
            padding: 4,
            style: {
              radius: 4,
              fill: sharedTheme.uiToken.colorPrimary
            }
          }
        }
      ],
      tooltip: {
        fields: ['created_time', 'cost', 'id'],
        enterable: true,
        follow: true,
        formatter: renderTooltipFormatter,
        customContent: (title: string, dataSource: any[]) =>
          renderTooltipCustomContent(
            dataSource,
            sharedTheme,
            setHistoryExecPlan
          )
      }
    };
  }, [data, maxPoint, minPoint, sharedTheme, setHistoryExecPlan]);

  const onSegmentedChange = (value: SegmentedValue) => {
    setTimePeriod(value as DateRangeEnum);
    let startTime = dayjs().subtract(24, 'hour');
    const endTime = dayjs();
    if (value === DateRangeEnum['7D']) {
      startTime = dayjs().subtract(7, 'day');
    } else if (value === DateRangeEnum['30D']) {
      startTime = dayjs().subtract(30, 'day');
    }
    getSqlExecPlanCostDataSource?.({
      startTime,
      endTime,
      lastPointEnabled: value === DateRangeEnum['24H']
    });
  };

  const onRefresh = () => {
    onSegmentedChange(DateRangeEnum['24H']);
  };

  return (
    <SqlAnalyzeCostLineChartStyleWrapper>
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
            showTime
            disabledDate={(current) => {
              return current && current > dayjs().endOf('day');
            }}
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
              // todo 可以任意对比两个时间点的Cost 产品交互尚未完善 暂时注释相关代码
              // onEvent={(chart, event) => {
              //   const { type } = event;
              //   if (type === 'point:click') {
              //     // updateChart(event);
              //     setAnnotations((state) => {
              //       const { x } = event.data?.data ?? {};
              //       if (state.some((i) => i.x === x)) {
              //         return state.filter((i) => i.x !== x);
              //       }
              //       if (state.length < 2) {
              //         return [...state, event.data?.data];
              //       }
              //       return state;
              //     });
              //   }
              // }}
            />
          </ChartWrapper>
        </Spin>
      </div>
    </SqlAnalyzeCostLineChartStyleWrapper>
  );
};

export default ExecPlanCostChart;
