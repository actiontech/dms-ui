import { typeTaskItem } from '.';
import { defaultItemKey } from '../../index.data';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';
import { t } from '../../../../../../locale';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { SqleTheme } from '../../../../../../types/theme.type';

export const barChartLabelContent: (data: typeTaskItem) => string = (data) => {
  if (!data.type) return '';
  if (data.type.startsWith(defaultItemKey)) {
    return t(
      'projectManage.projectOverview.auditPlanClassification.dataSourceType'
    );
  }
  return data.type;
};

export const barChartToolTipCustomContent: (
  sharedTheme: SharedTheme,
  sqleTheme: SqleTheme,
  dataSource: any
) => JSX.Element | null = (sharedTheme, sqleTheme, dataSource) => {
  if (!dataSource?.length) return null;
  if (dataSource?.[0]?.title?.startsWith(defaultItemKey)) return null;
  const [, itemData] = dataSource ?? [];
  return (
    <ChartTooltip
      sharedTheme={sharedTheme}
      titleData={{
        dotColor: sqleTheme.projectOverview.ScanTask.bar.toolTip.dotColor,
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
};

export const barChartStateActive = (sqleTheme: SqleTheme) => {
  return {
    lineWidth: 0,
    fill: sqleTheme.projectOverview.ScanTask.bar.activeColor,
    stroke: sqleTheme.projectOverview.ScanTask.bar.activeColor
  };
};
