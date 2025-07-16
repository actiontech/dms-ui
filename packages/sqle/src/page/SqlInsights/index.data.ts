import { t } from '../../locale';

export enum DateRangeEnum {
  '24H' = '24H',
  '7D' = '7D',
  '30D' = '30D',
  'custom' = 'custom'
}

export const DateRangeOptions = [
  {
    label: t('sqlInsights.dateRange.twentyFourHours'),
    value: DateRangeEnum['24H']
  },
  {
    label: t('sqlInsights.dateRange.sevenDays'),
    value: DateRangeEnum['7D']
  },
  {
    label: t('sqlInsights.dateRange.thirtyDays'),
    value: DateRangeEnum['30D']
  },
  {
    label: t('sqlInsights.dateRange.custom'),
    value: DateRangeEnum['custom']
  }
];

// 统一的图表高度配置
export const SQL_INSIGHTS_CHART_HEIGHT = 250;
