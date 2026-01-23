import {
  IGetOperationRecordListReply,
  IAddOperationRecordReq,
  IAddOperationRecordReply
} from '../common.d';

export interface IGetOperationRecordListParams {
  filter_operate_time_from?: string;

  filter_operate_time_to?: string;

  filter_operate_project_name?: string;

  fuzzy_search_operate_user_name?: string;

  filter_operate_type_name?: string;

  filter_operate_action?: string;

  page_index: number;

  page_size: number;
}

export interface IGetOperationRecordListReturn
  extends IGetOperationRecordListReply {}

export interface IAddOperationRecordParams extends IAddOperationRecordReq {}

export interface IAddOperationRecordReturn extends IAddOperationRecordReply {}

export interface IExportOperationRecordListParams {
  filter_operate_time_from?: string;

  filter_operate_time_to?: string;

  filter_operate_project_name?: string;

  fuzzy_search_operate_user_name?: string;

  filter_operate_type_name?: string;

  filter_operate_action?: string;
}
