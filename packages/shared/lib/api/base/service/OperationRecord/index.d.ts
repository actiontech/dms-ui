import {
  IGetOperationRecordListReply,
  IAddOperationRecordReq,
  IAddOperationRecordReply,
  IGetOperationTypeNameListReply,
  IGetOperationActionListReply,
  IGetOperationUserNameListReply
} from '../common.d';

export interface IGetOperationRecordListParams {
  filter_operate_time_from?: string;

  filter_operate_time_to?: string;

  filter_operate_project_name?: string;

  fuzzy_search_operate_user_name?: string;

  fuzzy_search_operate_content?: string;

  filter_fuzzy_operate_user_name?: string;

  filter_operate_type_names?: string[];

  filter_operate_actions?: string[];

  filter_operate_status?: string;

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

  fuzzy_search_operate_content?: string;

  filter_fuzzy_operate_user_name?: string;

  filter_operate_type_names?: string[];

  filter_operate_actions?: string[];

  filter_operate_status?: string;
}

export interface IGetOperationTypeNameListParams {}

export interface IGetOperationTypeNameListReturn
  extends IGetOperationTypeNameListReply {}

export interface IGetOperationActionListParams {}

export interface IGetOperationActionListReturn
  extends IGetOperationActionListReply {}

export interface IGetOperationUserNameListParams {
  filter_operate_project_name?: string;
}

export interface IGetOperationUserNameListReturn
  extends IGetOperationUserNameListReply {}
