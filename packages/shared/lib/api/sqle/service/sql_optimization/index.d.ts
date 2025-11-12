import {
  IGetOptimizationRecordsRes,
  IOptimizeSQLReq,
  IOptimizeSQLRes,
  IGetOptimizationRecordRes,
  IGetOptimizationSQLsRes,
  IGetOptimizationSQLRes,
  IGetDBPerformanceImproveOverviewResp,
  IGetOptimizationOverviewResp,
  IGetOptimizationDetailRes
} from '../common.d';

import { GetOptimizationRecordsV2FilterStatusEnum } from './index.enum';

export interface IGetOptimizationRecordsParams {
  fuzzy_search?: string;

  filter_instance_name?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  page_index: number;

  page_size: number;

  project_name: string;
}

export interface IGetOptimizationRecordsReturn
  extends IGetOptimizationRecordsRes {}

export interface IOptimizeSQLReqParams extends IOptimizeSQLReq {
  project_name: string;

  instance_name?: string;

  schema_name?: string;

  db_type?: string;

  sql_content?: string;

  optimization_name: string;

  input_sql_file?: any;

  input_mybatis_xml_file?: any;

  input_zip_file?: any;

  git_http_url?: string;

  git_user_name?: string;

  git_user_password?: string;
}

export interface IOptimizeSQLReqReturn extends IOptimizeSQLRes {}

export interface IGetOptimizationRecordReqParams {
  project_name: string;

  optimization_record_id: string;

  sql?: string;
}

export interface IGetOptimizationRecordReqReturn
  extends IGetOptimizationRecordRes {}

export interface IGetOptimizationSQLsParams {
  page_index: number;

  page_size: number;

  project_name: string;

  optimization_record_id: string;
}

export interface IGetOptimizationSQLsReturn extends IGetOptimizationSQLsRes {}

export interface IGetOptimizationReqParams {
  project_name: string;

  optimization_record_id: string;

  number: string;
}

export interface IGetOptimizationReqReturn extends IGetOptimizationSQLRes {}

export interface IGetDBPerformanceImproveOverviewParams {
  project_name: string;
}

export interface IGetDBPerformanceImproveOverviewReturn
  extends IGetDBPerformanceImproveOverviewResp {}

export interface IGetOptimizationOverviewParams {
  filter_create_time_from: string;

  filter_create_time_to: string;

  project_name: string;
}

export interface IGetOptimizationOverviewReturn
  extends IGetOptimizationOverviewResp {}

export interface IGetOptimizationRecordsV2Params {
  fuzzy_search?: string;

  filter_instance_name?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  filter_status?: GetOptimizationRecordsV2FilterStatusEnum;

  page_index: number;

  page_size: number;

  project_name: string;
}

export interface IGetOptimizationRecordsV2Return
  extends IGetOptimizationRecordsRes {}

export interface ISQLOptimizeV2Params extends IOptimizeSQLReq {
  project_name: string;

  instance_name?: string;

  schema_name?: string;

  db_type: string;

  optimization_name: string;

  sql_content?: string;

  explain_info?: string;

  metadata?: string;

  enable_high_analysis?: boolean;

  input_sql_file?: any;

  input_zip_file?: any;

  input_mybatis_xml_file?: any;

  git_http_url?: string;

  git_user_name?: string;

  git_user_password?: string;
}

export interface ISQLOptimizeV2Return extends IOptimizeSQLRes {}

export interface IGetOptimizationSQLDetailV2Params {
  project_name: string;

  optimization_record_id: string;
}

export interface IGetOptimizationSQLDetailV2Return
  extends IGetOptimizationDetailRes {}
