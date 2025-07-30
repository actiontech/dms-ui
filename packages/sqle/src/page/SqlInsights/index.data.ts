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

// 自动刷新间隔枚举
export enum AutoRefreshIntervalEnum {
  '10s' = 10000,
  '30s' = 30000,
  '1m' = 60000,
  '5m' = 300000,
  '15m' = 900000,
  '30m' = 1800000,
  '1h' = 3600000,
  '2h' = 7200000,
  '1d' = 86400000
}

// 自动刷新间隔选项
export const AutoRefreshIntervalOptions = [
  {
    label: '10s',
    value: AutoRefreshIntervalEnum['10s']
  },
  {
    label: '30s',
    value: AutoRefreshIntervalEnum['30s']
  },
  {
    label: '1m',
    value: AutoRefreshIntervalEnum['1m']
  },
  {
    label: '5m',
    value: AutoRefreshIntervalEnum['5m']
  },
  {
    label: '15m',
    value: AutoRefreshIntervalEnum['15m']
  },
  {
    label: '30m',
    value: AutoRefreshIntervalEnum['30m']
  },
  {
    label: '1h',
    value: AutoRefreshIntervalEnum['1h']
  },
  {
    label: '2h',
    value: AutoRefreshIntervalEnum['2h']
  },
  {
    label: '1d',
    value: AutoRefreshIntervalEnum['1d']
  }
];

// 统一的图表高度配置
export const SQL_INSIGHTS_CHART_HEIGHT = 250;
