import {
  ListProjectsOrderByEnum,
  ListProjectsFilterByProjectPriorityEnum,
  ExportProjectsOrderByEnum,
  ListProjectsV2OrderByEnum,
  ListProjectsV2FilterByProjectPriorityEnum
} from './index.enum';

import {
  IListProjectReply,
  IAddProjectReq,
  IAddProjectReply,
  IListBusinessTagsReply,
  ICreateBusinessTagReq,
  IGenericResp,
  IUpdateBusinessTagReq,
  ICheckDBServicesPrivilegesReq,
  ICheckDBServicesPrivilegesReply,
  IDBServiceConnectionReq,
  IDBServicesConnectionReply,
  IDBServicesConnectionReq,
  IDBServicesConnectionReqReply,
  IImportProjectsReq,
  IImportDBServicesOfProjectsReq,
  IPreviewImportProjectsReply,
  IGetProjectTipsReply,
  IUpdateProjectReq,
  IListEnvironmentTagsReply,
  IListProjectReplyV2,
  IAddProjectReqV2,
  IAddProjectReplyV2,
  IImportProjectsReqV2,
  IImportDBServicesOfProjectsReqV2,
  IPreviewImportProjectsReplyV2,
  IUpdateProjectReqV2
} from '../common.d';

export interface IListProjectsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListProjectsOrderByEnum;

  filter_by_name?: string;

  filter_by_uid?: string;

  filter_by_project_uids?: string[];

  filter_by_project_priority?: ListProjectsFilterByProjectPriorityEnum;

  filter_by_desc?: string;
}

export interface IListProjectsReturn extends IListProjectReply {}

export interface IAddProjectParams extends IAddProjectReq {}

export interface IAddProjectReturn extends IAddProjectReply {}

export interface IListBusinessTagsParams {
  page_index?: number;

  page_size: number;
}

export interface IListBusinessTagsReturn extends IListBusinessTagsReply {}

export interface ICreateBusinessTagParams extends ICreateBusinessTagReq {}

export interface ICreateBusinessTagReturn extends IGenericResp {}

export interface IUpdateBusinessTagParams extends IUpdateBusinessTagReq {
  business_tag_uid: string;
}

export interface IUpdateBusinessTagReturn extends IGenericResp {}

export interface IDeleteBusinessTagParams {
  business_tag_uid: string;
}

export interface IDeleteBusinessTagReturn extends IGenericResp {}

export interface ICheckDBServicesPrivilegesParams
  extends ICheckDBServicesPrivilegesReq {}

export interface ICheckDBServicesPrivilegesReturn
  extends ICheckDBServicesPrivilegesReply {}

export interface IDBServicesConnectionParams extends IDBServiceConnectionReq {}

export interface IDBServicesConnectionReturn
  extends IDBServicesConnectionReply {}

export interface ICheckGlobalDBServicesConnectionsParams
  extends IDBServicesConnectionReq {}

export interface ICheckGlobalDBServicesConnectionsReturn
  extends IDBServicesConnectionReqReply {}

export interface IExportProjectsParams {
  order_by?: ExportProjectsOrderByEnum;

  filter_by_name?: string;

  filter_by_uid?: string;
}

export interface IImportProjectsParams extends IImportProjectsReq {}

export interface IImportProjectsReturn extends IGenericResp {}

export interface IImportDBServicesOfProjectsParams
  extends IImportDBServicesOfProjectsReq {}

export interface IImportDBServicesOfProjectsReturn extends IGenericResp {}

export interface IImportDBServicesOfProjectsCheckParams {
  db_services_file?: any;
}

export interface IPreviewImportProjectsParams {
  projects_file?: any;
}

export interface IPreviewImportProjectsReturn
  extends IPreviewImportProjectsReply {}

export interface IGetProjectTipsParams {
  project_uid?: string;
}

export interface IGetProjectTipsReturn extends IGetProjectTipsReply {}

export interface IUpdateProjectParams extends IUpdateProjectReq {
  project_uid: string;
}

export interface IUpdateProjectReturn extends IGenericResp {}

export interface IDelProjectParams {
  project_uid: string;
}

export interface IDelProjectReturn extends IGenericResp {}

export interface IArchiveProjectParams {
  project_uid: string;
}

export interface IArchiveProjectReturn extends IGenericResp {}

export interface IListEnvironmentTagsParams {
  project_uid: string;

  page_index?: number;

  page_size: number;
}

export interface IListEnvironmentTagsReturn extends IListEnvironmentTagsReply {}

export interface ICreateEnvironmentTagParams {
  project_uid: string;

  environment_name: string;
}

export interface ICreateEnvironmentTagReturn extends IGenericResp {}

export interface IUpdateEnvironmentTagParams {
  project_uid: string;

  environment_tag_uid: string;

  environment_name: string;
}

export interface IUpdateEnvironmentTagReturn extends IGenericResp {}

export interface IDeleteEnvironmentTagParams {
  environment_tag_uid: string;

  project_uid: string;
}

export interface IDeleteEnvironmentTagReturn extends IGenericResp {}

export interface IUnarchiveProjectParams {
  project_uid: string;
}

export interface IUnarchiveProjectReturn extends IGenericResp {}

export interface IListProjectsV2Params {
  page_size: number;

  page_index?: number;

  order_by?: ListProjectsV2OrderByEnum;

  filter_by_name?: string;

  filter_by_uid?: string;

  filter_by_project_uids?: string[];

  filter_by_project_priority?: ListProjectsV2FilterByProjectPriorityEnum;

  filter_by_business_tag?: string;

  filter_by_desc?: string;
}

export interface IListProjectsV2Return extends IListProjectReplyV2 {}

export interface IAddProjectV2Params extends IAddProjectReqV2 {}

export interface IAddProjectV2Return extends IAddProjectReplyV2 {}

export interface IImportProjectsV2Params extends IImportProjectsReqV2 {}

export interface IImportProjectsV2Return extends IGenericResp {}

export interface IImportDBServicesOfProjectsV2Params
  extends IImportDBServicesOfProjectsReqV2 {}

export interface IImportDBServicesOfProjectsV2Return extends IGenericResp {}

export interface IImportDBServicesOfProjectsCheckV2Params {
  db_services_file?: any;
}

export interface IPreviewImportProjectsV2Params {
  projects_file?: any;
}

export interface IPreviewImportProjectsV2Return
  extends IPreviewImportProjectsReplyV2 {}

export interface IUpdateProjectV2Params extends IUpdateProjectReqV2 {
  project_uid: string;
}

export interface IUpdateProjectV2Return extends IGenericResp {}
