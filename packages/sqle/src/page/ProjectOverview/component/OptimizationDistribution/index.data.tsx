import { IOptimizationRecordOverview } from '@actiontech/shared/lib/api/sqle/service/common';
import { SharedTheme } from '@actiontech/dms-kit';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { Tooltip } from '@ant-design/plots';
import { t } from '../../../../locale';

const renderAreaStyle = (sharedTheme: SharedTheme) => {
  return {
    fill: `l(90) 0:${sharedTheme.uiToken.colorPrimary}  1:#4583ff00`
  };
};

const renderAnnotationsContent = (value: number) => {
  return value;
};

const renderAnnotationsPosition = (maxVal: IOptimizationRecordOverview) => {
  return [maxVal.time, maxVal.record_number];
};

const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.time,
    value: item.record_number
  };
};

const renderTooltipCustomContent = (
  dataSource: Array<{ name: string; value: number }>,
  sharedTheme: SharedTheme
) => {
  const data = dataSource[0];
  if (!data) return null;

  return (
    <ChartTooltip
      titleData={{
        dotColor: sharedTheme.uiToken.colorPrimary,
        text: data.name
      }}
      listData={[
        {
          label: t(
            'projectManage.projectOverview.optimizationDistribution.toolTip.label'
          ),
          value: data.value
        }
      ]}
      sharedTheme={sharedTheme}
    />
  );
};

export {
  renderAreaStyle,
  renderAnnotationsContent,
  renderAnnotationsPosition,
  renderTooltipFormatter,
  renderTooltipCustomContent
};
