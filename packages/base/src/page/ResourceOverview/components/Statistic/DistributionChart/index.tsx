import { useRef, useState, useEffect } from 'react';
import { Pie, PieConfig, Tooltip } from '@ant-design/plots';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import ChartWrapper from 'sqle/src/components/ChartCom/ChartWrapper';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import ChartTooltip from 'sqle/src/components/ChartCom/ChartTooltip';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';
import { useChangeTheme } from '@actiontech/shared/lib/features';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.name,
    value: item.value
  };
};

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme,
  totalNumber: number
) => {
  const data = dataSource[0];
  if (!data) return null;
  const currentColor = data?.color;
  return (
    <ChartTooltip
      sharedTheme={sharedTheme}
      titleData={{
        dotColor: currentColor,
        text: data.name
      }}
      listData={[
        {
          label: i18n.t(
            'resourceOverview.distributionChart.sourceNumItem'
          ) as string,
          value: data.value
        },
        {
          label: i18n.t(
            'resourceOverview.distributionChart.sourceProportionItem'
          ) as string,
          value: floatToNumberPercent(data.value, totalNumber)
        }
      ]}
    />
  );
};

const DistributionChart = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sqleTheme, sharedTheme, baseTheme } = useThemeStyleData();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const sourceTotalNumberRef = useRef<number>(0);

  const {
    data: dataSource,
    loading,
    refresh: getApiData
  } = useRequest(() =>
    DmsApi.ResourceOverviewService.GetResourceOverviewResourceTypeDistributionV1().then(
      (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.map((item) => {
            return {
              name: item.resource_type,
              value: item.count
            };
          });
        } else {
          setErrorMessage(res.data.message ?? t('common.unknownError'));
        }
      }
    )
  );

  const config: PieConfig = {
    data: dataSource ?? [],
    appendPadding: 20,
    angleField: 'value', // 数据值字段
    colorField: 'name',
    color: sqleTheme.statistics.rectColor,
    radius: 0.9,
    innerRadius: 0.85,
    pieStyle: {
      stroke: baseTheme.resourceOverview.chart.pieStroke,
      strokeOpacity: 1,
      lineWidth: 4,
      lineCap: 'round'
    },
    label: false,
    legend: {
      layout: 'vertical',
      position: 'left',
      flipPage: false,
      reversed: false,
      animate: false,
      itemSpacing: 16,
      offsetY: -10,
      textAlign: 'center',
      itemName: {
        style: {
          fill: sqleTheme.reportStatistics.DatabaseSourceOrder.default
            .colorTextTertiary,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'PlusJakartaSans Medium'
        }
      },
      marker: {
        symbol: 'circle',
        style: {
          lineWidth: 5,
          shadowBlur: 5,
          stroke: baseTheme.resourceOverview.chart.markStroke,
          shadowColor: baseTheme.resourceOverview.chart.markShowdowColor,
          textAlign: 'center'
        }
      }
    },
    statistic: {
      title: {
        style: {
          fontSize: '24px',
          lineHeight: '32px',
          height: '32px',
          color:
            sqleTheme.reportStatistics.DatabaseSourceOrder.default.colorText,
          fontWeight: 700,
          fontFamily: 'PlusJakartaSans Medium',
          marginTop: '10px'
        },
        customHtml: (container, view, datum, filteredData) => {
          const totalNumber =
            filteredData?.reduce((prev, next) => prev + next.value, 0) ?? 0;
          sourceTotalNumberRef.current = totalNumber;
          return formatParamsBySeparator(totalNumber);
        }
      },
      content: {
        style: {
          fontSize: '12px',
          lineHeight: '20px',
          height: '20px',
          color:
            sqleTheme.reportStatistics.DatabaseSourceOrder.default
              .colorTextTertiary,
          fontWeight: 400,
          marginTop: '14px'
        },
        content: t('resourceOverview.distributionChart.sourceTotal')
      }
    },
    tooltip: {
      fields: ['name', 'value'],
      formatter: renderTooltipFormatter,
      customContent: (title: string, data: any[]) =>
        renderTooltipCustomContent(
          data,
          sharedTheme,
          sourceTotalNumberRef.current
        )
    },
    interactions: [
      {
        type: 'element-selected'
      },
      {
        type: 'element-active'
      }
    ],
    state: {
      active: {
        style: {
          lineWidth: 0,
          stroke: baseTheme.resourceOverview.chart.activeStroke,
          offsetY: 4
        }
      }
    }
  };

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Resource_Overview_Page,
      () => {
        getApiData();
      }
    );

    return unsubscribe;
  }, [getApiData]);

  return (
    <ChartWrapper
      loading={loading}
      errorInfo={errorMessage}
      dataLength={dataSource?.length}
      emptyCont={t('resourceOverview.distributionChart.emptyText')}
      onRefresh={() => {
        getApiData();
      }}
    >
      <Pie {...config} theme={currentTheme} />
    </ChartWrapper>
  );
};

export default DistributionChart;
export { renderTooltipFormatter, renderTooltipCustomContent };
