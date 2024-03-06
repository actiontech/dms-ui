import i18n from 'i18next';
import { SharedTheme } from '@actiontech/shared/lib/types/theme.type';
import { Tooltip } from '@ant-design/plots';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';
import ChartTooltip from '../../../../../../components/ChartCom/ChartTooltip';

export const renderTooltipFormatter: Tooltip['formatter'] = (item) => {
  return {
    name: item.name,
    value: item.value
  };
};

export const renderTooltipCustomContent = (
  dataSource: any[],
  sharedTheme: SharedTheme,
  taskNumber: number
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
          value: floatToNumberPercent(data.value, taskNumber)
        }
      ]}
    />
  );
};
