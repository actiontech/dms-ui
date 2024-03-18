import { useState, useRef } from 'react';
import { AxiosResponse } from 'axios';
import { Pie, PieConfig, Tooltip } from '@ant-design/plots';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';

import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';
import useGetConfig from '../../../../../../components/ChartCom/ChartTooltip/useGetConfig';

import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { IGetInstancesTypePercentV1Return } from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import { IInstanceTypePercent } from '@actiontech/shared/lib/api/sqle/service/common';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';

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
            'reportStatistics.databaseSourceOrder.sourceNumItem'
          ) as string,
          value: data.value
        },
        {
          label: i18n.t(
            'reportStatistics.databaseSourceOrder.sourceProportionItem'
          ) as string,
          value: floatToNumberPercent(data.value, totalNumber)
        }
      ]}
    />
  );
};

const DatabaseSourceOrder = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sqleTheme, sharedTheme } = useThemeStyleData();
  const { getDomStyles } = useGetConfig(sqleTheme);
  const [dataSource, setData] = useState<PieConfig['data']>([]);
  const sourceTotalNumberRef = useRef<number>(0);

  const onSuccess = (res: AxiosResponse<IGetInstancesTypePercentV1Return>) => {
    setData(
      (res.data.data?.instance_type_percents ?? []).map(
        (item: IInstanceTypePercent) => {
          return {
            name: item?.type ?? '',
            value: item?.count ?? ''
          };
        }
      )
    );
  };

  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => statistic.getInstancesTypePercentV1(),
    { onSuccess }
  );

  const config: PieConfig = {
    data: dataSource,
    appendPadding: 20,
    angleField: 'value', // 数据值字段
    colorField: 'name',
    color: sqleTheme.statistics.rectColor,
    radius: 0.9,
    innerRadius: 0.85,
    pieStyle: {
      stroke: '#fff',
      strokeOpacity: 1,
      lineWidth: 4,
      lineCap: 'round'
    },
    label: false,
    // ?? 点的阴影颜色 | legend item 居中显示
    legend: {
      layout: 'horizontal', // 水平
      position: 'bottom',
      flipPage: false, // 不支持分页
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
          stroke: 'rgba(26, 206, 219, 0.2)',
          shadowColor: 'rgba(26, 206, 219, 0.2)',
          textAlign: 'center'
        }
      }
    },
    // 圆环中心的展示值
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
        customHtml: (container, view, datum, data) => {
          const totalNumber = data?.reduce((r, d) => r + d.value, 0) ?? 0;
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
        content: t('reportStatistics.databaseSourceOrder.sourceTotal')
      }
    },
    tooltip: {
      fields: ['name', 'value'],
      formatter: renderTooltipFormatter,
      customContent: (title: string, dataSource: any[]) =>
        renderTooltipCustomContent(
          dataSource,
          sharedTheme,
          sourceTotalNumberRef.current
        ),
      domStyles: getDomStyles(170)
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
          lineWidth: 5,
          stroke: '#fff',
          offsetY: 4
        }
      }
    }
  };

  return (
    <ChartWrapper
      loading={loading}
      errorInfo={errorMessage}
      dataLength={dataSource.length}
      emptyCont={t('reportStatistics.databaseSourceOrder.emptyText')}
      onRefresh={() => {
        getApiData();
      }}
    >
      <Pie {...config} theme={currentTheme} />
    </ChartWrapper>
  );
};

export default DatabaseSourceOrder;
export { renderTooltipFormatter, renderTooltipCustomContent };
