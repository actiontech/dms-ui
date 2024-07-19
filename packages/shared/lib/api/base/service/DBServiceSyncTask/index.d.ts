import {
  IListDBServiceSyncTasksReply,
  IDBServiceSyncTask,
  IAddDBServiceSyncTaskReply,
  IListDBServiceSyncTaskTipsReply,
  IGetDBServiceSyncTaskReply,
  IGenericResp
} from '../common.d';

export interface IListDBServiceSyncTasksReturn
  extends IListDBServiceSyncTasksReply {}

export interface IAddDBServiceSyncTaskParams extends IDBServiceSyncTask {}

export interface IAddDBServiceSyncTaskReturn
  extends IAddDBServiceSyncTaskReply {}

export interface IListDBServiceSyncTaskTipsReturn
  extends IListDBServiceSyncTaskTipsReply {}

export interface IGetDBServiceSyncTaskParams {
  db_service_sync_task_uid: string;
}

export interface IGetDBServiceSyncTaskReturn
  extends IGetDBServiceSyncTaskReply {}

export interface IUpdateDBServiceSyncTaskParams extends IDBServiceSyncTask {
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
