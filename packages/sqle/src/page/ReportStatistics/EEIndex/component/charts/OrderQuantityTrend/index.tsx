import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Area } from '@ant-design/plots';
import { AreaConfig } from '@ant-design/plots';
import { RangePickerProps } from 'antd/es/date-picker';

import CardWrapper from '../../../../../../components/CardWrapper';
import Icon from '@ant-design/icons/lib/components/Icon';
import { AxiosResponse } from 'axios';
import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import eventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import {
  OrderQuantityTrendAreaChartStyleWrapper,
  OrderQuantityTrendExtraStyleWrapper
} from './style';
import { BasicRangePicker } from '@actiontech/shared';
import { IconRightArrow } from '@actiontech/shared/lib/Icon';
import { IWorkflowCreatedCountsEachDayItem } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  IGetWorkflowCreatedCountEachDayV1Params,
  IGetWorkflowCreatedCountEachDayV1Return
} from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';

const dateFormat = 'YYYY-MM-DD';
type RangeValue = [Dayjs | null, Dayjs | null] | null;

/* todo:
  图表：hover y 实线，circle 的 hover 样式,
  api： tooltip 数据 新增工单？？？
*/
const OrderQuantityTrend = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sharedTheme } = useThemeStyleData();
  const defaultRangeValue: RangePickerProps['defaultValue'] = [
    dayjs().subtract(30, 'day'),
    dayjs()
  ];
  const [range, setRange] = useState<RangeValue>(defaultRangeValue);

  const [data, setData] = useState<IWorkflowCreatedCountsEachDayItem[]>([]);

  const maxVal = useMemo(() => {
    if (!data.length) {
      return {
        date: '',
        value: 0
      };
    }
    let valueFlag = {
      date: '',
      value: 0
    };
    data.forEach((item: IWorkflowCreatedCountsEachDayItem) => {
      if (typeof item?.value === 'number' && item.value > valueFlag.value) {
        valueFlag = {
          date: item?.date ?? '',
          value: item.value
        };
      }
    });
    return valueFlag;
  }, [data]);

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowCreatedCountEachDayV1Return>
  ) => {
    setData(res.data.data?.samples ?? []);
  };

  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => {
      const param: IGetWorkflowCreatedCountEachDayV1Params = {
        filter_date_from:
          range?.[0]?.format(dateFormat) ??
          defaultRangeValue[0]!.format(dateFormat),
        filter_date_to:
          range?.[1]?.format(dateFormat) ??
          defaultRangeValue[1]!.format(dateFormat)
      };
      return statistic.getWorkflowCreatedCountEachDayV1(param);
    },
    { onSuccess },
    true
  );

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Report_Statistics,
      () => {
        setRange(defaultRangeValue);
        getApiData();
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

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

  const config: AreaConfig = {
    data,
    xField: 'date',
    yField: 'value',
    appendPadding: [30, 0],
    xAxis: {
      range: [0, 1],
      tickCount: 7
    },
    yAxis: {
      animate: false,
      label: null
    },
    areaStyle: () => {
      return {
        fill: `l(90) 0:${sharedTheme.uiToken.colorPrimary}  1:#4583ff00`
      };
    },
    line: {
      size: 3,
      color: sharedTheme.uiToken.colorPrimary
    },
    smooth: true, // 是否配置平滑
    annotations: [
      {
        type: 'text',
        content: (text) => {
          return maxVal.value;
        },
        position: (xScale, yScale) => {
          return [maxVal.date, maxVal.value];
        },
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
        position: [maxVal.date, maxVal.value],
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
      fields: ['date', 'value'],
      formatter: (item: any) => {
        return {
          name: item.date,
          value: item.value
        };
      },
      customContent: (title: string, dataSource: any) => {
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
                label: t('reportStatistics.orderQuantityTrend.toolTip.label'),
                value: formatParamsBySeparator(data.value ?? 0)
              }
            ]}
            sharedTheme={sharedTheme}
          />
        );
      }
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

  return (
    <CardWrapper
      title={t('reportStatistics.orderQuantityTrend.title')}
      extraNode={
        <OrderQuantityTrendExtraStyleWrapper>
          <span className="label">
            {t('reportStatistics.orderQuantityTrend.timeLabel')}
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
        emptyCont={t('reportStatistics.orderQuantityTrend.emptyText')}
        onRefresh={getApiData}
      >
        <OrderQuantityTrendAreaChartStyleWrapper>
          <Area {...config} theme={currentTheme} />
        </OrderQuantityTrendAreaChartStyleWrapper>
      </ChartWrapper>
    </CardWrapper>
  );
};

export default OrderQuantityTrend;
