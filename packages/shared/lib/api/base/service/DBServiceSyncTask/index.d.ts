import {
  IListDBServiceSyncTasksReply,
  IAddDBServiceSyncTaskReq,
  IAddDBServiceReply,
  IListDBServiceSyncTaskTipsReply,
  IGetDBServiceSyncTaskReply,
  IUpdateDBServiceSyncTaskReq,
  IGenericResp
} from '../common.d';

export interface IListDBServiceSyncTasksReturn
  extends IListDBServiceSyncTasksReply {}

export interface IAddDBServiceSyncTaskParams extends IAddDBServiceSyncTaskReq {}

export interface IAddDBServiceSyncTaskReturn extends IAddDBServiceReply {}

export interface IListDBServiceSyncTaskTipsReturn
  extends IListDBServiceSyncTaskTipsReply {}

export interface IGetDBServiceSyncTaskParams {
  db_service_sync_task_uid: string;
}

export interface IGetDBServiceSyncTaskReturn
  extends IGetDBServiceSyncTaskReply {}

export interface IUpdateDBServiceSyncTaskParams
  extends IUpdateDBServiceSyncTaskReq {
  db_service_sync_task_uid: string;
}

export interface IUpdateDBServiceSyncTaskReturn extends IGenericResp {}

export interface IDeleteDBServiceSyncTaskParams {
  db_service_sync_task_uid: string;
}

export interface IDeleteDBServiceSyncTaskReturn extends IGenericResp {}

export interface ISyncDBServicesParams {
  db_service_sync_task_uid: string;
}

export interface ISyncDBServicesReturn extends IGenericResp {}
