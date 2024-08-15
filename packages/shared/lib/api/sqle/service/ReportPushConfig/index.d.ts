import {
  IGetReportPushConfigsListResV1,
  IUpdateReportPushConfigReqV1,
  IBaseRes
} from '../common.d';

export interface IGetReportPushConfigListParams {
  project_name: string;
}

export interface IGetReportPushConfigListReturn
  extends IGetReportPushConfigsListResV1 {}

export interface IUpdateReportPushConfigParams
  extends IUpdateReportPushConfigReqV1 {
  project_name: string;

  report_push_config_id: string;
}

export interface IUpdateReportPushConfigReturn extends IBaseRes {}
