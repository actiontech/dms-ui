import { t } from '../../../../locale';
import { SqleTheme } from '../../../../types/theme.type';
import { DBHealthEnum } from './index.enum';

export const formatterLegendItemName = (text: string) =>
  text === DBHealthEnum.health
    ? t('projectManage.projectOverview.dataSourceCount.health')
    : t('projectManage.projectOverview.dataSourceCount.risk');

export const getLegendMarkerStyle = (
  item: { name: string; value: string },
  sqleTheme: SqleTheme
) => {
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
      lineJoin: 'round' as const
    }
  };
};
