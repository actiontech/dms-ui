import CardWrapper from '../../../../components/CardWrapper';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Area, AreaConfig, Tooltip } from '@ant-design/plots';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { IOptimizationRecordOverview } from '@actiontech/shared/lib/api/sqle/service/common';
import { OrderQuantityTrendExtraStyleWrapper } from '../../../ReportStatistics/EEIndex/component/charts/OrderQuantityTrend/style';
import { BasicRangePicker } from '@actiontech/shared';
import Icon from '@ant-design/icons/lib/components/Icon';
import { IconRightArrow } from '@actiontech/shared/lib/Icon';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { t } from '../../../../locale';

const renderAreaStyle = (sharedTheme: SharedTheme) => {
  return {
    fill: `l(90) 0:${sharedTheme.uiToken.colorPrimary}  1:#4583ff00`
  };
};

const renderAnnotationsContent = (value: number) => {
  return value;
};

const renderAnnotationsPosition = (maxVal: IOptimizationRecordOverview) => {
  return [maxVal.time, maxVal.record_number];
};

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.time,
    value: item.record_number
  };
};

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme
) => {
  const data = dataSource[0];
  if (!data) return null;

  return (
    <ChartTooltip
      titleData={{
        dotColor: sharedTheme.uiToken.colorPrimary,
        text: data.name
      }}
      listData={[
        {
          label: t(
            'projectManage.projectOverview.optimizationDistribution.toolTip.label'
          ),
          value: data.value
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

const dateFormat = 'YYYY-MM-DD';

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const OptimizationDistribution = () => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  const { currentTheme } = useChangeTheme();

  const defaultRangeValue: RangePickerProps['defaultValue'] = [
    dayjs().subtract(30, 'day'),
    dayjs()
  ];

  const [range, setRange] = useState<RangeValue>(defaultRangeValue);

  const [data, setData] = useState<IOptimizationRecordOverview[]>([]);

  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () =>
      sqlOptimization.getOptimizationOverview({
        project_name: projectName,
        filter_create_time_from:
          range?.[0]?.format(dateFormat) ??
          defaultRangeValue[0]!.format(dateFormat),
        filter_create_time_to:
          range?.[1]?.format(dateFormat) ??
          defaultRangeValue[1]!.format(dateFormat)
      }),
    {
      onSuccess: (res) => {
        setData(res.data.data ?? []);
      }
    }
  );

  const maxVal = useMemo(() => {
    if (!data.length) {
      return {
        time: '',
        record_number: 0
      };
    }
    let valueFlag = {
      time: '',
      record_number: 0
    };
    data.forEach((item: IOptimizationRecordOverview) => {
      if (
        typeof item?.record_number === 'number' &&
        item.record_number > valueFlag.record_number
      ) {
        valueFlag = {
          time: item?.time ?? '',
          record_number: item.record_number
        };
      }
    });
    return valueFlag;
  }, [data]);

  const { sharedTheme } = useThemeStyleData();

  const config: AreaConfig = {
    data,
    xField: 'time',
    yField: 'record_number',
    appendPadding: [30, 0],
    xAxis: {
      range: [0, 1],
      tickCount: 7
    },
    yAxis: {
      animate: false,
      label: null
    },
    areaStyle: renderAreaStyle(sharedTheme),
    line: {
      size: 3,
      color: sharedTheme.uiToken.colorPrimary
    },
    smooth: true, // 是否配置平滑
    annotations: [
      {
        type: 'text',
        content: renderAnnotationsContent(maxVal.record_number),
        position: renderAnnotationsPosition(maxVal) as [string, number],
        /** 图形样式属性 */
        style: {
          textAlign: 'center',
          fill: sharedTheme.basic.colorWhite
        },
        // 设置偏移
        offsetY: -16,
        // 设置文本包围框
        background: {
          padding: 4,
          style: {
            radius: 4,
            fill: sharedTheme.uiToken.colorPrimary
          }
        }
      },
      {
        type: 'dataMarker',
        position: [maxVal.time, maxVal.record_number],
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
      }
    ],
    tooltip: {
      fields: ['time', 'record_number'],
      formatter: renderTooltipFormatter,
      customContent: (title: string, dataSource: any[]) =>
        renderTooltipCustomContent(dataSource, sharedTheme)
    },
    interactions: [
      {
        type: 'element-selected'
      },
      {
        type: 'element-active'
      }
    ]
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current: Dayjs) => {
    if (!range) {
      return false;
    }
    const noAfterToday = current && current > dayjs().endOf('day');
    const exceedLimitDay = 90;
    const tooLate = range[0] && current.diff(range[0], 'days') > exceedLimitDay;
    const tooEarly =
      range[1] && range[1].diff(current, 'days') > exceedLimitDay;
    return noAfterToday || !!tooEarly || !!tooLate;
  };

  const onChange = (values: RangeValue) => {
    setRange(values);
  };

  useEffect(() => {
    getApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.optimizationDistribution.title')}
      extraNode={
        <OrderQuantityTrendExtraStyleWrapper>
          <span className="label">
            {t(
              'projectManage.projectOverview.optimizationDistribution.timeLabel'
            )}
          </span>
          <BasicRangePicker
            size="small"
            bordered={false}
            allowClear={false}
            className="orderQuantityTrend-range"
            format={dateFormat}
            suffixIcon={<></>}
            separator={<Icon component={IconRightArrow} />}
            defaultValue={defaultRangeValue}
            value={range}
            disabledDate={disabledDate}
            onChange={onChange}
          />
        </OrderQuantityTrendExtraStyleWrapper>
      }
    >
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={data.length}
        emptyCont={t('common.tip.no_data')}
        onRefresh={getApiData}
      >
        <Area {...config} theme={currentTheme} />
      </ChartWrapper>
    </CardWrapper>
  );
};

export default OptimizationDistribution;

export {
  renderAreaStyle,
  renderAnnotationsContent,
  renderAnnotationsPosition,
  renderTooltipFormatter,
  renderTooltipCustomContent
};
