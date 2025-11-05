import {
  ListAllDataExportWorkflowsFilterByStatusEnum,
  ListDataExportWorkflowsFilterByStatusEnum
} from './index.enum';

import {
  IListDataExportWorkflowsReply,
  IAddDataExportWorkflowReq,
  IAddDataExportWorkflowReply,
  ICancelDataExportWorkflowReq,
  IGenericResp,
  IGetDataExportWorkflowReply,
  IRejectDataExportWorkflowReq
} from '../common.d';

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

export interface IGetDataExportWorkflowParams {
  data_export_workflow_uid: string;

  project_uid: string;
}

export interface IGetDataExportWorkflowReturn
  extends IGetDataExportWorkflowReply {}

export interface IApproveDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IApproveDataExportWorkflowReturn extends IGenericResp {}

export interface IExportDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IExportDataExportWorkflowReturn extends IGenericResp {}

export interface IRejectDataExportWorkflowParams
  extends IRejectDataExportWorkflowReq {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IRejectDataExportWorkflowReturn extends IGenericResp {}
