export interface IUserActivitySummary {
  dau?: number;
  request_count?: number;
  avg_request_per_user?: number;
  error_count?: number;
  error_rate?: number;
  peak_hour?: number;
  peak_hour_requests?: number;
}

export interface IGetUserActivitySummaryV1Params {
  stat_date: string;
}

export interface IGetUserActivitySummaryV1Return {
  code?: number;
  message?: string;
  data?: IUserActivitySummary;
}

export interface IUserActivityDailyTrendItem {
  stat_date?: string;
  dau?: number;
  request_count?: number;
  error_count?: number;
}

export interface IGetUserActivityDailyTrendV1Params {
  filter_date_from: string;
  filter_date_to: string;
}

export interface IGetUserActivityDailyTrendV1Return {
  code?: number;
  message?: string;
  data?: IUserActivityDailyTrendItem[];
}

export interface IUserActivityModuleDistributionItem {
  module_code?: string;
  module_name?: string;
  request_count?: number;
  percent?: number;
}

export interface IGetUserActivityModuleDistributionV1Params {
  stat_date: string;
}

export interface IGetUserActivityModuleDistributionV1Return {
  code?: number;
  message?: string;
  data?: IUserActivityModuleDistributionItem[];
}

export interface IUserActivityHourlyDistributionItem {
  stat_hour?: number;
  request_count?: number;
  active_users?: number;
}

export interface IGetUserActivityHourlyDistributionV1Params {
  stat_date: string;
}

export interface IGetUserActivityHourlyDistributionV1Return {
  code?: number;
  message?: string;
  data?: IUserActivityHourlyDistributionItem[];
}

export interface IUserActivityUserItem {
  user_uid?: string;
  user_name?: string;
  active_days?: number;
  request_count?: number;
  top_module_code?: string;
  top_module_name?: string;
  last_active_at?: string;
}

export interface IGetUserActivityUsersV1Params {
  filter_date_from: string;
  filter_date_to: string;
  page_index: number;
  page_size: number;
}

export interface IGetUserActivityUsersV1Return {
  code?: number;
  message?: string;
  data?: IUserActivityUserItem[];
  total_nums?: number;
}
