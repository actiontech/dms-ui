import { Space, Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicSegmented, BasicRangePicker } from '@actiontech/shared';
import { Line, LineConfig, Tooltip } from '@ant-design/plots';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';
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
import i18n from 'i18next';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

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
  if (!data) return null;
  return (
    <ChartTooltip
      titleData={{
        dotColor: sharedTheme.uiToken.colorPrimary,
        text: data.x
      }}
      listData={[
        {
          label: i18n.t('sqlQuery.executePlan.costValue') as string,
          value: data.y
        },
        {
          label: '',
          value: (
            <Button size="small" onClick={() => setHistoryExecPlan(data)}>
              {i18n.t('sqlQuery.executePlan.compareDifference') as string}
            </Button>
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

// type DataRangeType = [Dayjs, Dayjs] | null;

const ExecPlanCostChart: React.FC<ExecPlanCostChartProps> = ({
  sqlExecPlanCostDataSource = [],
  getSqlExecPlanCostDataSource,
  getSqlExecPlanCostDataSourceLoading,
  setHistoryExecPlan,
  getSqlExecPlanCostDataSourceError
}) => {
  const { t } = useTranslation();

  const { currentTheme } = useChangeTheme();

  const { sharedTheme } = useThemeStyleData();

  // const [dateRange, setDateRange] = useState<DataRangeType>();

  const [timePeriod, setTimePeriod] = useState<DateRangeEnum>(
    DateRangeEnum['24H']
  );

  const { data, minPoint, maxPoint } = useMemo(() => {
    return {
      data: sqlExecPlanCostDataSource.map((i) => ({
        ...i,
        x: formatTime(i.x)
      })),
      // averageValue: floor(
      //   sqlExecPlanCostDataSource.reduce(
      //     (sum, next) => sum + (next?.y ?? 0),
      //     0
      //   ) / sqlExecPlanCostDataSource.length,
      //   2
      // ),
      minPoint: sqlExecPlanCostDataSource.reduce(
        (min, next) => ((min?.y ?? 0) > (next?.y ?? 0) ? next : min),
        sqlExecPlanCostDataSource[0]
      ),
      maxPoint: sqlExecPlanCostDataSource.reduce(
        (max, next) => ((max.y ?? 0) < (next.y ?? 0) ? next : max),
        sqlExecPlanCostDataSource[0]
      )
    };
  }, [sqlExecPlanCostDataSource]);

  const dataMarkerCommonSetting = {
    type: 'dataMarker',
    text: {
      content: '',
      style: {
        textAlign: 'left'
      }
    },
    point: {
      style: {
        fill: sharedTheme.basic.colorWhite,
        stroke: sharedTheme.uiToken.colorPrimary
      }
    },
    autoAdjust: false
  };

  const config: LineConfig = {
    data,
    xField: 'x',
    yField: 'y',
    xAxis: {
      range: [0, 1]
    },
    point: {
      style: {
        fill: sharedTheme.basic.colorWhite,
        stroke: sharedTheme.uiToken.colorPrimary
      }
    },
    slider: {
      start: 0,
      end: 1
    },
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
        position: [maxPoint?.x ?? '', maxPoint?.y ?? 0],
        ...dataMarkerCommonSetting
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
      },
      {
        position: [minPoint?.x ?? '', minPoint?.y ?? 0],
        ...dataMarkerCommonSetting
      }
    ],
    tooltip: {
      fields: ['created_time', 'cost', 'id'],
      enterable: true,
      formatter: renderTooltipFormatter,
      customContent: (title: string, dataSource: any[]) =>
        renderTooltipCustomContent(dataSource, sharedTheme, setHistoryExecPlan)
    }
  };

  const onSegmentedChange = (value: SegmentedValue) => {
    setTimePeriod(value as DateRangeEnum);
    let startTime = dayjs().subtract(24, 'hour');
    const endTime = dayjs();
    if (value === DateRangeEnum['7D']) {
      startTime = dayjs().subtract(7, 'day');
    } else if (value === DateRangeEnum['30D']) {
      startTime = dayjs().subtract(30, 'day');
    }
    getSqlExecPlanCostDataSource?.(startTime, endTime);
  };

  const onRefresh = () => {
    // if (date) {
    //   getSqlExecPlanCostDataSource?.(date?.[0], date?.[1]);
    // } else {
    //   onSegmentedChange(timePeriod);
    // }
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
              // setDateRange(value as DataRangeType);
              // onRefresh(value as DataRangeType);
              if (value) {
                getSqlExecPlanCostDataSource?.(
                  value?.[0] ?? undefined,
                  value?.[1] ?? undefined
                );
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
            dataLength={sqlExecPlanCostDataSource.length}
            emptyCont={t('sqlQuery.executePlan.emptyText')}
            onRefresh={onRefresh}
          >
            <Line {...config} theme={currentTheme} />
          </ChartWrapper>
        </Spin>
      </div>
    </SqlAnalyzeCostLineChartStyleWrapper>
  );
};

export default ExecPlanCostChart;