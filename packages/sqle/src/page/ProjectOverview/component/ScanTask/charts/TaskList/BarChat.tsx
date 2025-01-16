import { useMemo, memo } from 'react';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Bar, BarConfig } from '@ant-design/plots';
import { typeTaskItem } from './index';
import { limitDataLength } from '../../index.data';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import {
  barChartLabelContent,
  barChartStateActive,
  barChartToolTipCustomContent
} from './index.data';
import { useChangeTheme } from '@actiontech/shared/lib/global';

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

    const config: BarConfig = useMemo(() => {
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
          content: (_data: typeTaskItem) => {
            return barChartLabelContent(_data);
          }
        },
        tooltip: {
          showMarkers: false,
          showNil: false,
          fields: ['type', 'value'],
          customContent: (title: string, dataSource: any) => {
            return barChartToolTipCustomContent(
              sharedTheme,
              sqleTheme,
              dataSource
            );
          }
        },
        // 设置画布配置 active，inactive，selected 三种状态的样式
        interactions: [{ type: 'element-active' }],
        state: {
          active: {
            style: () => {
              return barChartStateActive(sqleTheme);
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
