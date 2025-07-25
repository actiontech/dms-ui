import {
  GetSqlPerformanceInsightsMetricNameEnum,
  GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum
} from './index.enum';

import {
  IGetSqlPerformanceInsightsResp,
  IGetSqlPerformanceInsightsRelatedSQLResp,
  IGetSqlPerformanceInsightsRelatedTransactionResp
} from '../common.d';

export interface IGetSqlPerformanceInsightsParams {
  project_name: string;

  metric_name: GetSqlPerformanceInsightsMetricNameEnum;

  start_time: string;

  end_time: string;

  instance_id: string;
}

export interface IGetSqlPerformanceInsightsReturn
  extends IGetSqlPerformanceInsightsResp {}

export interface IGetSqlPerformanceInsightsRelatedSQLParams {
  project_name: string;

  instance_id: string;

  start_time: string;

  end_time: string;

  filter_source: GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum;

  order_by?: string;

  is_asc?: boolean;

  page_index: number;

  page_size: number;
}

export interface IGetSqlPerformanceInsightsRelatedSQLReturn
  extends IGetSqlPerformanceInsightsRelatedSQLResp {}

export interface IGetSqlPerformanceInsightsRelatedTransactionParams {
  project_name: string;

  instance_id: string;

  sql_id: string;
}

export interface IGetSqlPerformanceInsightsRelatedTransactionReturn
  extends IGetSqlPerformanceInsightsRelatedTransactionResp {}
