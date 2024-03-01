import { useTranslation } from 'react-i18next';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { DBHealthEnum } from './index.enum';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';

const ToolTipCustomContent: React.FC<{
  dataSource: Array<{
    value?: string;
    data?: {
      value: string;
      category: DBHealthEnum;
    };
  }>;
}> = ({ dataSource }) => {
  const { t } = useTranslation();
  const { sharedTheme, sqleTheme } = useThemeStyleData();

  const comListDataBySource = () => {
    const sourceData = dataSource.filter(
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

    sourceData.forEach((item) => {
      const type = item.data?.category;
      if (type && tipData[type]) {
        tipData[type].value = item.data?.value
          ? formatParamsBySeparator(item.data?.value)
          : '-';
      }
    });

    return Object.values(tipData);
  };

  if (!dataSource.length) return null;
  return (
    <ChartTooltip
      sharedTheme={sharedTheme}
      titleData={{
        dotColor: '',
        text: t('projectManage.projectOverview.dataSourceCount.title')
      }}
      listData={comListDataBySource()}
    />
  );
};

export default ToolTipCustomContent;
