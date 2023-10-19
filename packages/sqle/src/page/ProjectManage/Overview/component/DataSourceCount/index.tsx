import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChartWrapper from '../../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../../components/CardWrapper';
import { BasicButton } from '@actiontech/shared';

import { Column, ColumnConfig } from '@ant-design/plots';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import ChartTooltip from '../../../../../components/ChartCom/ChartTooltip';
import useChangeTheme from '../../../../../hooks/useChangeTheme';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { IDBTypeHealth } from '@actiontech/shared/lib/api/sqle/service/common';

export enum DBHealthEnum {
  health = 'health',
  risk = 'risk'
}

export type typeItem = {
  type: string;
  value: number;
  category: DBHealthEnum;
  instanceNames: string;
};

/**
  todo: 柱形图的 柱子宽度 与边距（组之间，单柱子之间）不能同时设置
  columnWidthRatio: 0.08, // 柱状图宽度占比 根据数据计算宽度比
  marginRatio: 0.1, // 分组中柱子之间的间距
  columnStyle: {style: {width: 12}}
  minColumnWidth: 12
  maxColumnWidth: 12
 */
const DataSourceCount = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();
  const navigate = useNavigate();

  const { projectName, projectID } = useCurrentProject();
  const { sharedTheme, sqleTheme } = useThemeStyleData();

  const [data, setData] = useState<typeItem[]>([
    {
      type: 'MySQL',
      value: 0,
      category: DBHealthEnum.risk,
      instanceNames: ''
    }
  ]);
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.GetInstanceHealthV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        const dbHealths: IDBTypeHealth[] = res.data.data ?? [];
        let comData = [
          {
            type: 'MySQL',
            value: 0,
            category: DBHealthEnum.risk,
            instanceNames: ''
          }
        ];
        if (dbHealths.length > 0) {
          comData = dbHealths.reduce<typeItem[]>((acc, cur) => {
            const health = {
              type: cur.db_type ?? '',
              value: cur.health_instance_names?.length ?? 0,
              category: DBHealthEnum.health,
              instanceNames: cur.health_instance_names?.join('、') ?? ''
            };
            const risk = {
              type: cur.db_type ?? '',
              value: cur.unhealth_instance_names?.length ?? 0,
              category: DBHealthEnum.risk,
              instanceNames: cur.unhealth_instance_names?.join('、') ?? ''
            };
            return [...acc, health, risk];
          }, []);
        }
        setData(comData);
      }
    }
  );

  const comListDataBySource = (data: any[]) => {
    const sourceData = data.filter(
      (item) => typeof item?.value !== 'undefined'
    );
    const tipData = {
      health: {
        dotColor: sqleTheme.projectOverview.DataSourceCount.health,
        label: t('projectManage.projectOverview.dataSourceCount.health'),
        value: '-'
      },
      risk: {
        dotColor: sqleTheme.projectOverview.DataSourceCount.risk,
        label: t('projectManage.projectOverview.dataSourceCount.risk'),
        value: '-'
      }
    };

    sourceData.forEach((item: any) => {
      const type: DBHealthEnum = item.data?.category;
      if (tipData[type]) {
        tipData[type].value = item.data?.value
          ? formatParamsBySeparator(item.data?.value)
          : '-';
      }
    });

    return Object.values(tipData);
  };

  const config: ColumnConfig = useMemo(() => {
    return {
      data,
      xField: 'type',
      yField: 'value',
      color: [
        sqleTheme.projectOverview.DataSourceCount.health,
        sqleTheme.projectOverview.DataSourceCount.risk
      ],
      minColumnWidth: 12,
      maxColumnWidth: 12,
      columnWidthRatio: data.length <= 3 ? 0.1 : 0.8,
      columnStyle: {
        radius: [4, 4, 0, 0]
      },
      isGroup: true, // 是否分组柱形图
      seriesField: 'category', // 分组拆分字段
      xAxis: {
        animate: false,
        line: null,
        label: {
          autoEllipsis: true,
          autoHide: false,
          style: {
            fill: sqleTheme.reportStatistics.LicenseStatistics.LicenseColumn
              .fillColor.xAxis,
            lineHeight: 20,
            textAlign: 'center',
            textBaseline: 'middle',
            width: 20
          }
        }
      },
      // todo: 因y轴的横线与数据有关，少量数据其实是比较难看的，所以先删除横线 tickInterval
      yAxis: false,
      legend: {
        layout: 'horizontal',
        position: 'top-left',
        itemName: {
          spacing: 8,
          formatter: (text: string) => {
            return text === DBHealthEnum.health
              ? t('projectManage.projectOverview.dataSourceCount.health')
              : t('projectManage.projectOverview.dataSourceCount.risk');
          },
          style: {
            fontSize: 12,
            lineHeight: 20,
            fontWeight: 'normal',
            fill: sharedTheme.uiToken.colorTextTertiary
          }
        },
        marker: (text: string, index: number, item: any) => {
          const color =
            item.name === DBHealthEnum.risk
              ? sqleTheme.projectOverview.DataSourceCount.risk
              : sqleTheme.projectOverview.DataSourceCount.health;
          return {
            style: {
              fill: color,
              r: 2,
              stroke: color,
              lineWidth: 4,
              lineJoin: 'round'
            }
          };
        }
      },
      tooltip: {
        showMarkers: false,
        fields: ['type', 'value'],
        customContent: (title: string, dataSource: any[]) => {
          if (!dataSource.length) return null;
          return (
            <ChartTooltip
              sharedTheme={sharedTheme}
              titleData={{
                dotColor: '',
                text: t('projectManage.projectOverview.dataSourceCount.title')
              }}
              listData={comListDataBySource(dataSource)}
            />
          );
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, sharedTheme, sqleTheme, data]);

  const hasData = useMemo(() => {
    return Number(data.some((item) => item.value));
  }, [data]);

  const onGetMore = () => {
    navigate(`/project/${projectID}/db-services`);
  };

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.dataSourceCount.title')}
      titleToolTips={t('projectManage.projectOverview.dataSourceCount.tips')}
      extraNode={
        <BasicButton size="small" onClick={onGetMore}>
          {t('common.showMore')}
        </BasicButton>
      }
    >
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={hasData}
        emptyCont={t('common.tip.no_data')}
        onRefresh={() => {
          getApiData();
        }}
      >
        <Column {...config} theme={currentTheme} />
      </ChartWrapper>
    </CardWrapper>
  );
};

export default DataSourceCount;
