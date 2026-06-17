export interface IOperationTypeNameListItem {
  operation_type_name?: string;

  desc?: string;
}

export interface IGetOperationTypeNamesListResV1 {
  code?: number;

  data?: IOperationTypeNameListItem[];

  message?: string;
}

export interface IOperationActionListItem {
  operation_type?: string;

  operation_action?: string;

  desc?: string;
}

export interface IGetOperationActionListResV1 {
  code?: number;

  data?: IOperationActionListItem[];

  message?: string;
}

export interface IGetOperationRecordListResV1 {
  code?: number;

  data?: import('../../base/service/common').IOperationRecordListItem[];

  message?: string;

  total_nums?: number;
}

export interface IGetOperationRecordListV1Params {
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

export interface IGetOperationRecordListV1Return
  extends IGetOperationRecordListResV1 {}

export interface IGetExportOperationRecordListV1Params {
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

export interface IGetOperationActionListReturn
  extends IGetOperationActionListResV1 {}

export interface IGetOperationTypeNameListReturn
  extends IGetOperationTypeNamesListResV1 {}
