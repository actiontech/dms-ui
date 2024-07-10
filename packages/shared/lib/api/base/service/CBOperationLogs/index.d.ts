import {
  IListCBOperationLogsReply,
  IGetCBOperationLogTipsReply
} from '../common.d';

export interface IListCBOperationLogsParams {
  project_uid: string;

  filter_operation_person_uid?: string;

  filter_operation_time_from?: string;

  filter_operation_time_to?: string;

  filter_db_service_uid?: string;

  filter_exec_result?: string;

  fuzzy_keyword?: string;

  page_size: number;

  page_index?: number;
}

export interface IListCBOperationLogsReturn extends IListCBOperationLogsReply {}

export interface IExportCBOperationLogsParams {
  project_uid: string;

  filter_operation_person_uid?: string;

  filter_operation_time_from?: string;

  filter_operation_time_to?: string;

  filter_db_service_uid?: string;

  filter_exec_result?: string;

  fuzzy_keyword?: string;
}

export interface IGetCBOperationLogTipsParams {
  project_uid: string;
}

export interface IGetCBOperationLogTipsReturn
  extends IGetCBOperationLogTipsReply {}
