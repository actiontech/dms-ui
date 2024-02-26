import i18n from 'i18next';
import { throttle, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { memo, useEffect, useMemo, useState, useRef } from 'react';
import { Column, ColumnConfig, Plot, Tooltip } from '@ant-design/plots';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';
import useGetConfig from '../../../../../../components/ChartCom/ChartTooltip/useGetConfig';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';

export interface ILicenseColumn {
  data: ColumnConfig['data'];
  onReady: ColumnConfig['onReady'];
}

const renderLabelFormatter = (text: string, singleWidth: number) => {
  const currentLength = text.length;
  const subNum = singleWidth - 2 <= 0 ? 1 : singleWidth - 2;
  return singleWidth && currentLength > singleWidth
    ? text.substring(0, subNum) + '...'
    : text;
};

const renderLabelContent = (data: { [key: string]: any }) => {
  return !data.limit
    ? data.value
    : `${floatToNumberPercent(data.value, data.limit)}`;
};

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.type,
    value: item.value
  };
};

const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme
) => {
  const data = dataSource[0]?.data;
  if (!data) return null;
  const currentColor = dataSource[0]?.color;
  const listData = [
    {
      label: i18n.t('reportStatistics.licenseStatistics.used') as string,
      value: data.value
    }
  ];
  data.limit &&
    listData.push({
      label: i18n.t('reportStatistics.licenseStatistics.proportion') as string,
      value: floatToNumberPercent(data.value, data.limit)
    });
  return (
    <ChartTooltip
      sharedTheme={sharedTheme}
      titleData={{
        dotColor: currentColor,
        text: data.type
      }}
      listData={listData}
    />
  );
};

const labelFontSize = 12;

const LicenseColumn = memo(
  ({ data, onReady }: ILicenseColumn) => {
    const { t } = useTranslation();
    const { currentTheme } = useChangeTheme();
    const { sharedTheme, sqleTheme } = useThemeStyleData();
    const { getDomStyles } = useGetConfig(sqleTheme);
    const [singleWidth, setSingleWidth] = useState<number>(0);
    const [wrapperWidth, setWrapperWidth] = useState<number>(0);
    const chartWrapperRef = useRef<{
      getChart: () => Plot<ColumnConfig>;
    } | null>(null);

    useEffect(() => {
      const handleResize = throttle(() => {
        const chartWrapper = chartWrapperRef.current;
        if (chartWrapper) {
          setWrapperWidth(
            chartWrapper?.getChart().container.getBoundingClientRect()?.width
          );
        }
      }, 300);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      if (!data.length || !wrapperWidth) {
        setSingleWidth(0);
        return;
      }
      setSingleWidth(Math.floor(wrapperWidth / data.length / labelFontSize));
    }, [data, wrapperWidth]);

    const config: ColumnConfig = useMemo(() => {
      return {
        data,
        autoFit: true,
        xField: 'type',
        yField: 'value',
        columnStyle: {
          radius: 4,
          fill: sqleTheme.reportStatistics.LicenseStatistics.LicenseColumn
            .defaultColor,
          strokeOpacity: 0
        },
        columnBackground: {
          style: {
            fill: sqleTheme.reportStatistics.LicenseStatistics.LicenseColumn
              .fillColor.columnBackground,
            fillOpacity: 1
          }
        },
        xAxis: {
          animate: false,
          line: null,
          label: {
            autoEllipsis: true,
            autoHide: false,
            /**
            todo: 实现label的字符溢出隐藏的问题
            目前实现方式：当前图表的容器宽度发生改变时，计算当前单个柱形图需要的字符个数；当前 label 的字符宽度大于柱形单个宽度，截取当前的字符 + '...'；否则展示全部字符。
             */
            formatter: (text: string) =>
              renderLabelFormatter(text, singleWidth),
            style: {
              fill: sqleTheme.reportStatistics.LicenseStatistics.LicenseColumn
                .fillColor.xAxis,
              fontSize: labelFontSize,
              fontWeight: 400,
              lineHeight: 20,
              width: 80,
              textAlign: 'center',
              textBaseline: 'middle'
            }
          }
        },
        yAxis: {
          animate: false,
          line: null,
          grid: null,
          label: null
        },
        label: {
          offsetY: 10,
          content: renderLabelContent,
          fields: ['value'],
          position: 'top',
          style: {
            fontSize: 12,
            lineHeight: 30,
            height: 30,
            fontWeight: 700,
            fontFamily: 'PlusJakartaSans Medium',
            fill: sharedTheme.uiToken.colorText
          }
        },
        tooltip: {
          showMarkers: false,
          fields: ['type', 'value'],
          formatter: renderTooltipFormatter,
          customContent: (title: string, dataSource: any[]) =>
            renderTooltipCustomContent(dataSource, sharedTheme),
          domStyles: getDomStyles(190)
        },
        interactions: [{ type: 'element-highlight' }],
        state: {
          active: {
            style: {
              lineWidth: 0,
              fill: sqleTheme.reportStatistics.LicenseStatistics.LicenseColumn
                .fillColor.state.active
            }
          },
          inactive: {
            style: {
              lineWidth: 0,
              fill: sharedTheme.uiToken.colorFill,
              opacity: 1
            }
          }
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, singleWidth, sqleTheme, t]);

    return (
      <Column
        {...config}
        onReady={onReady}
        theme={currentTheme}
        ref={chartWrapperRef}
      />
    );
  },
  (pre, next) => {
    return isEqual(pre?.data, next?.data);
  }
);

export default LicenseColumn;

export {
  renderLabelFormatter,
  renderLabelContent,
  renderTooltipFormatter,
  renderTooltipCustomContent
};
