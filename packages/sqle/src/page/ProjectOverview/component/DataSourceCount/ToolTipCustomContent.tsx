import { useTranslation } from 'react-i18next';
import ChartTooltip from '../../../../components/ChartCom/ChartTooltip';
import { DBHealthEnum } from './index.enum';
import { formatParamsBySeparator } from '@actiontech/dms-kit';
import { SharedTheme } from '@actiontech/dms-kit';
import { SqleTheme } from '../../../../types/theme.type';

interface IToolTipCustomContentProps {
  dataSource: Array<{
    value?: string;
    data?: {
      value: string;
      category: DBHealthEnum;
    };
  }>;
  sharedTheme: SharedTheme;
  sqleTheme: SqleTheme;
}

const ToolTipCustomContent: React.FC<IToolTipCustomContentProps> = ({
  dataSource,
  sharedTheme,
  sqleTheme
}) => {
  const { t } = useTranslation();

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
