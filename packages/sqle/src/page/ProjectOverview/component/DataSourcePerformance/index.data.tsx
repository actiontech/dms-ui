import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { SqleTheme } from '../../../../types/theme.type';
import { t } from '../../../../locale';
import { Tooltip } from '@ant-design/plots';

const defaultItemKey = 'performance-default-key';

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.instance_name,
    value: item.avg_performance_improve
  };
};

const renderTooltipCustomContent = (
  dataSource: Array<{ name: string; value: number }>,
  sqleTheme: SqleTheme,
  sharedTheme: SharedTheme
) => {
  const data = dataSource[0];
  if (!data) return null;
  if (data.name.startsWith(defaultItemKey)) return null;
  return (
    <ChartTooltip
      titleData={{
        dotColor:
          sqleTheme.projectOverview.DataSourcePerformance.toolTip.dotColor,
        text: data.name
      }}
      listData={[
        {
          label: t(
            'projectManage.projectOverview.dataSourcePerformance.toolTip.label'
          ),
          value: `${floatToPercent(data.value)}%`
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

const labelFormatter = (value: string) =>
  value.startsWith(defaultItemKey) ? '' : value;

export {
  renderTooltipFormatter,
  renderTooltipCustomContent,
  defaultItemKey,
  labelFormatter
};
