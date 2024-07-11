import {
  ListProjectsOrderByEnum,
  ExportProjectsOrderByEnum
} from './index.enum';

import {
  IListProjectReply,
  IAddProjectReq,
  IAddProjectReply,
  IDBServiceConnectionReq,
  IDBServicesConnectionReply,
  IImportProjectsReq,
  IGenericResp,
  IImportDBServicesOfProjectsReq,
  IPreviewImportProjectsReply,
  IGetProjectTipsReply,
  IUpdateProjectReq
} from '../common.d';

export interface IListProjectsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListProjectsOrderByEnum;

  filter_by_name?: string;

  filter_by_uid?: string;
}

export interface IListProjectsReturn extends IListProjectReply {}

export interface IAddProjectParams extends IAddProjectReq {}

export interface IAddProjectReturn extends IAddProjectReply {}

export interface IDBServicesConnectionParams extends IDBServiceConnectionReq {}

export interface IDBServicesConnectionReturn
  extends IDBServicesConnectionReply {}

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

export interface IUnarchiveProjectParams {
  project_uid: string;
}

export interface IUnarchiveProjectReturn extends IGenericResp {}
