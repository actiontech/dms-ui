import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';

import { Pie, PieConfig } from '@ant-design/plots';

import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import { typeChartChildrenProps } from '../..';
import { IDBTypeAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';
import {
  renderTooltipCustomContent,
  renderTooltipFormatter
} from './index.data';

export interface ITaskDetail extends typeChartChildrenProps {
  dataSource: IDBTypeAuditPlan;
}

const TaskDetail = (props: ITaskDetail) => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const { apiLoading, errorInfo, dataLength, refreshFuc, dataSource } = props;

  const { sharedTheme, sqleTheme } = useThemeStyleData();
  const [data, setData] = useState<PieConfig['data']>([]);

  const taskNumberRef = useRef<number>(0);

  useEffect(() => {
    setData(
      dataSource?.data?.length
        ? dataSource?.data?.map((item) => {
            return {
              name: item.audit_plan_type,
              value: item.audit_plan_count ?? '',
              desc: item.audit_plan_desc ?? ''
            };
          })
        : []
    );
  }, [apiLoading, dataSource]);

  const config: PieConfig = {
    data,
    autoFit: true,
    appendPadding: 20,
    angleField: 'value', // 数据值字段
    colorField: 'desc',
    color: sqleTheme.statistics.rectColor,
    radius: 0.9,
    innerRadius: 0.8,
    pieStyle: {
      stroke: sqleTheme.projectOverview.ScanTask.detail.stroke,
      strokeOpacity: 1,
      lineWidth: 4,
      lineCap: 'round'
    },
    label: false,
    // todo: 分页的分页器样式 -> 不支持自定义
    legend: {
      layout: 'horizontal', // 水平
      position: 'bottom',
      flipPage: true,
      maxRow: 1,
      pageNavigator: {
        marker: {
          style: {
            fill: sharedTheme.uiToken.colorTextTertiary,
            inactiveFill: sharedTheme.uiToken.colorTextQuaternary
          }
        }
      },
      reversed: false,
      animate: false,
      itemSpacing: 16,
      offsetY: -5,
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
          stroke: `${sqleTheme.statistics.rectColorName.color4}20`,
          shadowColor: `${sqleTheme.statistics.rectColorName.color5}20`,
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
          marginTop: '2px'
        },
        customHtml: (container, view, datum, filteredData) => {
          const currentTaskNumber =
            filteredData?.reduce((prev, next) => prev + next.value, 0) ?? 0;
          taskNumberRef.current = currentTaskNumber;
          return formatParamsBySeparator(currentTaskNumber);
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
          marginTop: '4px'
        },
        content: t('reportStatistics.databaseSourceOrder.sourceTotal')
      }
    },
    tooltip: {
      fields: ['name', 'value'],
      formatter: renderTooltipFormatter,
      customContent: (title: string, _dataSource: any) => {
        return renderTooltipCustomContent(
          _dataSource,
          sharedTheme,
          taskNumberRef.current
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
    ],
    state: {
      active: {
        style: {
          lineWidth: 5,
          stroke: sharedTheme.basic.colorWhite,
          offsetY: 4
        }
      }
    }
  };

  return (
    <ChartWrapper
      loading={apiLoading}
      errorInfo={errorInfo}
      dataLength={dataLength}
      emptyCont={t('common.tip.no_data')}
      onRefresh={() => {
        refreshFuc();
      }}
    >
      <Pie {...config} theme={currentTheme} />
    </ChartWrapper>
  );
};

export default TaskDetail;
