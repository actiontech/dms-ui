import { t } from '../../locale';

export enum DateRangeEnum {
  '24H' = '24H',
  '7D' = '7D',
  '30D' = '30D'
}

export const DateRangeOptions = [
  {
    label: t('sqlQuery.executePlan.twentyFourHours'),
    value: DateRangeEnum['24H']
  },
  {
    label: t('sqlQuery.executePlan.sevenDays'),
    value: DateRangeEnum['7D']
  },
  {
    label: t('sqlQuery.executePlan.thirtyDays'),
    value: DateRangeEnum['30D']
  }
];

// 统一的图表高度配置
export const SQL_INSIGHTS_CHART_HEIGHT = 250;
