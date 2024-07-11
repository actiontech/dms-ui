import {
  IBatchGetDataExportTaskReply,
  IAddDataExportTaskReq,
  IAddDataExportTaskReply,
  IListDataExportTaskSQLsReply
} from '../common.d';

export interface IBatchGetDataExportTaskParams {
  project_uid: string;

  data_export_task_uids: string;
}

export interface IBatchGetDataExportTaskReturn
  extends IBatchGetDataExportTaskReply {}

export interface IAddDataExportTaskParams extends IAddDataExportTaskReq {
  project_uid: string;
}

export interface IAddDataExportTaskReturn extends IAddDataExportTaskReply {}

export interface IListDataExportTaskSQLsParams {
  project_uid: string;

  data_export_task_uid: string;

  page_size: number;

  page_index?: number;
}

export interface IListDataExportTaskSQLsReturn
  extends IListDataExportTaskSQLsReply {}

export interface IDownloadDataExportTaskSQLsParams {
  project_uid: string;

  data_export_task_uid: string;
}

export interface IDownloadDataExportTaskParams {
  project_uid: string;

  data_export_task_uid: string;
}
