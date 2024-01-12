import { useMemo, memo } from 'react';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Bar, BarConfig } from '@ant-design/plots';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';

import { typeTaskItem } from './index';
import { limitDataLength, defaultItemKey } from '../../index.data';

import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';

interface IBarChat {
  onReady: BarConfig['onReady'];
  data: typeTaskItem[];
}

const BarChat = memo(
  (props: IBarChat) => {
    const { onReady, data } = props;
    const { currentTheme } = useChangeTheme();
    const { sharedTheme, sqleTheme } = useThemeStyleData();
    const { t } = useTranslation();

    const config = useMemo(() => {
      return {
        data,
        xField: 'value',
        yField: 'type',
        autoFit: true,
        meta: {
          value: {
            alias: t(
              'projectManage.projectOverview.auditPlanClassification.taskTotal'
            )
          }
        },
        yAxis: false,
        xAxis: false,
        legend: false,
        appendPadding: [0, 0, 20, 0],
        minBarWidth: 28,
        maxBarWidth: 28,
        barStyle: {
          radius: 4,
          fill: sqleTheme.projectOverview.ScanTask.bar.fill,
          strokeOpacity: 0
        },
        barBackground: {
          style: {
            fill: sqleTheme.projectOverview.ScanTask.bar.bg,
            fillOpacity: 1
          }
        },
        label: {
          // 可手动配置 label 数据标签位置
          position: 'left',
          offsetX: -2,
          layout: { type: 'limit-in-shape' },
          style: {
            fill: sqleTheme.projectOverview.ScanTask.bar.label.fill,
            opacity: 1
          },
          labelHeight: 28,
          content: (
            data: typeTaskItem,
            mappingData: unknown,
            index: number
          ) => {
            if (!data.type) return '';
            if (data.type.startsWith(defaultItemKey)) {
              return t(
                'projectManage.projectOverview.auditPlanClassification.dataSourceType'
              );
            }
            return data.type;
          }
        },
        tooltip: {
          showMarkers: false,
          showNil: false,
          fields: ['type', 'value'],
          customContent: (title: string, dataSource: any) => {
            if (!dataSource.length) return null;
            if (dataSource[0].title.startsWith(defaultItemKey)) return null;
            const [, itemData] = dataSource ?? [];
            return (
              <ChartTooltip
                sharedTheme={sharedTheme}
                titleData={{
                  dotColor:
                    sqleTheme.projectOverview.ScanTask.bar.toolTip.dotColor,
                  text: itemData.data.type
                }}
                listData={[
                  {
                    label: t(
                      'projectManage.projectOverview.auditPlanClassification.taskTotal'
                    ),
                    value: itemData.data.value
                  }
                ]}
              />
            );
          }
        },
        // 设置画布配置 active，inactive，selected 三种状态的样式
        interactions: [{ type: 'element-active' }],
        state: {
          active: {
            style: (element: Element) => {
              return {
                lineWidth: 0,
                fill: sqleTheme.projectOverview.ScanTask.bar.activeColor,
                stroke: sqleTheme.projectOverview.ScanTask.bar.activeColor
              };
            }
          }
        },
        // 根据当前数据值 > 11 开启滚动条
        scrollbar:
          data.length > limitDataLength
            ? {
                type: 'vertical',
                animate: false,
                padding: [0, 0, 0, 0]
              }
            : undefined
      } as unknown as BarConfig;
    }, [data, t, sharedTheme, sqleTheme]);

    return <Bar {...config} onReady={onReady} theme={currentTheme} />;
  },
  (pre, next) => {
    return isEqual(pre?.data, next?.data);
  }
);

export default BarChat;
