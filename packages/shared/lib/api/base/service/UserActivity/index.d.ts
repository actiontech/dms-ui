import {
  IListUserActivityDailyTrendReply,
  IListUserActivityHourlyDistributionReply,
  IListUserActivityModuleDistributionReply,
  IGetUserActivitySummaryReply,
  IListUserActivityUsersReply,
  IUserActivityDailyTrendItem,
  IUserActivityHourlyDistributionItem,
  IUserActivityModuleDistributionItem,
  IUserActivitySummary,
  IUserActivityUserItem
} from '../common.d';

export type {
  IUserActivityDailyTrendItem,
  IUserActivityHourlyDistributionItem,
  IUserActivityModuleDistributionItem,
  IUserActivitySummary,
  IUserActivityUserItem
};
export interface IListUserActivityDailyTrendParams {
  filter_date_from: string;

  filter_date_to: string;
}

export interface IListUserActivityDailyTrendReturn
  extends IListUserActivityDailyTrendReply {}

export interface IListUserActivityHourlyDistributionParams {
  stat_date: string;
}

export interface IListUserActivityHourlyDistributionReturn
  extends IListUserActivityHourlyDistributionReply {}

export interface IListUserActivityModuleDistributionParams {
  stat_date: string;
}

export interface IListUserActivityModuleDistributionReturn
  extends IListUserActivityModuleDistributionReply {}

export interface IGetUserActivitySummaryParams {
  stat_date: string;
}

export interface IGetUserActivitySummaryReturn
  extends IGetUserActivitySummaryReply {}

export interface IListUserActivityUsersParams {
  filter_date_from: string;

  filter_date_to: string;

  page_index: number;

  page_size: number;
}

export interface IListUserActivityUsersReturn
  extends IListUserActivityUsersReply {}
