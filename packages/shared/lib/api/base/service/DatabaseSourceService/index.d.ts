import {
  IListDatabaseSourceServicesReply,
  IAddDatabaseSourceServiceReq,
  IAddDatabaseSourceServiceReply,
  IListDatabaseSourceServiceTipsReply,
  IGetDatabaseSourceServiceReply,
  IUpdateDatabaseSourceServiceReq,
  IGenericResp
} from '../common.d';

export interface IListDatabaseSourceServicesParams {
  project_uid: string;
}

export interface IListDatabaseSourceServicesReturn
  extends IListDatabaseSourceServicesReply {}

export interface IAddDatabaseSourceServiceParams
  extends IAddDatabaseSourceServiceReq {
  project_uid: string;
}

export interface IAddDatabaseSourceServiceReturn
  extends IAddDatabaseSourceServiceReply {}

export interface IListDatabaseSourceServiceTipsParams {
  project_uid: string;
}

export interface IListDatabaseSourceServiceTipsReturn
  extends IListDatabaseSourceServiceTipsReply {}

export interface IGetDatabaseSourceServiceParams {
  database_source_service_uid: string;

  project_uid: string;
}

export interface IGetDatabaseSourceServiceReturn
  extends IGetDatabaseSourceServiceReply {}

export interface IUpdateDatabaseSourceServiceParams
  extends IUpdateDatabaseSourceServiceReq {
  project_uid: string;

  database_source_service_uid: string;
}

export interface IUpdateDatabaseSourceServiceReturn extends IGenericResp {}

export interface IDeleteDatabaseSourceServiceParams {
  project_uid: string;

  database_source_service_uid: string;
}

export interface IDeleteDatabaseSourceServiceReturn extends IGenericResp {}

export interface ISyncDatabaseSourceServiceParams {
  project_uid: string;

  database_source_service_uid: string;
}

export interface ISyncDatabaseSourceServiceReturn extends IGenericResp {}
