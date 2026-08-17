import {
  GetGlobalDataExportWorkflowsFilterStatusListEnum,
  GetGlobalDataExportWorkflowsFilterByStatusEnum,
  ListAllDataExportWorkflowsFilterByStatusEnum,
  ListDataExportWorkflowsFilterByStatusEnum
} from './index.enum';

import {
  IGetGlobalDataExportWorkflowsReply,
  IListDataExportWorkflowsReply,
  IAddDataExportWorkflowReq,
  IAddDataExportWorkflowReply,
  ICancelDataExportWorkflowReq,
  IGenericResp,
  ICheckDataExportWorkflowTemplateUsedReply,
  IGetDataExportWorkflowReply,
  IApproveDataExportWorkflowPayload,
  IRejectDataExportWorkflowReq
} from '../common.d';

export interface IGetGlobalDataExportWorkflowsParams {
  filter_status_list?: GetGlobalDataExportWorkflowsFilterStatusListEnum[];

  filter_db_service_uid?: string;

  filter_current_step_assignee_user_id?: string;

  filter_project_uids?: string[];

  filter_project_uid?: string;

  page_size: number;

  page_index?: number;

  filter_by_status?: GetGlobalDataExportWorkflowsFilterByStatusEnum;

  filter_by_create_user_uid?: string;

  filter_current_step_assignee_user_uid?: string;

  filter_by_db_service_uid?: string;

  fuzzy_keyword?: string;

  check_user_can_access?: boolean;

  current_user_id?: string;

  viewable_db_service_uids?: string[];

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  filter_update_time_from?: string;

  filter_update_time_to?: string;

  filter_by_ops_type_uid?: string;
}

export interface IGetGlobalDataExportWorkflowsReturn
  extends IGetGlobalDataExportWorkflowsReply {}

export interface IListAllDataExportWorkflowsParams {
  project_uid: string;

  page_size: number;

  page_index?: number;

  filter_by_status?: ListAllDataExportWorkflowsFilterByStatusEnum;

  filter_by_create_user_uid?: string;

  filter_current_step_assignee_user_uid?: string;

  filter_by_db_service_uid?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  fuzzy_keyword?: string;

  filter_workflow_template_id?: number;

  filter_by_ops_type_uid?: string;
}

export interface IListAllDataExportWorkflowsReturn
  extends IListDataExportWorkflowsReply {}

export interface IListDataExportWorkflowsParams {
  project_uid: string;

  page_size: number;

  page_index?: number;

  filter_by_status?: ListDataExportWorkflowsFilterByStatusEnum;

  filter_by_create_user_uid?: string;

  filter_current_step_assignee_user_uid?: string;

  filter_by_db_service_uid?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  fuzzy_keyword?: string;

  filter_workflow_template_id?: number;

  filter_by_ops_type_uid?: string;
}

export interface IListDataExportWorkflowsReturn
  extends IListDataExportWorkflowsReply {}

export interface IAddDataExportWorkflowParams
  extends IAddDataExportWorkflowReq {
  project_uid: string;
}

export interface IAddDataExportWorkflowReturn
  extends IAddDataExportWorkflowReply {}

export interface ICancelDataExportWorkflowParams
  extends ICancelDataExportWorkflowReq {
  project_uid: string;
}

export interface ICancelDataExportWorkflowReturn extends IGenericResp {}

export interface ICheckDataExportWorkflowTemplateUsedParams {
  project_uid: string;

  workflow_template_id: number;
}

export interface ICheckDataExportWorkflowTemplateUsedReturn
  extends ICheckDataExportWorkflowTemplateUsedReply {}

export interface IGetDataExportWorkflowParams {
  data_export_workflow_uid: string;

  project_uid: string;
}

export interface IGetDataExportWorkflowReturn
  extends IGetDataExportWorkflowReply {}

export interface IApproveDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;

  payload?: IApproveDataExportWorkflowPayload;
}

export interface IApproveDataExportWorkflowReturn extends IGenericResp {}

export interface IExportDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IExportDataExportWorkflowReturn extends IGenericResp {}

export interface IDownloadOriginalDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;

  unmasking_workflow_uid: string;
}

export interface IRejectDataExportWorkflowParams
  extends IRejectDataExportWorkflowReq {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IRejectDataExportWorkflowReturn extends IGenericResp {}
