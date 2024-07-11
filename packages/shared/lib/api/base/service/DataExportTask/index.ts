/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IBatchGetDataExportTaskParams,
  IBatchGetDataExportTaskReturn,
  IAddDataExportTaskParams,
  IAddDataExportTaskReturn,
  IListDataExportTaskSQLsParams,
  IListDataExportTaskSQLsReturn,
  IDownloadDataExportTaskSQLsParams,
  IDownloadDataExportTaskParams
} from './index.d';

class DataExportTaskService extends ServiceBase {
  public BatchGetDataExportTask(
    params: IBatchGetDataExportTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IBatchGetDataExportTaskReturn>(
      `/v1/dms/projects/${project_uid}/data_export_tasks`,
      paramsData,
      options
    );
  }

  public AddDataExportTask(
    params: IAddDataExportTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDataExportTaskReturn>(
      `/v1/dms/projects/${project_uid}/data_export_tasks`,
      paramsData,
      options
    );
  }

  public ListDataExportTaskSQLs(
    params: IListDataExportTaskSQLsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_task_uid = paramsData.data_export_task_uid;
    delete paramsData.data_export_task_uid;

    return this.get<IListDataExportTaskSQLsReturn>(
      `/v1/dms/projects/${project_uid}/data_export_tasks/${data_export_task_uid}/data_export_task_sqls`,
      paramsData,
      options
    );
  }

  public DownloadDataExportTaskSQLs(
    params: IDownloadDataExportTaskSQLsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_task_uid = paramsData.data_export_task_uid;
    delete paramsData.data_export_task_uid;

    return this.get(
      `/v1/dms/projects/${project_uid}/data_export_tasks/${data_export_task_uid}/data_export_task_sqls/download`,
      paramsData,
      options
    );
  }

  public DownloadDataExportTask(
    params: IDownloadDataExportTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_task_uid = paramsData.data_export_task_uid;
    delete paramsData.data_export_task_uid;

    return this.get(
      `/v1/dms/projects/${project_uid}/data_export_tasks/${data_export_task_uid}/download`,
      paramsData,
      options
    );
  }
}

export default new DataExportTaskService();
