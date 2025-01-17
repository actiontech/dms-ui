import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useState } from 'react';
import { Tooltip, Treemap } from '@ant-design/plots';
import { TreemapConfig } from '@ant-design/plots/es/components/treemap';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import { AxiosResponse } from 'axios';
import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';
import useGetConfig from '../../../../../../components/ChartCom/ChartTooltip/useGetConfig';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { IGetWorkflowPercentCountedByInstanceTypeV1Return } from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import { IWorkflowPercentCountedByInstanceType } from '@actiontech/shared/lib/api/sqle/service/common';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { useChangeTheme } from '@actiontech/shared/lib/features';

const renderLabelContent = (obj: { [key: string]: any }) => {
  return obj.name ?? '';
};

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.name,
    value: item.value
  };
};

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme,
  totalNum: number
) => {
  const data = dataSource[0]?.data?.data;
  if (!data) return null;
  const currentColor = dataSource[0]?.color;
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
            'reportStatistics.databaseTypeOrder.tooltip.number'
          ) as string,
          value: formatParamsBySeparator(data.value)
        },
        {
          label: i18n.t(
            'reportStatistics.databaseTypeOrder.tooltip.proportion'
          ) as string,
          value: floatToNumberPercent(data.value, totalNum)
        }
      ]}
    />
  );
};

/**
 * todo: 图表的多行 label
  - 从antd plots的自有属性上，多行文本居中对齐并未解决
 */
const DatabaseTypeOrder = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { sqleTheme, sharedTheme } = useThemeStyleData();
  const { getDomStyles } = useGetConfig(sqleTheme);
  const [totalNum, setTotalNum] = useState<number>(0);

  const [data, setData] = useState<TreemapConfig['data']>({
    name: 'root',
    children: []
  });

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowPercentCountedByInstanceTypeV1Return>
  ) => {
    const childrenData: { name: string; value: number }[] | unknown[] = [];
    let total = 0;
    (res.data.data?.workflow_percents ?? []).forEach(
      (item: IWorkflowPercentCountedByInstanceType) => {
        const { instance_type, count } = item || {};
        total += count ?? 0;
        childrenData.push({
          name: instance_type ?? '',
          value: count ?? 0
        });
      }
    );
    setTotalNum(total);
    setData({
      name: 'root',
      children: childrenData
    });
  };

  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => statistic.getWorkflowPercentCountedByInstanceTypeV1(),
    { onSuccess }
  );

  const config: TreemapConfig = {
    data,
    legend: false,
    // color
    colorField: 'value',
    color: sqleTheme.statistics.rectColor,
    rectStyle: {
      lineWidth: 4,
      radius: 4,
      radiusTopLeft: 4,
      radiusTopRight: 4,
      radiusBottomRight: 4,
      radiusBottomLeft: 4,
      lineCap: 'round',
      lineJoin: 'round',
      fontSize: sqleTheme.reportStatistics.DatabaseTypeOrder.default.fontSize
    },
    // ------
    label: {
      style: {
        // fontSize:
        //   themeStyleData.reportStatistics.DatabaseTypeOrder.default.fontSize,
        fontFamily: 'PlusJakartaSans Medium',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 19,
        opacity: 0.8,
        fill: '#fff'
      },
      /**
       * todo: label text 多行的文本的居中问题
       */
      content: renderLabelContent,
      fields: ['name', 'value']
    },
    // ------
    tooltip: {
      fields: ['name', 'value'],
      formatter: renderTooltipFormatter,
      customContent: (title: string, dataSource: any[]) =>
        renderTooltipCustomContent(dataSource, sharedTheme, totalNum),
      domStyles: getDomStyles(170)
    }
  };

  return (
    <ChartWrapper
      loading={loading}
      errorInfo={errorMessage}
      emptyCont={t('reportStatistics.databaseTypeOrder.emptyText')}
      onRefresh={getApiData}
      dataLength={data?.children.length}
    >
      <Treemap
        className="database-type-order-charts"
        {...config}
        theme={currentTheme}
      />
    </ChartWrapper>
  );
};

export default DatabaseTypeOrder;

export {
  renderLabelContent,
  renderTooltipFormatter,
  renderTooltipCustomContent
};
